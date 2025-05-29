# Local Open Telemetry Collector Telemetry Configuration

Below is a full example of how to configure the telemetry module to forward your telemetry signals using a local Open Telemetry Collector. Note that this will only work if you're running `aio app dev`. For a more comprehensive guide on how to use the telemetry library in an actual App Builder runtime action, see the [guides documentation](../../guides).

```ts
// telemetry.ts

import { 
  defineTelemetryConfig, 
  getAioRuntimeResource, 
  getPresetInstrumentations 
} from "@adobe/aio-sk-lib-telemetry";

import { 
  OTLPTraceExporterGrpc,
  OTLPLogExporterGrpc,
  OTLPMetricExporterGrpc,
  PeriodicExportingMetricReader,
  SimpleLogRecordProcessor
} from "@adobe/aio-sk-lib-telemetry/otel-api";

function localCollectorConfig(isDev: boolean) {
  if (isDev) {
    return {
      // Not specifying any export URL will default to find an Open Telemetry Collector instance in localhost.
      traceExporter: new OTLPTraceExporterGrpc(),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporterGrpc(),
      }),
      
      logRecordProcessors: [
        new SimpleLogRecordProcessor(new OTLPLogExporterGrpc()),
      ]
    }
  }

  // In production, we won't have a localhost, return empty.
  return { }
}

export const telemetryConfig = defineTelemetryConfig((params, isDev) => {
  // OpenTelemetry NodeSDK configuration.
  const sdkConfig = {
    serviceName: "my-app-builder-app",
    resource: getAioRuntimeResource(),
    instrumentations: getPresetInstrumentations('full'),

    ...localCollectorConfig(isDev)
  }

  return {
    sdkConfig,
    diagnostics: {
      logLevel: isDev ? 'debug' : 'info',
    }
  }
});
```

## References

### Links
- [Open Telemetry Collector](https://opentelemetry.io/docs/collector/)
- [Open Telemetry Collector Docker Image](https://hub.docker.com/r/otel/opentelemetry-collector)

### API Reference
- [`defineTelemetryConfig`](../../api-reference/functions/defineTelemetryConfig.md): Helper to define your telemetry configuration.
- [`getAioRuntimeResource`](../../api-reference/functions/getAioRuntimeResource.md): Returns a resource object with standard App Builder attributes for OpenTelemetry.
- [`getPresetInstrumentations`](../../api-reference/functions/getPresetInstrumentations.md): Returns a set of [OpenTelemetry instrumentations for Node.js](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node).

#### OpenTelemetry
- [`OTLPTraceExporterGrpc`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/experimental/packages/exporter-trace-otlp-grpc/src/OTLPTraceExporter.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): OTLP/gRPC exporter for traces.
- [`OTLPMetricExporterGrpc`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/experimental/packages/opentelemetry-exporter-metrics-otlp-grpc/src/OTLPMetricExporter.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): OTLP/gRPC exporter for metrics.
- [`OTLPLogExporterGrpc`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/experimental/packages/exporter-logs-otlp-grpc/src/OTLPLogExporter.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): OTLP/gRPC exporter for logs.
- [`PeriodicExportingMetricReader`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/packages/sdk-metrics/src/export/PeriodicExportingMetricReader.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): Periodically exports metrics using the provided exporter.
- [`SimpleLogRecordProcessor`](https://github.com/open-telemetry/opentelemetry-js/blob/5736c498426cacaebf53ef89b2835e61be1cee98/experimental/packages/sdk-logs/src/export/SimpleLogRecordProcessor.ts) (re-exported from [`/otel-api`](../../api-reference/README.md#opentelemetry-api)): Processes and exports log records as they are emitted.
