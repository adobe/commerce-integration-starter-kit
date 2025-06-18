/*
  Copyright 2025 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
*/

import { AsyncLocalStorage } from "node:async_hooks";
import {
  getRuntimeActionMetadata,
  isDevelopment,
  isTelemetryEnabled,
} from "~/helpers/runtime";

import {
  ensureSdkInitialized,
  initializeDiagnostics,
  initializeSdk,
} from "~/core/sdk";

import type {
  InstrumentationConfig,
  InstrumentationContext as InstrumentationHelpers,
  EntrypointInstrumentationConfig,
} from "~/types";

import { getLogger } from "~/core/logging";
import {
  getGlobalTelemetryApi,
  initializeGlobalTelemetryApi,
} from "~/core/telemetry-api";

import {
  serializeContextIntoCarrier,
  deserializeContextFromCarrier,
} from "~/api/propagation";

import { trace, type Span, SpanStatusCode, context } from "@opentelemetry/api";

/** Wildcard signature for a function. */
// biome-ignore lint/suspicious/noExplicitAny: generic wrapper.
export type AnyFunction = (...args: any[]) => any | Promise<any>;

/** A map of key-value pairs where the values are either strings or other maps. */
export type RecursiveStringRecord = {
  [key: string]: string | RecursiveStringRecord;
};

/** AsyncLocalStorage for helpers context. */
const helpersStorage = new AsyncLocalStorage<InstrumentationHelpers>();

const UNKNOWN_ERROR_CODE = -1;
const UNKNOWN_ERROR_NAME = "Unknown Error";

/** Access helpers for the current instrumented operation. */
export function getInstrumentationHelpers(): InstrumentationHelpers {
  const context = helpersStorage.getStore();

  if (!context) {
    throw new Error(
      "getInstrumentationHelpers can only be called from within an instrumented function",
    );
  }

  return context;
}

/**
 * Instruments a function.
 * @param fn - The function to instrument.
 * @param config - The configuration for the instrumentation.
 * @returns A wrapped function with the same signature as the original function, but with telemetry instrumentation.
 *
 * @example
 * ```ts
 * const instrumentedFn = instrument(someFunction, {
 *   // Optional configuration
 *   spanConfig: {
 *     spanName: "some-span",
 *       attributes: {
 *         "some-attribute": "some-value",
 *       },
 *   },
 * });
 */
export function instrument<T extends AnyFunction>(
  fn: T,
  { spanConfig, hooks }: InstrumentationConfig<T> = {},
): (...args: Parameters<T>) => ReturnType<T> {
  const {
    spanName = fn.name,
    getBaseContext,
    ...spanOptions
  } = spanConfig ?? {};

  if (!spanName) {
    throw new Error(
      "Span name is required. Either provide a name or use a named function.",
    );
  }

  const { onSuccess, onError } = hooks ?? {};

  /** Handles a (potentially) successful result within the given span. */
  function handleResult(result: Awaited<ReturnType<T>>, span: Span) {
    // Temporal, handle pattern when we don't throw/error but instead return a "success" status.
    if (result && typeof result === "object" && "success" in result) {
      if (typeof result.success === "boolean" && result.success) {
        onSuccess?.(result, span);
        span.setStatus({ code: SpanStatusCode.OK });
      } else {
        onError?.(result, span);
        span.setStatus({ code: SpanStatusCode.ERROR });
      }
    }

    return result;
  }

  /** Handles an error result within the given span. */
  function handleError(error: unknown, span: Span) {
    span.setStatus({ code: SpanStatusCode.ERROR });
    const givenError = onError?.(error, span);

    if (givenError) {
      span.recordException(givenError);
    } else if (error instanceof Error) {
      span.recordException(error);
    } else {
      const exception = {
        code: UNKNOWN_ERROR_CODE,
        name: UNKNOWN_ERROR_NAME,
        message: `Unhandled error at "${fn.name ?? spanName}": ${error}`,
        stack: new Error().stack,
      };

      span.recordException(exception);
    }
  }

  /** Sets up the context for the current operation. */
  function setupContextHelpers(span: Span) {
    // Prepare context for cross-service propagation
    const carrier = serializeContextIntoCarrier();

    const { actionName } = getRuntimeActionMetadata();
    const { tracer, meter } = getGlobalTelemetryApi();
    const logger = getLogger(
      `${fn.name ? `${actionName}/${fn.name}` : spanName}`,
      {
        logSourceAction: false,
        level: process.env.__LOG_LEVEL,
      },
    );

    return {
      currentSpan: span,
      logger,
      tracer,
      meter,
      contextCarrier: carrier,
    } satisfies InstrumentationHelpers;
  }

  /** Sets up the span data (given to the tracer) for the current operation. */
  function setupSpanData(...args: Parameters<T>) {
    const { actionName, actionVersion } = getRuntimeActionMetadata();
    const tracer = trace.getTracer(actionName, actionVersion);
    const currentCtx = getBaseContext?.(...args) ?? context.active();

    const spanConfig = {
      ...spanOptions,
      attributes: {
        "action.name": actionName,
        ...spanOptions.attributes,
      },
    };

    return {
      currentCtx,
      spanConfig,
      tracer,
    };
  }

  /** Invokes the wrapped function and handles the result or error. */
  function runHandler(span: Span, ...args: Parameters<T>) {
    try {
      const context = setupContextHelpers(span);
      return helpersStorage.run(context, () => {
        const result = fn(...args);

        if (result instanceof Promise) {
          return result
            .then((r) => handleResult(r, span))
            .finally(() => {
              span.end();
            });
        }

        const handledResult = handleResult(result, span);
        span.end();

        return handledResult;
      });
    } catch (error) {
      handleError(error, span);
      span.end();

      throw error;
    }
  }

  return (...args) => {
    if (!isTelemetryEnabled()) {
      return fn(...args);
    }

    ensureSdkInitialized();

    const { currentCtx, spanConfig, tracer } = setupSpanData(...args);
    const handler = (span: Span) => runHandler(span, ...args);

    return tracer.startActiveSpan(spanName, spanConfig, currentCtx, handler);
  };
}

