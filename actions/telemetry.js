const {
  defineTelemetryConfig,
  getAioRuntimeResource,
  getPresetInstrumentations
} = require('@adobe/aio-sk-lib-telemetry')

/** The telemetry configuration to be used across all actions */
const telemetryConfig = defineTelemetryConfig((params, isDev) => {
  return {
    sdkConfig: {
      serviceName: 'commerce-integration-starter-kit',
      resource: getAioRuntimeResource(),
      instrumentations: getPresetInstrumentations('simple')
    },

    diagnostics: {
      logLevel: isDev ? 'debug' : 'info'
    }
  }
})

module.exports = {
  telemetryConfig
}
