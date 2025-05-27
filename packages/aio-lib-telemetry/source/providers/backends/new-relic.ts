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

import { defineTelemetryProviderFactory, signals } from "../helpers";
import { makeSpanProcessor } from "../helpers/factory";
import type { TelemetrySignal } from "../types";

import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import type { SpanLimits } from "@opentelemetry/sdk-trace-node";

import { isDevelopment } from "~/core/runtime";

type NewRelicSupportedSignal = TelemetrySignal;
type NewRelicProviderConfig = {
  region: "us" | "eu";
  apiKey: string;
};

/**
 * The ingestion endpoints for New Relic.
 * @see https://docs.newrelic.com/docs/opentelemetry/best-practices/opentelemetry-otlp/
 */
const NEW_RELIC_INGESTION_ENDPOINTS = {
  us: "https://otlp.nr-data.net",
  eu: "https://otlp.eu01.nr-data.net",
} as const;

/** The default signals to send to New Relic. */
const NEW_RELIC_DEFAULT_SIGNALS = signals<NewRelicSupportedSignal>(
  "traces",
  "metrics",
  "logs",
);

/**
 * The span limits required by New Relic.
 * @see https://docs.newrelic.com/docs/opentelemetry/best-practices/opentelemetry-otlp/#attribute-limits
 */
export const NEW_RELIC_SPAN_LIMITS: SpanLimits = {
  attributeCountLimit: 64,
  attributeValueLengthLimit: 4095,
};

export const newRelic = defineTelemetryProviderFactory<
  NewRelicProviderConfig,
  NewRelicSupportedSignal
>(NEW_RELIC_DEFAULT_SIGNALS, (config, ctx) => {
  const {
    via = "otlp-grpc",
    exportSignals = NEW_RELIC_DEFAULT_SIGNALS,
    traceExporterOptions,
    apiKey,
    region,
  } = config;

  const ingestionEndpoint = NEW_RELIC_INGESTION_ENDPOINTS[region];
  const spanProcessor = makeSpanProcessor(ingestionEndpoint, {
    via,
    exporterOptions: {
      compression: CompressionAlgorithm.GZIP,
      ...traceExporterOptions,

      headers: {
        ...traceExporterOptions?.headers,
        "api-key": apiKey,
      },
    },

    batchConfig: config.batchTraces ?? !isDevelopment(),
    insecureGrpc: config.via === "otlp-grpc" && config.insecure,
  });

  return {
    spanProcessors: [spanProcessor],
    metricReader: null,
    logRecordProcessors: [],
  };
});
