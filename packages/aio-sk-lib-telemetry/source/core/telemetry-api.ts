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

import { diag, metrics, trace } from "@opentelemetry/api";

import { getRuntimeActionMetadata } from "~/helpers/runtime";
import type { TelemetryApi } from "~/types";

/**
 * Gets the global telemetry API.
 * @throws {Error} If the telemetry API is not initialized.
 * 
 * @example
 * ```ts
 * function someNonAutoInstrumentedFunction() {
 *   const { tracer } = getGlobalTelemetryApi();
 *   return tracer.startActiveSpan("some-span", (span) => {
 *     // ...
 *   });
 * }
 * ```
 */
export function getGlobalTelemetryApi() {
  ensureTelemetryApiInitialized();
  return global.__OTEL_TELEMETRY_API__ as TelemetryApi;
}

/**
 * Sets the global telemetry API.
 * @param api - The telemetry API to set.
 */
export function setGlobalTelemetryApi(api: TelemetryApi | null) {
  global.__OTEL_TELEMETRY_API__ = api;
}

/**
 * Ensures the telemetry API is initialized.
 * @throws {Error} If the telemetry API is not initialized.
 */
function ensureTelemetryApiInitialized() {
  if (!global.__OTEL_TELEMETRY_API__) {
    throw new Error("Telemetry API not initialized");
  }
}

/**
 * Initializes the telemetry API (if not already initialized).
 * @param config - The configuration for the telemetry API.
 */
export function initializeGlobalTelemetryApi(
  config: Partial<TelemetryApi> = {},
) {
  if (global.__OTEL_TELEMETRY_API__) {
    diag.warn("Telemetry API already initialized. Skipping initialization.");
    return;
  }

  const { actionName, actionVersion } = getRuntimeActionMetadata();
  const {
    tracer = trace.getTracer(actionName, actionVersion),
    meter = metrics.getMeter(actionName, actionVersion),
  } = config;

  setGlobalTelemetryApi({ tracer, meter });
}
