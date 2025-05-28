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

import { getRuntimeActionMetadata } from "~/helpers/runtime";
import type { ApplicationMonitorConfig, ApplicationMonitor } from "~/types";

import { diag, metrics, trace } from "@opentelemetry/api";

/**
 * Ensures the application monitor is initialized.
 * @throws {Error} If the application monitor is not initialized.
 */
function ensureApplicationMonitorInitialized() {
  if (!global.__OTEL_APPLICATION_MONITOR__) {
    throw new Error("Application monitor not initialized");
  }
}

/**
 * Initializes the application monitor (if not already initialized).
 * @param config - The configuration for the application monitor.
 */
export function initializeApplicationMonitor(
  config: ApplicationMonitorConfig = {},
) {
  if (global.__OTEL_APPLICATION_MONITOR__) {
    diag.warn(
      "Application monitor already initialized. Skipping initialization.",
    );
    return;
  }

  const { actionName, actionVersion } = getRuntimeActionMetadata();
  const {
    tracerName = actionName,
    tracerVersion = actionVersion,
    meterName = actionName,
    meterVersion = actionVersion,
  } = config;

  const tracer = trace.getTracer(tracerName, tracerVersion);
  const meter = metrics.getMeter(meterName, meterVersion);

  // Monitor only manages tracer and meter
  global.__OTEL_APPLICATION_MONITOR__ = { tracer, meter };
}

/**
 * Gets the global application monitor.
 * @throws {Error} If the application monitor is not initialized.
 */
export function getApplicationMonitor() {
  ensureApplicationMonitorInitialized();
  return global.__OTEL_APPLICATION_MONITOR__ as ApplicationMonitor;
}

/**
 * Sets the global application monitor.
 * @param monitor - The application monitor to set.
 */
export function setGlobalApplicationMonitor(
  monitor: ApplicationMonitor | null,
) {
  global.__OTEL_APPLICATION_MONITOR__ = monitor;
}
