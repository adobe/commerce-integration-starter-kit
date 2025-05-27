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

import type { TelemetryConfig, EntrypointInstrumentationConfig } from "~/types";

import { getPresetInstrumentations } from "~/core/presets";
import {
  inferTelemetryAttributesFromRuntimeMetadata,
  getRuntimeActionMetadata,
} from "~/core/runtime";

import type { NodeSDKConfiguration } from "@opentelemetry/sdk-node";
import type { MetricReader } from "@opentelemetry/sdk-metrics";

import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

/** Infers a basic configuration from the environment. */
function inferConfigFromEnv(): Required<TelemetryConfig> {
  const { isDevelopment } = getRuntimeActionMetadata();
  const {
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
    ...telemetryAttributes
  } = inferTelemetryAttributesFromRuntimeMetadata();

  return {
    serviceName,
    serviceVersion,
    providers: [],

    instrumentations: isDevelopment ? "full" : "simple",
    resource: telemetryAttributes,
  };
}

/**
 * Translates the given telemetry config into an actual NodeSDK open telemetry config.
 * @param config - The telemetry config to translate.
 */
export function makeNodeSdkConfig(config: TelemetryConfig) {
  // Use the environment inferred config as the default.
  const defaultConfig = inferConfigFromEnv();
  const {
    instrumentations = defaultConfig.instrumentations,
    providers = defaultConfig.providers,
    resource,
  } = config;

  const spanProcessors = [];
  const logRecordProcessors = [];

  let metricReader: MetricReader | null = null;

  for (const provider of providers) {
    spanProcessors.push(...provider.spanProcessors);
    logRecordProcessors.push(...provider.logRecordProcessors);

    if (provider.metricReader) {
      // This is a limitation of the current implementation of the OpenTelemetry Node SDK.
      // Only one metric reader/exporter can be used at a time. The last will prevail.
      metricReader = provider.metricReader;
    }
  }

  return {
    instrumentations: Array.isArray(instrumentations)
      ? instrumentations
      : getPresetInstrumentations(instrumentations),

    resource: resourceFromAttributes({
      ...defaultConfig.resource,
      ...resource,

      [ATTR_SERVICE_NAME]: config.serviceName ?? defaultConfig.serviceName,
      [ATTR_SERVICE_VERSION]:
        config.serviceVersion ?? defaultConfig.serviceVersion,
    }),

    spanProcessors,
    logRecordProcessors,
    metricReader: metricReader ? metricReader : undefined,
  } satisfies Partial<NodeSDKConfiguration>;
}

/**
 * Helper to define the telemetry config for an entrypoint (with type safety).
 * @param init - The function to initialize the telemetry.
 */
export function defineTelemetryConfig(
  init: EntrypointInstrumentationConfig["initializeTelemetry"],
) {
  return {
    initializeTelemetry: init,
  };
}
