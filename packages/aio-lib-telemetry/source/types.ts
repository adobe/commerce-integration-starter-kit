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

import type { getLogger } from "~/core/logging";
import type {
  AnyFunction,
  RecursiveStringRecord,
} from "~/core/instrumentation";

import type { NodeSDKConfiguration } from "@opentelemetry/sdk-node";
import type {
  Span,
  SpanOptions,
  Context,
  Meter,
  Tracer,
  DiagLogLevel,
} from "@opentelemetry/api";

/** Available log levels for the OpenTelemetry DiagLogger. */
export type DiagnosticsLogLevel = Lowercase<keyof typeof DiagLogLevel>;

/** Defines the names of available instrumentation presets. */
export type TelemetryInstrumentationPreset = "simple" | "full";

/** The configuration for the telemetry diagnostics. */
export interface TelemetryDiagnosticsConfig {
  /** The log level to use for the diagnostics. */
  logLevel: DiagnosticsLogLevel;

  /**
   * The name of the logger to use for the diagnostics.
   * @default `${actionName}/otel-diagnostics`
   */
  loggerName?: string;

  /**
   * Whether to make OpenTelemetry also export the diagnostic logs to the configured exporters.
   * Set to `false` if you don't want to see diagnostic logs in your observability platform.
   * @default true
   */
  exportLogs?: boolean;
}

/** Configuration related to context propagation (for distributed tracing). */
export interface TelemetryPropagationConfig<T extends AnyFunction> {
  /**
   * By default, an instrumented entrypoint will try to automatically read (and use) the context from the incoming request.
   * Set to `true` if you want to skip this automatic context propagation.
   *
   * @default false
   */
  skip?: boolean;

  /**
   * A function that returns the carrier for the current context.
   * Use it to specify where your carrier is located in the incoming parameters, when it's not one of the defaults.
   *
   * @param args - The arguments of the instrumented function.
   * @returns The carrier of the context to retrieve and an optional base context to use for the started span (defaults to the active context).
   */
  getContextCarrier?: (...args: Parameters<T>) => {
    carrier: Record<string, string>;
    baseCtx?: Context;
  };
}

/** The configuration for instrumentation. */
export interface InstrumentationConfig<T extends AnyFunction> {
  /**
   * Configuration options related to the span started by the instrumented function.
   * See also the [SpanOptions](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api._opentelemetry_api.SpanOptions.html) interface.
   */
  spanConfig?: SpanOptions & {
    /**
     * The name of the span. Defaults to the name of given function.
     * You must use a named function or a provide a name here.
     */
    spanName?: string;

    /**
     * The base context to use for the started span.
     *
     * @param args - The arguments of the instrumented function.
     * @returns The base context to use for the started span.
     */
    getBaseContext?: (...args: Parameters<T>) => Context;
  };

  /** Hooks that can be used to act on a span depending on the result of the function. */
  hooks?: {
    /**
     * A function that will be called when the instrumented function succeeds.
     * You can use it to do something with the Span.
     *
     * @param result - The result of the instrumented function.
     * @param span - The span of the instrumented function.
     */
    onSuccess?: (result: ReturnType<T>, span: Span) => void;

    /**
     * A function that will be called when the instrumented function fails.
     * You can use it to do something with the Span.
     *
     * @param error - The error produced by the instrumented function.
     * @param span - The span of the instrumented function.
     */
    onError?: (error: unknown, span: Span) => Error | undefined;
  };
}

/** The configuration options for the telemetry module. */
export interface TelemetryConfig extends Partial<TelemetryApi> {
  /**
   * The configuration options for the OpenTelemetry SDK.
   * See the [NodeSDKConfiguration](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.NodeSDKConfiguration.html) interface.
   */
  sdkConfig: Partial<NodeSDKConfiguration>;

  /** The configuration options for the telemetry diagnostics. */
  diagnostics?: false | TelemetryDiagnosticsConfig;
}

/** The configuration for entrypoint instrumentation. */
export interface EntrypointInstrumentationConfig<
  T extends AnyFunction = AnyFunction,
> extends InstrumentationConfig<T> {
  /**
   * Configuration options related to context propagation.
   * See the {@link TelemetryPropagationConfig} for the interface.
   */
  propagation?: TelemetryPropagationConfig<T>;

  /**
   * This function is called at the start of the action.
   *
   * @param params - The parameters of the action.
   * @param isDevelopment - Whether the action is running in development mode.
   * @returns The telemetry configuration to use for the action.
   */
  initializeTelemetry: (
    params: RecursiveStringRecord,
    isDevelopment: boolean,
  ) => TelemetryConfig;
}

/** Defines the global telemetry API. These items should be set once per-application. */
export interface TelemetryApi {
  /** The tracer used to create spans. */
  tracer: Tracer;

  /** The meter used to create metrics. */
  meter: Meter;
}

/** The context for the current operation. */
export interface InstrumentationContext {
  /** The global (managed by the library) tracer instance used to create spans. */
  tracer: Tracer;

  /** The global (managed by the library) meter instance used to create metrics. */
  meter: Meter;

  /** The logger for the current operation. */
  logger: ReturnType<typeof getLogger>;

  /** The span of the current operation. */
  currentSpan: Span;

  /** Holds a carrier that can be used to propagate the active context. */
  contextCarrier: Record<string, string>;
}
