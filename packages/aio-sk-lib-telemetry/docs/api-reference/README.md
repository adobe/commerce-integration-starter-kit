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
} from "@adobe/aio-sk-lib-telemetry";
```

### OpenTelemetry API

OpenTelemetry's modular architecture spans 25+ packages, which can make importing specific APIs a bit cumbersome. To simplify this, our library provides a convenient "meta-package" import path that lets you import all the OpenTelemetry APIs you need from a single source of truth.

While this doesn't include every OpenTelemetry API, it covers the most common ones you'll need in your code. If you find any essential APIs missing, feel free to open an issue or submit a PR. You can also import the APIs you need from the individual OpenTelemetry packages, but this is a convenient way to import all the APIs you need in a single import.

> [!TIP]
> When working with OpenTelemetry exporters, you have three protocols to choose from:
>
> - **OTLP/GRPC**, **OTLP/HTTP**, and **OTLP/Proto**
>
> The official packages use the same class name for exporters across all protocols, which can make it tricky to pick the right one or get reliable auto-completion. To help with this, our library re-exports them with clear protocol suffixes, for example:
>
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
} from "@adobe/aio-sk-lib-telemetry/otel-api";
```

## Interfaces

| Interface                                                                        | Description                                                                       |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [EntrypointInstrumentationConfig](interfaces/EntrypointInstrumentationConfig.md) | The configuration for entrypoint instrumentation.                                 |
| [InstrumentationConfig](interfaces/InstrumentationConfig.md)                     | The configuration for instrumentation.                                            |
| [InstrumentationContext](interfaces/InstrumentationContext.md)                   | The context for the current operation.                                            |
| [TelemetryApi](interfaces/TelemetryApi.md)                                       | Defines the global telemetry API. These items should be set once per-application. |
| [TelemetryConfig](interfaces/TelemetryConfig.md)                                 | The configuration options for the telemetry module.                               |
| [TelemetryDiagnosticsConfig](interfaces/TelemetryDiagnosticsConfig.md)           | The configuration for the telemetry diagnostics.                                  |
| [TelemetryPropagationConfig](interfaces/TelemetryPropagationConfig.md)           | Configuration related to context propagation (for distributed tracing).           |

## Type Aliases

| Type Alias                                                                       | Description                                                            |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [AutomaticSpanEvents](type-aliases/AutomaticSpanEvents.md)                       | Defines a set of events that can automatically be attached to an span. |
| [DiagnosticsLogLevel](type-aliases/DiagnosticsLogLevel.md)                       | Available log levels for the OpenTelemetry DiagLogger.                 |
| [TelemetryInstrumentationPreset](type-aliases/TelemetryInstrumentationPreset.md) | Defines the names of available instrumentation presets.                |

## Functions

| Function                                                                                | Description                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addEventToActiveSpan](functions/addEventToActiveSpan.md)                               | Adds an event to the given span.                                                                                                                                                                                                               |
| [defineMetrics](functions/defineMetrics.md)                                             | Helper to define a record of metrics.                                                                                                                                                                                                          |
| [defineTelemetryConfig](functions/defineTelemetryConfig.md)                             | Helper to define the telemetry config for an entrypoint.                                                                                                                                                                                       |
| [deserializeContextFromCarrier](functions/deserializeContextFromCarrier.md)             | Deserializes the context from a carrier and augments the given base context with it.                                                                                                                                                           |
| [getActiveSpan](functions/getActiveSpan.md)                                             | Gets the active span from the given context.                                                                                                                                                                                                   |
| [getAioRuntimeAttributes](functions/getAioRuntimeAttributes.md)                         | Infers some useful attributes for the current action from the Adobe I/O Runtime and returns them as a record of key-value pairs.                                                                                                               |
| [getAioRuntimeResource](functions/getAioRuntimeResource.md)                             | Creates a [resource](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.resources.Resource.html) from the attributes inferred from the Adobe I/O Runtime and returns it as an OpenTelemetry Resource object. |
| [getAioRuntimeResourceWithAttributes](functions/getAioRuntimeResourceWithAttributes.md) | Creates a [resource](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.resources.Resource.html) that combines the attributes inferred from the Adobe I/O Runtime with the provided attributes.              |
| [getGlobalTelemetryApi](functions/getGlobalTelemetryApi.md)                             | Gets the global telemetry API.                                                                                                                                                                                                                 |
| [getInstrumentationHelpers](functions/getInstrumentationHelpers.md)                     | Access helpers for the current instrumented operation.                                                                                                                                                                                         |
| [getLogger](functions/getLogger.md)                                                     | Get a logger instance.                                                                                                                                                                                                                         |
| [getPresetInstrumentations](functions/getPresetInstrumentations.md)                     | Get the instrumentations for a given preset.                                                                                                                                                                                                   |
| [instrument](functions/instrument.md)                                                   | Instruments a function.                                                                                                                                                                                                                        |
| [instrumentEntrypoint](functions/instrumentEntrypoint.md)                               | Instruments the entrypoint of a runtime action. Needs to be used ONLY with the `main` function of a runtime action.                                                                                                                            |
| [serializeContextIntoCarrier](functions/serializeContextIntoCarrier.md)                 | Serializes the current context into a carrier.                                                                                                                                                                                                 |
| [tryGetActiveSpan](functions/tryGetActiveSpan.md)                                       | Tries to get the active span from the given context.                                                                                                                                                                                           |
