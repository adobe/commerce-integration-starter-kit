# API Reference

This document provides a comprehensive reference for the public API exported by the `@aio-sk-lib-telemetry` library.

## Available Imports

These are all the imports you can get from this library when importing from `@adobe/aio-sk-lib-telemetry`.

```typescript
import {
  // Configuration
  defineTelemetryConfig,
  defineMetrics,

  // Configuration Helpers
  getAioRuntimeAttributes,
  getAioRuntimeResource,
  getAioRuntimeResourceWithAttributes,
  getPresetInstrumentations,

  // Tracing Helpers
  getActiveSpan,
  tryGetActiveSpan,
  addEventToActiveSpan,
  serializeContextIntoCarrier,
  deserializeContextFromCarrier,

  // Instrumentation
  instrument,
  instrumentEntrypoint,
  getInstrumentationHelpers,

  // Logging
  getLogger,

  // Global Telemetry API
  getGlobalTelemetryApi,
} from '@adobe/aio-sk-lib-telemetry';
```

### OpenTelemetry API

OpenTelemetry's modular architecture spans 25+ packages, which can make importing specific APIs a bit cumbersome. To simplify this, our library provides a convenient "meta-package" import path that lets you import all the OpenTelemetry APIs you need from a single source of truth.

While this doesn't include every OpenTelemetry API, it covers the most common ones you'll need in your code. If you find any essential APIs missing, feel free to open an issue or submit a PR. You can also import the APIs you need from the individual OpenTelemetry packages, but this is a convenient way to import all the APIs you need in a single import.

> [!TIP]
> When working with OpenTelemetry exporters, you have three protocols to choose from:
> - **OTLP/GRPC**, **OTLP/HTTP**, and **OTLP/Proto**
>
> The official packages use the same class name for exporters across all protocols, which can make it tricky to pick the right one or get reliable auto-completion. To help with this, our library re-exports them with clear protocol suffixes, for example:
> - `OTLPTraceExporter` from `@opentelemetry/exporter-trace-otlp-http` -> `OTLPTraceExporterHttp`
> - `OTLPTraceExporter` from `@opentelemetry/exporter-trace-otlp-grpc` -> `OTLPTraceExporterGrpc`
> - `OTLPTraceExporter` from `@opentelemetry/exporter-trace-otlp-proto` -> `OTLPTraceExporterProto`
>
> Using them is the same as using the original class, but with a more predictable and consistent naming convention.

```typescript
import {
  // Import all the OpenTelemetry APIs you need
  SimpleSpanProcessor,
  CompressionAlgorithm,
  OTLPTraceExporterProto,
  OTLPMetricExporterHttp,
  OTLPLogExporterGrpc,
  // ...
} from '@adobe/aio-sk-lib-telemetry/otel-api';
```