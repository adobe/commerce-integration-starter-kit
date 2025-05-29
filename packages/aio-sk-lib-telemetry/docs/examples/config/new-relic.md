# New Relic Telemetry Configuration

Below is a full example of how to configure the telemetry module to forward your telemetry signals directly to New Relic using the OTLP/HTTP exporter. This configuration is suitable for both development and production environments. For more details on using the telemetry library in an App Builder runtime action, see the [guides documentation](../../guides).

```ts
// telemetry.ts

import {
  defineTelemetryConfig,
  getAioRuntimeResourceWithAttributes,
  getPresetInstrumentations
} from "@adobe/aio-sk-lib-telemetry";

import {
  OTLPTraceExporterHttp,
  OTLPLogExporterHttp,
  OTLPMetricExporterHttp,
  PeriodicExportingMetricReader,
  SimpleLogRecordProcessor
} from "@adobe/aio-sk-lib-telemetry/otel-api";

// Choose the correct endpoint for your region (see New Relic docs for EU/FedRAMP endpoints)
const NEW_RELIC_OTLP_ENDPOINT = "https://otlp.nr-data.net";

function newRelicConfig(params) {
  // Always use the HTTP exporter for New Relic (recommended by New Relic docs)
  return {
    traceExporter: new OTLPTraceExporterHttp({
      url: `${NEW_RELIC_OTLP_ENDPOINT}/v1/traces`,
      headers: {
        "api-key": params.NEW_RELIC_LICENSE_KEY,
      },
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporterHttp({
        url: `${NEW_RELIC_OTLP_ENDPOINT}/v1/metrics`,
        headers: {
          "api-key": params.NEW_RELIC_LICENSE_KEY,
        },
      }),
    }),
    logRecordProcessors: [
      new SimpleLogRecordProcessor(
        new OTLPLogExporterHttp({
          url: `${NEW_RELIC_OTLP_ENDPOINT}/v1/logs`,
          headers: {
            "api-key": params.NEW_RELIC_LICENSE_KEY,
          },
        })
      ),
    ],
  };
}

export const telemetryConfig = defineTelemetryConfig((params, isDev) => {
  // OpenTelemetry NodeSDK configuration.
  const sdkConfig = {
    serviceName: "my-app-builder-app",
    instrumentations: getPresetInstrumentations("simple"),
    resource: getAioRuntimeResourceWithAttributes({
      // Record<string, string> of custom attributes.
      "service.version": "1.0.0",
    }),

    ...newRelicConfig(params),
  };

  return {
    sdkConfig,
    diagnostics: {
      logLevel: isDev ? "debug" : "info",
    },
  };
});
```

## References

### Links
- [New Relic OpenTelemetry](https://docs.newrelic.com/docs/opentelemetry/best-practices/opentelemetry-otlp/opentelemetry-otlp-new-relic/)

### API Reference
- [`defineTelemetryConfig`](../../api-reference/functions/defineTelemetryConfig.md): Helper to define your telemetry configuration.
- [`getAioRuntimeResourceWithAttributes`](../../api-reference/functions/getAioRuntimeResourceWithAttributes.md): Returns a resource object with standard App Builder attributes for OpenTelemetry, while allowing you to add custom attributes at the same time.
- [`getPresetInstrumentations`](../../api-reference/functions/getPresetInstrumentations.md): Returns a set of [OpenTelemetry instrumentations for Node.js](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node).

#### OpenTelemetry
- [`OTLPTraceExporterHttp`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/experimental/packages/exporter-trace-otlp-http/src/platform/node/OTLPTraceExporter.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): OTLP/HTTP exporter for traces.
- [`OTLPMetricExporterHttp`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/experimental/packages/opentelemetry-exporter-metrics-otlp-http/src/platform/node/OTLPMetricExporter.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): OTLP/HTTP exporter for metrics.
- [`OTLPLogExporterHttp`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/experimental/packages/exporter-logs-otlp-http/src/platform/node/OTLPLogExporter.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): OTLP/HTTP exporter for logs.
- [`PeriodicExportingMetricReader`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/packages/sdk-metrics/src/export/PeriodicExportingMetricReader.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): Periodically exports metrics using the provided exporter.
- [`SimpleLogRecordProcessor`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/experimental/packages/sdk-logs/src/export/SimpleLogRecordProcessor.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): Processes and exports log records as they are emitted.
