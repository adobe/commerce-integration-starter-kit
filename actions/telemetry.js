const {
  defineTelemetryConfig,
  getAioRuntimeResource,
  getPresetInstrumentations
} = require('@adobe/aio-sk-lib-telemetry')

/** The telemetry configuration used across all actions */
const telemetryConfig = defineTelemetryConfig((params, isDev) => {
  return {
    sdkConfig: {
      serviceName: 'commerce-integration-starter-kit',
      resource: getAioRuntimeResource(),
      instrumentations: getPresetInstrumentations('simple')

      // Configure where to export the telemetry signals.
      // Use `params` if you need to access some secret values.
      // spanProcessors: [],
      // logRecordProcessors: [],
      // metricReader: null
    },

    diagnostics: {
      logLevel: isDev ? 'debug' : 'error'
    }
  }
})

module.exports = {
  telemetryConfig
}
