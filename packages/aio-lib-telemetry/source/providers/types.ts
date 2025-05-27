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

import type { Constructor } from "type-fest";

import type {
  LogRecordExporter,
  LogRecordProcessor,
} from "@opentelemetry/sdk-logs";

import type {
  MetricReader,
  PushMetricExporter,
} from "@opentelemetry/sdk-metrics";

import type {
  BufferConfig,
  SpanExporter,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-node";

import type { OTLPGRPCExporterConfigNode } from "@opentelemetry/otlp-grpc-exporter-base";
import type { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";

/** The basic fragments of a URL. */
export type UrlFragments = {
  protocol: "http" | "https" | "grpc";
  host: "localhost" | (string & {});
  port?: number;
  pathname?: string;
};

/** The supported signal export protocols.  */
export type TelemetrySignalExportProtocol =
  | "otlp-grpc"
  | "otlp-http"
  | "otlp-proto";

export type TelemetrySignalGrpcConfig = {
  via: "otlp-grpc";
  traceExporterOptions?: Omit<OTLPGRPCExporterConfigNode, "url">;
  insecure?: boolean;
};

export type TelemetrySignalHttpConfig = {
  via: "otlp-http";
  traceExporterOptions?: Omit<OTLPExporterNodeConfigBase, "url">;
};

export type TelemetrySignalProtoConfig = {
  via: "otlp-proto";
  traceExporterOptions?: Omit<OTLPExporterNodeConfigBase, "url">;
};

export type TelemetrySignalConfigMap = {
  "otlp-grpc": TelemetrySignalGrpcConfig;
  "otlp-http": TelemetrySignalHttpConfig;
  "otlp-proto": TelemetrySignalProtoConfig;
};

/** The type of telemetry signal to use. */
export type TelemetrySignal = "traces" | "metrics" | "logs";

/** The map of telemetry signals to a boolean value. */
export type TelemetrySignalMap<T extends TelemetrySignal = TelemetrySignal> = {
  [key in T]?: boolean;
};

export type TelemetryProviderBaseConfig<
  SupportedSignals extends TelemetrySignal = TelemetrySignal,
> = {
  /** The signals to export. */
  exportSignals?: TelemetrySignalMap<SupportedSignals>;

  /** Whether to batch logs. Defaults to true in production, false in development */
  batchLogs?: boolean;

  /** Whether to batch traces. Defaults to true in production, false in development */
  batchTraces?: boolean | BufferConfig;
};

/** The configuration for a telemetry provider. */
export type TelemetryProviderConfig<
  SupportedSignals extends TelemetrySignal = TelemetrySignal,
> = TelemetryProviderBaseConfig<SupportedSignals> &
  (
    | TelemetrySignalGrpcConfig
    | TelemetrySignalHttpConfig
    | TelemetrySignalProtoConfig
  );

/** Defines a telemetry provider. */
export type TelemetryProvider = {
  spanProcessors: SpanProcessor[];
  metricReader: MetricReader | null;
  logRecordProcessors: LogRecordProcessor[];
};

/** Defines a telemetry provider factory function. */
export type TelemetryProviderFactory<
  T extends TelemetrySignal = TelemetrySignal,
  C extends TelemetryProviderConfig<T> = TelemetryProviderConfig<T>,
> = (config: C) => TelemetryProvider;

/** Defines a map of endpoints where each signal is exported to. */
export type TelemetryEndpointMap = {
  tracesEndpoint: string | null;
  metricsEndpoint: string | null;
  logsEndpoint: string | null;
};

/** Defines helpful information about a telemetry protocol. */
export type TelemetryProtocolHelpers = {
  exporters: {
    TraceExporter: Constructor<SpanExporter>;
    MetricExporter: Constructor<PushMetricExporter>;
    LogExporter: Constructor<LogRecordExporter>;
  };

  port: number;
  endpoints: TelemetryEndpointMap;
};
