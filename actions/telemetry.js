const { defineTelemetryConfig, makeNodeSdkConfig } = require('@adobe/aio-lib-telemetry');

/** The telemetry configuration used across all actions */
const telemetryConfig = defineTelemetryConfig((params) => {
  const sdkConfig = makeNodeSdkConfig({
    instrumentations: "full",
    serviceName: 'commerce-integration-starter-kit',
    serviceVersion: '1.0.0',
  })

  return {
    sdkConfig,
    diagnostics: {
      logLevel: 'debug'
    }
  }
})

module.exports = {
  telemetryConfig
}
