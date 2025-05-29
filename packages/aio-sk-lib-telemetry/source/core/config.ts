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

import type { Meter } from "@opentelemetry/api";

import type { EntrypointInstrumentationConfig } from "~/types";
import { createMetricsProxy, type MetricTypes } from "~/core/metrics";

/**
 * Helper to define the telemetry config for an entrypoint.
 * @param init - The function to initialize the telemetry.
 */
export function defineTelemetryConfig(
  init: EntrypointInstrumentationConfig["initializeTelemetry"],
) {
  return {
    initializeTelemetry: init,
  };
}

/**
 * Helper to define a record of metrics.
 * 
 * @see https://opentelemetry.io/docs/concepts/signals/metrics/
 * @example
 * ```ts
 * const metrics = defineMetrics((meter) => {
 *   return {
 *     myMetric: meter.createCounter("my-metric", { description: "My metric" }),
 *   };
 * });
 * ```
 * @param createMetrics - A function that receives a meter which can be used to create the metrics.
 */
export function defineMetrics<T extends Record<string, MetricTypes>>(
  createMetrics: (meter: Meter) => T,
): T {
  return createMetricsProxy(createMetrics);
}
