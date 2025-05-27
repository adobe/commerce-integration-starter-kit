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

import type { JsonObject, EmptyObject } from "type-fest";

import { isDevelopment } from "~/core/runtime";
import type {
  TelemetrySignal,
  TelemetrySignalMap,
  TelemetryEndpointMap,
  TelemetryProtocolHelpers,
  TelemetryProviderConfig,
  TelemetryProvider,
} from "./types";

import { OTLPTraceExporter as OTLPTraceExporterProto } from "@opentelemetry/exporter-trace-otlp-proto";
import { OTLPTraceExporter as OTLPTraceExporterHttp } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPTraceExporter as OTLPTraceExporterGrpc } from "@opentelemetry/exporter-trace-otlp-grpc";

import { OTLPMetricExporter as OTLPMetricExporterProto } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPMetricExporter as OTLPMetricExporterHttp } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPMetricExporter as OTLPMetricExporterGrpc } from "@opentelemetry/exporter-metrics-otlp-grpc";

import { OTLPLogExporter as OTLPLogExporterProto } from "@opentelemetry/exporter-logs-otlp-proto";
import { OTLPLogExporter as OTLPLogExporterHttp } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPLogExporter as OTLPLogExporterGrpc } from "@opentelemetry/exporter-logs-otlp-grpc";

import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";

import {
  BatchLogRecordProcessor,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

/** The endpoints used by OTLP receivers. */
const TELEMETRY_ENDPOINTS = {
  tracesEndpoint: "/v1/traces",
  metricsEndpoint: "/v1/metrics",
  logsEndpoint: "/v1/logs",
} as const satisfies TelemetryEndpointMap;

/** Defines concrete data used by each telemetry protocol. */
export const TELEMETRY_PROTOCOL_HELPERS = {
  "otlp-grpc": {
    exporters: {
      TraceExporter: OTLPTraceExporterGrpc,
      MetricExporter: OTLPMetricExporterGrpc,
      LogExporter: OTLPLogExporterGrpc,
    },

    port: 4317,
    endpoints: {
      tracesEndpoint: null,
      metricsEndpoint: null,
      logsEndpoint: null,
    },
  },
  "otlp-http": {
    exporters: {
      TraceExporter: OTLPTraceExporterHttp,
      MetricExporter: OTLPMetricExporterHttp,
      LogExporter: OTLPLogExporterHttp,
    },

    port: 4318,
    endpoints: TELEMETRY_ENDPOINTS,
  },
  "otlp-proto": {
    exporters: {
      TraceExporter: OTLPTraceExporterProto,
      MetricExporter: OTLPMetricExporterProto,
      LogExporter: OTLPLogExporterProto,
    },

    port: 4318,
    endpoints: TELEMETRY_ENDPOINTS,
  },
} as const satisfies Record<string, TelemetryProtocolHelpers>;

/**
 * Creates a map of signals to be enabled.
 *
 * @example
 * ```ts
 * const signals = signals("traces", "metrics");
 * // { traces: true, metrics: true, logs: false }
 * ```
 */
export function signals<T extends TelemetrySignal = TelemetrySignal>(
  ...signals: T[]
): TelemetrySignalMap<T> {
  const noDuplicates = new Set(signals);
  const output = {
    traces: false,
    metrics: false,
    logs: false,
  };

  for (const signal of noDuplicates) {
    output[signal] = true;
  }

  return output satisfies TelemetrySignalMap<T>;
}

type TelemetryProviderFactoryContext = {
  TraceProcessor: typeof SimpleSpanProcessor | typeof BatchSpanProcessor;
  LogProcessor:
    | typeof SimpleLogRecordProcessor
    | typeof BatchLogRecordProcessor;
};

/** Helper function to create a new telemetry provider factory. */
export function defineTelemetryProviderFactory<
  FactoryConfig extends JsonObject = EmptyObject,
  SupportedSignal extends TelemetrySignal = TelemetrySignal,
  Config extends
    TelemetryProviderConfig<SupportedSignal> = TelemetryProviderConfig<SupportedSignal>,
>(
  defaultSignals: TelemetrySignalMap<SupportedSignal>,
  factory: (
    config: Config & FactoryConfig,
    ctx: TelemetryProviderFactoryContext,
  ) => TelemetryProvider,
) {
  /** Checks in the given export map if the given signal should be exported. */
  const shouldExportSignal = (
    signal: TelemetrySignal,
    map: TelemetrySignalMap<SupportedSignal>,
  ) =>
    signal in map &&
    map[signal as keyof TelemetrySignalMap<SupportedSignal>] === true;

  return (config: Config & FactoryConfig) => {
    const {
      via,
      batchLogs,
      batchTraces,
      options,
      exportSignals = defaultSignals,
    } = config;
    const { exporters, port, endpoints } = TELEMETRY_PROTOCOL_HELPERS[via];

    // Batch logs and traces if not specified, or if we're in production.
    const shouldBatchLogs = batchLogs ?? !isDevelopment();
    const LogProcessor = shouldBatchLogs
      ? BatchLogRecordProcessor
      : SimpleLogRecordProcessor;

    const shouldBatchTraces = batchTraces ?? !isDevelopment();
    const TraceProcessor = shouldBatchTraces
      ? BatchSpanProcessor
      : SimpleSpanProcessor;

    return factory(config, {
      LogProcessor,
      TraceProcessor,
    });
  };
}
