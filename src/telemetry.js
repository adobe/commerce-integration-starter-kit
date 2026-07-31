import {
  defineTelemetryConfig,
  getAioRuntimeResource,
  getPresetInstrumentations,
} from "@adobe/aio-lib-telemetry";

/** The telemetry configuration to be used across all actions */
const telemetryConfig = defineTelemetryConfig((_params, isDev) => ({
  diagnostics: {
    logLevel: isDev ? "debug" : "info",
  },
  sdkConfig: {
    instrumentations: getPresetInstrumentations("simple"),
    resource: getAioRuntimeResource(),
    serviceName: "commerce-integration-starter-kit",
  },
}));

/**
 * Helper function used within the Starter Kit to determine if an instrumented action is successful.
 * @param {unknown} result - The result of the instrumented action.
 * @returns - True if the action is successful, false otherwise.
 */
function isOperationSuccessful(result) {
  if (
    result &&
    typeof result === "object" &&
    "success" in result &&
    typeof result.success === "boolean" &&
    result.success
  ) {
    return true;
  }
  return false;
}

export { isOperationSuccessful, telemetryConfig };
