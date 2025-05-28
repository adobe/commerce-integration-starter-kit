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

import type { DiagnosticsLogLevel, getLogger } from "~/core/logging";
import type {
  AnyFunction,
  RecursiveStringRecord,
} from "~/core/instrumentation";

import type { NodeSDKConfiguration } from "@opentelemetry/sdk-node";
import type {
  Span,
  SpanOptions,
  Context,
  Counter,
  Gauge,
  Histogram,
  Meter,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  Tracer,
  UpDownCounter,
  Attributes,
} from "@opentelemetry/api";

/** Defines events that can automatically be recorded on a span. */
export type AutomaticSpanEvents = "success" | "error" | "parameters";

/** The configuration for instrumentation. */
export type InstrumentationConfig<T extends AnyFunction> = {
  traceConfig?: {
    /**
     * The name of the span.
     * @default The name of the function.
     */
    spanName?: string;

    /** The options for the span. */
    spanOptions?: SpanOptions;

    /**
     * The events that should be automatically recorded on the span.
     * @default []
     */
    automaticSpanEvents?: AutomaticSpanEvents[];

    /** The base context to use for the started span. */
    getBaseContext?: (...args: Parameters<T>) => Context;
  };

  /** Hooks that can be used to act on a span depending on the result of the function. */
  hooks?: {
    // Result hooks.
    onSuccess?: (result: ReturnType<T>, span: Span) => void;
    onError?: (error: unknown, span: Span) => Error | undefined;
  };
};

/** The configuration for the telemetry diagnostics. */
export type TelemetryDiagnosticsConfig = {
  /** The log level for the diagnostics. */
  logLevel: DiagnosticsLogLevel;

  /**
   * The name of the logger to use for the diagnostics.
   * @default `${actionName}/otel-diagnostics`
   */
  loggerName?: string;

  /**
   * Whether to export the logs to the console.
   * @default true
   */
  exportLogs?: boolean;
};

/** Configuration related to context propagation (for distributed tracing). */
type TelemetryPropagationConfig<T extends AnyFunction> = {
  /**
   * Whether to skip the propagation of the context.
   * @default false
   */
  skip?: boolean;

  /**
   * A function that returns the carrier for the current context.
   * @param args - The arguments of the instrumented function.
   */
  getContextCarrier?: (...args: Parameters<T>) => {
    carrier: Record<string, string>;
    baseCtx?: Context;
  };
};

/** The configuration for entrypoint instrumentation. */
export type EntrypointInstrumentationConfig<
  T extends AnyFunction = AnyFunction,
> = InstrumentationConfig<T> & {
  propagation?: TelemetryPropagationConfig<T>;

  /** This function will be called at the very beginning of the action. */
  initializeTelemetry: (
    params: RecursiveStringRecord,
    isDevelopment: boolean,
  ) => Partial<TelemetryApi> & {
    sdkConfig: Partial<NodeSDKConfiguration>;
    diagnostics?: false | TelemetryDiagnosticsConfig;
  };
};

/** The different types of metrics you can create with the OpenTelemetry API. */
export type MetricTypes =
  | Counter<Attributes>
  | UpDownCounter<Attributes>
  | Gauge<Attributes>
  | Histogram<Attributes>
  | ObservableCounter<Attributes>
  | ObservableUpDownCounter<Attributes>
  | ObservableGauge<Attributes>;

/** Defines the state of the global telemetry API. These items should be set once per-application. */
export type TelemetryApi = {
  tracer: Tracer;
  meter: Meter;
};

/** The context for the current operation. */
export type InstrumentationContext = {
  /** The tracer used to create the spans. */
  tracer: Tracer;

  /** The meter used to create the metrics. */
  meter: Meter;

  /** The logger for the current operation. */
  logger: ReturnType<typeof getLogger>;

  /** The span of the current operation. */
  currentSpan: Span;

  /** Holds a carrier that can be used to propagate the active context. */
  contextCarrier: Record<string, string>;
};
