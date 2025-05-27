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

import { TELEMETRY_PROTOCOL_HELPERS } from "./constants";
import type {
  TelemetrySignal,
  TelemetrySignalConfigMap,
  TelemetrySignalExportProtocol,
} from "../types";

import type { BufferConfig } from "@opentelemetry/sdk-logs";
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";

import { credentials } from "@grpc/grpc-js";
import type { OTLPGRPCExporterConfigNode } from "@opentelemetry/otlp-grpc-exporter-base";

type SpanProcessorFactoryOptions<T extends TelemetrySignalExportProtocol> = {
  via: T;
  exporterOptions: TelemetrySignalConfigMap[T]["traceExporterOptions"];
  batchConfig: boolean | BufferConfig;
  insecureGrpc?: boolean;
};

/**
 * Creates a new OTLP export URL for the given base URL, protocol, and signal.
 * @param baseUrl - The base URL to use for the OTLP export.
 * @param via - The protocol to use for the OTLP export.
 * @param signal - The signal to export.
 */
function makeOtlpExportUrl(
  baseUrl: string,
  via: TelemetrySignalExportProtocol,
  signal: TelemetrySignal,
) {
  const { port, endpoints } = TELEMETRY_PROTOCOL_HELPERS[via];
  const endpoint = endpoints[`${signal}Endpoint`];

  return `${baseUrl}:${port}${endpoint ?? ""}`;
}

/**
 * Creates a new span processor for the given base URL and factory options.
 * @param baseUrl - The base URL where the span processor will export the telemetry data.
 * @param factoryOptions - Configuration for the span processor.
 */
export function makeSpanProcessor<T extends TelemetrySignalExportProtocol>(
  baseUrl: string,
  factoryOptions: SpanProcessorFactoryOptions<T>,
) {
  const { via, exporterOptions, batchConfig, insecureGrpc } = factoryOptions;
  const { exporters } = TELEMETRY_PROTOCOL_HELPERS[via];

  const url = makeOtlpExportUrl(baseUrl, via, "traces");
  const traceExporterOptions = { ...exporterOptions };

  // Add insecure credentials for gRPC if not already specified
  if (via === "otlp-grpc") {
    const grpcOptions = traceExporterOptions as OTLPGRPCExporterConfigNode;

    if (!grpcOptions.credentials && insecureGrpc) {
      grpcOptions.credentials = credentials.createInsecure();
    }
  }

  const { TraceExporter } = exporters;
  return batchConfig === false
    ? new SimpleSpanProcessor(
        new TraceExporter({ url, ...traceExporterOptions }),
      )
    : new BatchSpanProcessor(
        new TraceExporter({ url, ...traceExporterOptions }),
        batchConfig === true
          ? {
              /* Use defaults */
            }
          : batchConfig,
      );
}
