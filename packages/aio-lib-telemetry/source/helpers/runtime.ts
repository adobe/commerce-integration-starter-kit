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

import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

/** Metadata associated with a runtime action. */
type RuntimeMetadata = {
  activationId: string;
  namespace: string;
  apiHost: string;
  apiKey: string;
  isDevelopment: boolean;

  region: string;
  cloud: string;
  transactionId: string;
  actionVersion: string;
  deadline: Date | null;

  packageName: string;
  actionName: string;
};

/** The runtime metadata for the action. */
let runtimeMetadata: RuntimeMetadata | null = null;

/** Checks if the runtime is in development mode. */
export function isDevelopment() {
  // Principal way to check is using AIO_DEV, but this is only available in latest versions of the AIO CLI.
  // As a fallback, check the action version, which is (as of now) only set in production.
  return (
    process.env.AIO_DEV !== undefined ||
    process.env.__OW_ACTION_VERSION === undefined
  );
}

/** Checks if telemetry is enabled. */
export function isTelemetryEnabled() {
  if (process.env.__ENABLE_TELEMETRY) {
    return process.env.__ENABLE_TELEMETRY === "true";
  }

  // If we don't have a process.env.ENABLE_TELEMETRY, then we assume it's disabled.
  return false;
}

/** Retrieves basic metadata from the runtime environment. */
function retrieveBasicMetadata() {
  return {
    activationId: process.env.__OW_ACTIVATION_ID as string,
    namespace: process.env.__OW_NAMESPACE as string,
    apiHost: process.env.__OW_API_HOST as string,
    apiKey: process.env.__OW_API_KEY as string,
    isDevelopment: isDevelopment(),

    // The following are only set on production
    // We provide some arbitrary values for local development
    region: process.env.__OW_REGION ?? "local",
    cloud: process.env.__OW_CLOUD ?? "local",
    transactionId: process.env.__OW_TRANSACTION_ID ?? "unknown",
    actionVersion: process.env.__OW_ACTION_VERSION ?? "0.0.0 (development)",
    deadline: process.env.__OW_DEADLINE
      ? new Date(Number(process.env.__OW_DEADLINE) * 1000)
      : null,
  };
}

/** Parses the action name from the runtime environment. */
function parseActionName() {
  if (process.env.__OW_ACTION_NAME?.includes("/")) {
    const [, _, packageName, ...action] =
      process.env.__OW_ACTION_NAME?.split("/") ?? [];

    return {
      packageName,
      actionName: action.join("/"),
    };
  }

  return {
    // Old installations of AIO CLI, might use a version `aio app dev`
    // where ACTION_NAME doesn't include a package name.
    packageName: "unknown",
    actionName: process.env.__OW_ACTION_NAME as string,
  };
}

/** Gets the runtime metadata for the currently running action. */
export function getRuntimeActionMetadata(): RuntimeMetadata {
  if (runtimeMetadata) {
    // Data should not change across invocations.
    return runtimeMetadata;
  }

  runtimeMetadata = {
    ...retrieveBasicMetadata(),
    ...parseActionName(),
  };

  return runtimeMetadata;
}

/** Tries to infer the telemetry attributes from the runtime metadata. */
export function inferTelemetryAttributesFromRuntimeMetadata() {
  const meta = getRuntimeActionMetadata();
  const serviceName = meta.isDevelopment
    ? // The package name is not available in development
      `${meta.namespace}-local-development/${meta.packageName !== "unknown" ? `${meta.packageName}` : ""}`
    : `${meta.namespace}/${meta.packageName}`;

  return {
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: meta.actionVersion,

    "deployment.region": meta.region,
    "deployment.cloud": meta.cloud,
    "deployment.environment": meta.isDevelopment ? "development" : "production",

    "action.package_name": meta.packageName,
    "action.namespace": meta.namespace,
    "action.activation_id": meta.activationId,
    "action.transaction_id": meta.transactionId,

    // Potentially empty attributes.
    ...(meta.deadline
      ? { "action.deadline": meta.deadline.toISOString() }
      : {}),
  };
}