/**
 * Instruments the entrypoint of a runtime action.
 * Needs to be used ONLY with the `main` function of a runtime action.
 * @param fn - The entrypoint function to instrument.
 * @param config - The configuration for the entrypoint instrumentation.
 * @returns A wrapped function with the same signature as the original function, but with telemetry instrumentation.
 *
 * @example
 * ```ts
 * import { telemetryConfig } from "../telemetry";
 *
 * const instrumentedEntrypoint = instrumentEntrypoint(main, {
 *   ...telemetryConfig,
 *   // Optional configuration
 * });
 * ```
 */
export function instrumentEntrypoint<
  // biome-ignore lint/suspicious/noExplicitAny: generic wrapper.
  T extends (params: RecursiveStringRecord) => any,
>(fn: T, config: EntrypointInstrumentationConfig<T>) {
  /** Sets a global process.env.ENABLE_TELEMETRY variable. */
  function setTelemetryEnv(params: RecursiveStringRecord) {
    const { ENABLE_TELEMETRY = false } = params;
    const enableTelemetry = `${ENABLE_TELEMETRY}`.toLowerCase();
    process.env = {
      ...process.env,

      // Setting process.env.ENABLE_TELEMETRY directly won't work.
      // This is due to to webpack automatic env inline replacement.
      __ENABLE_TELEMETRY: enableTelemetry,
      __LOG_LEVEL: `${params.LOG_LEVEL ?? (isDevelopment() ? "debug" : "info")}`,
    };
  }

  /** Callback that will be used to retrieve the base context for the entrypoint. */
  function getPropagatedContext(params: RecursiveStringRecord) {
    function inferContextCarrier() {
      // Try to infer the parent context from the following (in order):
      // 1. A `x-telemetry-context` header.
      // 2. A `__telemetryContext` input parameter.
      // 3. A `__telemetryContext` property in `params.data`.
      const headers = (params.__ow_headers as Record<string, string>) ?? {};
      const telemetryContext =
        headers["x-telemetry-context"] ??
        params.__telemetryContext ??
        (params.data as RecursiveStringRecord)?.__telemetryContext ??
        null;

      return {
        baseCtx: context.active(),
        carrier:
          typeof telemetryContext === "string"
            ? JSON.parse(telemetryContext)
            : telemetryContext,
      };
    }

    const {
      skip: skipPropagation = false,
      getContextCarrier = inferContextCarrier,
    } = config.propagation ?? {};

    if (skipPropagation) {
      return context.active();
    }

    const { carrier, baseCtx } = getContextCarrier();
    let currentCtx = baseCtx ?? context.active();

    if (carrier) {
      currentCtx = deserializeContextFromCarrier(carrier, currentCtx);
    }

    return currentCtx;
  }

  /** Initializes the Telemetry SDK and API. */
  function setupTelemetry(params: RecursiveStringRecord) {
    const { initializeTelemetry, ...instrumentationConfig } = config;

    const { isDevelopment } = getRuntimeActionMetadata();
    const { sdkConfig, tracer, meter, diagnostics } = initializeTelemetry(
      params,
      isDevelopment,
    );

    if (diagnostics) {
      // Diagnostics only work if initialized before the telemetry SDK.
      initializeDiagnostics(diagnostics);
    }

    // Internal calls to initialize the Telemetry SDK.
    initializeSdk(sdkConfig);
    initializeGlobalTelemetryApi({ tracer, meter });

    return {
      ...instrumentationConfig,
      spanConfig: {
        getBaseContext: getPropagatedContext,
        ...instrumentationConfig.spanConfig,
      },
    };
  }

  /** Instruments the given entrypoint handler. */
  async function instrumentHandler(
    handler: T,
    { spanConfig, ...instrumentationConfig }: InstrumentationConfig<T> = {},
  ) {
    try {
      const { actionName } = getRuntimeActionMetadata();
      return instrument(handler, {
        ...instrumentationConfig,
        spanConfig: {
          spanName: `${actionName}/${fn.name}`,
          ...spanConfig,
        },
      }) as T;
    } catch (error) {
      throw new Error(`Failed to instrument entrypoint: ${error}`, {
        cause: error,
      });
    }
  }

  /** Runs the entrypoint and shuts down the Telemetry SDK. */
  async function runEntrypoint(
    instrumentedHandler: T,
    params: RecursiveStringRecord,
  ) {
    try {
      const result = instrumentedHandler(params);
      return result;
    } catch (error) {
      throw new Error(`Failed to run entrypoint: ${error}`, {
        cause: error,
      });
    }
  }

  return async (
    params: RecursiveStringRecord,
  ): Promise<Awaited<ReturnType<T>>> => {
    setTelemetryEnv(params);

    if (!isTelemetryEnabled()) {
      // Passthrough if instrumentation is not enabled.
      return fn(params);
    }

    // Instrumentation of the entrypoint (and telemetry setup) needs to happen at runtime (inside the wrapper).
    // Otherwise we can't access runtime metadata or the received parameters.
    const instrumentConfig = setupTelemetry(params);
    const instrumentedHandler = await instrumentHandler(fn, instrumentConfig);

    return runEntrypoint(instrumentedHandler, params);
  };
}
