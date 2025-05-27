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

import type { Instrumentation } from "@opentelemetry/instrumentation";
import type { TelemetryProvider } from "~/providers/types";

import type { DiagnosticsLogLevel, getLogger } from "~/api/logging";
import type {
  AnyFunction,
  RecursiveStringRecord,
} from "~/core/instrumentation";

import type { NodeSDKConfiguration } from "@opentelemetry/sdk-node";
import type {
  Span,
  SpanOptions,
  SpanKind,
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

/** The preset to use for the telemetry module setup. */
export type TelemetryPreset = "simple" | "full";

/** The configuration allowed by the telemetry module. */
export interface TelemetryConfig {
  /**
   * Which instrumentations to use. You can pass a list of instrumentations or a preset.
   * Defaults to `simple` in production, `full` in development.
   */
  instrumentations?: "simple" | "full" | Instrumentation[];

  /** The service name to use for the telemetry module. */
  serviceName?: string;

  /** The service version to use for the telemetry module. */
  serviceVersion?: string;

  /** The resource attributes used in the telemetry module. */
  resource?: Record<string, string>;

  /** Which out of the box providers to use. */
  providers?: TelemetryProvider[];
}

/** Defines events that can automatically be recorded on a span. */
export type AutomaticSpanEvents = "success" | "error" | "parameters";

/** The configuration for instrumentation. */
export type InstrumentationConfig<T extends AnyFunction> = {
  meta?: {
    spanName?: string;
    spanKind?: SpanKind;
    spanOptions?: Omit<SpanOptions, "kind">;
    includePackageNameInSpanName?: boolean;
  };

  /** Whether to automatically record events on the span. */
  automaticSpanEvents?: {
    [key in AutomaticSpanEvents]?: boolean;
  };

  /** Configuration related to context propagation (for distributed tracing). */
  propagation?: {
    /**
     * Whether to try to read the context from the environment.
     * Defaults to `true` if `meta.spanKind` is `SpanKind.CLIENT` or `SpanKind.CONSUMER`
     */
    deserializeContext?: boolean;

    /**
     * Whether to try to serialize the context into a carrier.
     * Defaults to `true` if `meta.spanKind` is `SpanKind.SERVER` or `SpanKind.PRODUCER`
     */
    serializeContext?: boolean;

    /**
    /**
     * A function that receives the arguments of the instrumented function and returns the carrier for the current context.
     *
     * By default, it will try to read the headers received by the action.
     * More specifically, it will read the `x-telemetry-context` header.
     */
    getContextCarrier?: (...args: Parameters<T>) => {
      carrier: Record<string, string>;
      baseCtx?: Context;
    };
  };

  /** Hooks that can be used to act on a span depending on the result of the function. */
  hooks?: {
    // Result hooks.
    onSuccess?: (result: ReturnType<T>, span: Span) => void;
    onError?: (error: unknown, span: Span) => Error | undefined;
  };
};

export type TelemetryDiagnosticsConfig = {
  logLevel: DiagnosticsLogLevel;
  loggerName?: string;
  exportLogs?: boolean;
};

/** The configuration for entrypoint instrumentation. */
export type EntrypointInstrumentationConfig<
  T extends AnyFunction = AnyFunction,
> = {
  instrumentationConfig?: InstrumentationConfig<T>;

  /** This function will be called at the very beginning of the action. */
  initializeTelemetry: (params: RecursiveStringRecord) => {
    sdkConfig: Partial<NodeSDKConfiguration>;
    monitorConfig: Partial<
      ApplicationMonitorConfig & {
        createMetrics?: (meter: Meter) => Record<string, MetricTypes>;
      }
    >;

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
export type ApplicationMonitor<
  T extends Record<string, MetricTypes> = Record<string, MetricTypes>,
> = {
  tracer: Tracer;
  meter: Meter;
  metrics: T;
};

/** The configuration for the application monitor. */
export type ApplicationMonitorConfig = {
  tracerName?: string;
  tracerVersion?: string;
  meterName?: string;
  meterVersion?: string;
};

/** The context for the current operation. */
export type InstrumentationContext<
  T extends Record<string, MetricTypes> = Record<string, MetricTypes>,
> = {
  /** The span of the current operation. */
  currentSpan: Span;

  /** The global application monitor. */
  monitor: ApplicationMonitor<T>;

  /** The logger for the current operation. */
  logger: ReturnType<typeof getLogger>;

  /** Holds the current telemetry context and it's carrier (for propagation). */
  context: {
    current: Context;
    carrier: Record<string, string>;
  };
};
