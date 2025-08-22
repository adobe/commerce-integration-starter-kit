const {
  defineTelemetryConfig,
  getAioRuntimeResource,
  getPresetInstrumentations,
} = require("@adobe/aio-lib-telemetry");

/** The telemetry configuration to be used across all actions */
const telemetryConfig = defineTelemetryConfig((params, isDev) => {
  return {
    sdkConfig: {
      serviceName: "commerce-integration-starter-kit",
      resource: getAioRuntimeResource(),
      instrumentations: getPresetInstrumentations("simple"),
    },

    diagnostics: {
      logLevel: isDev ? "debug" : "info",
    },
  };
});

/**
 * Helper function used within the Starter Kit to determine if an instrumented action is successful.
 * @param {unknown} result - The result of the instrumented action.
 * @returns {boolean} - True if the action is successful, false otherwise.
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

module.exports = {
  telemetryConfig,
  isOperationSuccessful,
};
