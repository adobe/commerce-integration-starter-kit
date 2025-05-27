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

import { setOtelDiagLogger } from "~/api/logging";
import type { TelemetryDiagnosticsConfig } from "~/types";

import { NodeSDK, type NodeSDKConfiguration } from "@opentelemetry/sdk-node";
import { diag } from "@opentelemetry/api";
import { setGlobalApplicationMonitor } from "./monitor";

/** Get the global SDK instance. */
function getGlobalSdk() {
  return global.__OTEL_SDK__ ?? null;
}

/** Set the global SDK instance. */
function setGlobalSdk(sdkInstance: NodeSDK | null) {
  global.__OTEL_SDK__ = sdkInstance;
}

/** Ensure the telemetry module is initialized. */
export function ensureSdkInitialized() {
  if (!getGlobalSdk()) {
    throw new Error("Telemetry module not initialized");
  }
}

/** Get the SDK instance. */
export function getSDK() {
  ensureSdkInitialized();
  return getGlobalSdk() as NodeSDK;
}

/** Initialize the diagnostics logger. */
export function initializeDiagnostics(config: TelemetryDiagnosticsConfig) {
  if (getGlobalSdk()) {
    // Diagnostics can only be initialized before the telemetry SDK (otherwise they won't work).
    // If it's already initialized, we skip it.
    diag.warn(
      "Telemetry SDK already initialized, skipping diagnostics initialization",
    );

    return;
  }

  setOtelDiagLogger(config);
}

/** Initialize the telemetry module. */
export function initializeSdk(config?: Partial<NodeSDKConfiguration>) {
  if (getGlobalSdk()) {
    diag.warn(
      "Telemetry SDK already initialized, skipping telemetry initialization",
    );

    return;
  }

  try {
    const sdk = new NodeSDK(config);
    setGlobalSdk(sdk);
    sdk.start();

    diag.info("OpenTelemetry automatic instrumentation started successfully");
  } catch (error) {
    diag.error(
      "Failed to start the telemetry SDK, your application won't emit telemetry data",
      error,
    );
  }

  for (const signal of ["SIGTERM", "SIGINT", "beforeExit"]) {
    process.on(signal, async () => {
      // We always try to shutdown the SDK after the runtime action finishes.
      // But just in case something goes wrong, we have this fallback.
      if (getGlobalSdk()) {
        await shutdownSdk();
      }
    });
  }
}

/** Shutdown the telemetry module. */
export async function shutdownSdk(reason?: string) {
  const sdk = getGlobalSdk();

  if (!sdk) {
    diag.warn("Telemetry SDK not initialized, skipping telemetry shutdown");
    return;
  }

  try {
    diag.info(
      "Shutting down the telemetry SDK. No more telemetry data will be emitted",
    );

    if (reason) {
      diag.info(`Telemetry SDK shutdown reason: ${reason}`);
    }

    await sdk.shutdown();
    setGlobalSdk(null);
    setGlobalApplicationMonitor(null);

    diag.info("OpenTelemetry automatic instrumentation shutdown successful");
  } catch (error) {
    diag.error(
      "Failed to shutdown the telemetry SDK, telemetry data may not be flushed",
      error,
    );
  }
}
