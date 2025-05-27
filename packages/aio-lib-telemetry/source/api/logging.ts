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

import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";
import type Transport from "winston-transport";
import { diag, type DiagLogger, DiagLogLevel } from "@opentelemetry/api";

import { ensureSdkInitialized } from "~/core/sdk";
import { getRuntimeActionMetadata } from "~/api/runtime";
import type { TelemetryDiagnosticsConfig } from "~/types";

import type WinstonLogger from "@adobe/aio-lib-core-logging/types/WinstonLogger";
import type {
  AioLoggerConfig,
  default as AioLoggerFactory,
} from "@adobe/aio-lib-core-logging";

// If no log level is given, use [INFO].
const DEFAULT_LOG_LEVEL = "info";

/** Available log levels for the OpenTelemetry DiagLogger. */
export type DiagnosticsLogLevel = Lowercase<keyof typeof DiagLogLevel>;

function __getLoggerInternal(
  name: string,
  config?: AioLoggerConfig,
  forceSDKInitialized = true,
  addTransport = true,
  telemetryTransportOptions: Transport.TransportStreamOptions = {},
) {
  if (forceSDKInitialized) {
    ensureSdkInitialized();
  }

  // Lazy load the logger library so OpenTelemetry can load first and patch it.
  const AioLogger =
    require("@adobe/aio-lib-core-logging") as typeof AioLoggerFactory;

  const level = config?.level ?? DEFAULT_LOG_LEVEL;
  const aioLogger = AioLogger(name, {
    ...config,

    // Provider must be winston, as it's the one compatible with OpenTelemetry.
    provider: "winston",
    level,
  });

  if (addTransport) {
    // Hacky, accesses internal API of the AIO logger. Although not likely to change/break.
    // TODO: Better open a PR in: https://github.com/adobe/aio-lib-core-logging to directly support the OpenTelemetry Transport.
    const innerLogger = (aioLogger.logger as WinstonLogger).logger;
    innerLogger.add(
      new OpenTelemetryTransportV3({
        level,
        ...telemetryTransportOptions,
      }),
    );
  }

  return aioLogger;
}

/**
 * Get a logger instance.
 * @param name - The name of the logger
 * @param config - The configuration for the logger
 */
export function getLogger(name: string, config?: AioLoggerConfig) {
  return __getLoggerInternal(name, config, true);
}

/**
 * Sets the global OpenTelemetry diagnostics logger
 * @param config - The configuration for the diagnostics logger.
 */
export function setOtelDiagLogger({
  logLevel: level,
  loggerName,
  exportLogs = true,
}: TelemetryDiagnosticsConfig) {
  // AioLogger and DiagLogger use different names for some log levels.
  const aioLogLevel =
    level === "none" ? undefined : level === "all" ? "verbose" : level;

  const { actionName } = getRuntimeActionMetadata();
  const logger = __getLoggerInternal(
    loggerName ?? `${actionName}/otel-diagnostics`,
    {
      level: aioLogLevel,
      logSourceAction: false,
    },
    false,
    exportLogs,
    // Only use the OpenTelemetry transport (i.e. export diagnostic logs) if the log level is
    // set to info, warn or error. The other levels are too verbose to be exported and may expose
    // irrelevant/sensitive information. All logs will still be visible via `aio rt activation logs <id>`.
    level === "info" || level === "warn" || level === "error"
      ? { level }
      : { level: "info" },
  );

  // Wrap the logger in a DiagLogger compatible interface.
  const logLevel = level.toUpperCase() as keyof typeof DiagLogLevel;
  try {
    const diagLogger = logger as DiagLogger;
    diag.setLogger(diagLogger, {
      logLevel: DiagLogLevel[logLevel],
    });

    diag.info("OpenTelemetry diagnostics logger set successfully");
  } catch (error) {
    diag.error("Failed to set the telemetry diagnostics", error);
  }
}
