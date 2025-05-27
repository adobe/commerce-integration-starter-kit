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
} from "~/core/runtime";
import {
  ensureSdkInitialized,
  initializeDiagnostics,
  initializeTelemetry,
  shutdownTelemetry,
} from "~/core/sdk";

import type {
  InstrumentationConfig,
  InstrumentationContext as InstrumentationHelpers,
  EntrypointInstrumentationConfig,
} from "~/types";

import { getLogger } from "~/api/logging";
import {
  getApplicationMonitor,
  initializeApplicationMonitor,
} from "~/core/monitor";

import {
  serializeContextIntoCarrier,
  deserializeContextFromCarrier,
} from "~/api/propagation";

import {
  trace,
  SpanKind,
  type Span,
  SpanStatusCode,
  context,
} from "@opentelemetry/api";

/** Wildcard signature for a function. */
// biome-ignore lint/suspicious/noExplicitAny: generic wrapper.
export type AnyFunction = (...args: any[]) => any | Promise<any>;

/** A map of key-value pairs where the values are either strings or other maps. */
export type RecursiveStringRecord = {
  [key: string]: string | RecursiveStringRecord;
};

/** AsyncLocalStorage for helpers context. */
const helpersStorage = new AsyncLocalStorage<InstrumentationHelpers>();

/** Returns the carrier for the current context from the environment. */
function getContextCarrierFromEnvironment() {
  return {
    carrier: JSON.parse(process.env.__TELEMETRY_CONTEXT ?? "{}"),
    baseCtx: context.active(),
  };
}

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
 * Instrument a function.
 * @param fn - The function to instrument.
 * @param config - The configuration for the instrumentation.
 */
export function instrument<T extends AnyFunction>(
  fn: T,
  { meta, hooks, propagation, ...config }: InstrumentationConfig<T> = {},
): (...args: Parameters<T>) => ReturnType<T> {
  const {
    spanName = fn.name,
    spanOptions = {},
  } = meta ?? {};

  if (!spanName) {
    throw new Error(
      "Span name is required. Either provide a name or use a named function.",
    );
  }

  const { onSuccess, onError } = hooks ?? {};
  const {
    skip: skipPropagation = false,
    getContextCarrier = getContextCarrierFromEnvironment,
  } = propagation ?? {};

  /** Handles a (potentially) successful result within the given span. */
  function handleResult(result: Awaited<ReturnType<T>>, span: Span) {
    if (config.automaticSpanEvents?.success) {
      span.addEvent(`${fn.name ?? spanName}.success`, {
        result: JSON.stringify(result),
      });
    }

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
    if (config.automaticSpanEvents?.error) {
      span.addEvent(`${fn.name ?? spanName}.error`, {
        error: JSON.stringify(error),
      });
    }

    span.setStatus({ code: SpanStatusCode.ERROR });
    const givenError = onError?.(error, span);

    if (givenError) {
      span.recordException(givenError);
    } else if (error instanceof Error) {
      span.recordException(error);
    } else {
      const exception = {
        code: -1,
        name: "Unknown Error",
        message: `Unhandled error at "${fn.name ?? spanName}": ${error}`,
        stack: new Error().stack,
      };

      span.recordException(exception);
    }
  }

  /** Sets up the context for the current operation. */
  function setupContextHelpers(span: Span) {
    // Serialize the current context into a carrier.
    const carrier = serializeContextIntoCarrier();

    const { actionName } = getRuntimeActionMetadata();
    const monitor = getApplicationMonitor();
    const logger = getLogger(
      `${fn.name ? `${actionName}/${fn.name}` : spanName}`,
      {
        logSourceAction: false,
      },
    );

    return {
      currentSpan: span,
      logger,
      monitor,
      context: {
        current: context.active(),
        carrier: carrier,
      },
    } satisfies InstrumentationHelpers;
  }

  /** Sets up the span data (given to the tracer) for the current operation. */
  function setupSpanData(...args: Parameters<T>) {
    const { actionName, actionVersion } = getRuntimeActionMetadata();
    const tracer = trace.getTracer(actionName, actionVersion);
    let currentCtx = context.active();

    if (!skipPropagation) {
      const { carrier, baseCtx } = getContextCarrier(...args);

      if (carrier) {
        currentCtx = deserializeContextFromCarrier(carrier, baseCtx ?? currentCtx);
      }
    }

    const spanConfig = {
      ...spanOptions,
      attributes: {
        ...spanOptions.attributes,
        "action.name": actionName,
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
      if (config.automaticSpanEvents?.parameters) {
        span.addEvent(`${fn.name ?? spanName}.parameters`, {
          args: JSON.stringify(args),
        });
      }

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
 * @param fn - The entrypoint function to instrument.
 * @param config - The configuration for the entrypoint instrumentation.
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
    };

    const headers = (params.__ow_headers as Record<string, string>) ?? {};

    // If we have a context we also set it globally, this way we can automatically read it.
    if (headers?.["x-telemetry-context"]) {
      process.env = {
        ...process.env,
        __TELEMETRY_CONTEXT: headers["x-telemetry-context"],
      };
    }
  }

  /** Cleans up the resources of the Telemetry SDK. */
  async function cleanup(shutdownReason?: string) {
    if (isDevelopment()) {
      // OpenTelemetry uses a global context that does not play nice
      // with hot-reloading of `aio app dev`. Shutdown will be done
      // internally by the library when closing the dev server.
      return;
    }

    await shutdownTelemetry(shutdownReason);
  }

  /** Initializes the Telemetry SDK and Application Monitor. */
  function setupTelemetry(params: RecursiveStringRecord) {
    const { sdkConfig, monitorConfig, diagnostics } =
      config.initializeTelemetry(params);

    if (diagnostics) {
      // Diagnostics only work if initialized before the telemetry SDK.
      initializeDiagnostics(diagnostics);
    }

    // Internal calls to initialize the Telemetry SDK.
    initializeTelemetry(sdkConfig);
    initializeApplicationMonitor(monitorConfig?.createMetrics, monitorConfig);

    return config.instrumentationConfig ?? {};
  }

  /** Instruments the given entrypoint handler. */
  async function instrumentHandler(
    handler: T,
    { meta, ...instrumentationConfig }: InstrumentationConfig<T> = {},
  ) {
    try {
      const { actionName } = getRuntimeActionMetadata();
      return instrument(handler, {
        ...instrumentationConfig,
        meta: {
          ...meta,
          spanName: `${actionName}/${fn.name}`,
        },
      }) as T;
    } catch (error) {
      await cleanup(`Failed to instrument entrypoint: ${error}`);
      throw error;
    }
  }

  /** Runs the entrypoint and shuts down the Telemetry SDK. */
  async function runEntrypointAndCleanup(
    instrumentedHandler: T,
    params: RecursiveStringRecord,
  ) {
    try {
      const result = instrumentedHandler(params);

      if (result instanceof Promise) {
        return result.finally(async () => {
          await cleanup();
        });
      }

      await cleanup();
      return result;
    } catch (error) {
      await cleanup(`Failed to run entrypoint: ${error}`);
      throw error;
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

    return runEntrypointAndCleanup(instrumentedHandler, params);
  };
}
