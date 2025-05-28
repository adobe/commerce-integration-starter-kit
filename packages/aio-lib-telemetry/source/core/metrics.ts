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
import type { MetricTypes } from "~/types";

/**
 * Creates a metrics proxy that lazily initializes metrics when accessed.
 * @param createMetrics - Function to create metrics when meter becomes available
 */
export function createMetricsProxy<T extends Record<string, MetricTypes>>(
  createMetrics: (meter: Meter) => T,
): T {
  let initializedMetrics: T | null = null;
  let isInitializing = false;

  return new Proxy({} as T, {
    get(target, prop: string | symbol) {
      if (typeof prop === "symbol") {
        return undefined;
      }

      // Prevent circular dependencies
      if (isInitializing) {
        throw new Error(
          `Circular dependency detected: Do not access metrics inside the defineMetrics function. Only create and return metrics objects. Attempted to access "${String(prop)}"`,
        );
      }

      // Return cached metrics if available
      if (initializedMetrics) {
        return initializedMetrics[prop as keyof T];
      }

      // Lazy initialization from global monitor
      try {
        const monitor = global.__OTEL_APPLICATION_MONITOR__;
        if (!monitor?.meter) {
          throw new Error(
            `Cannot access metric "${String(prop)}": Application monitor not initialized`,
          );
        }

        isInitializing = true;
        try {
          // Create the metrics
          initializedMetrics = createMetrics(monitor.meter) as T;
        } finally {
          isInitializing = false;
        }

        return initializedMetrics[prop as keyof T];
      } catch (error) {
        throw new Error(
          `Failed to initialize metrics: ${error instanceof Error ? error.message : error}`,
        );
      }
    },
  });
}
