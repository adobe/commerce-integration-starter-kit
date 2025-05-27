# Telemetry Providers

This module includes pre-built providers to simplify the configuration and export of telemetry signals to major observability platforms.

- [Telemetry Providers](#telemetry-providers)
  - [How To Use](#how-to-use)
  - [New Relic](#new-relic)

## How To Use

To use providers, add them to the `providers` array in your `makeNodeSdkConfig` configuration within your `telemetry.{js|ts}` file. Each provider is a function that accepts a configuration object and returns an object implementing this interface:

```ts
type TelemetryProvider = {
  spanProcessors: SpanProcessor[];
  metricReader: MetricReader | null;
  logRecordProcessors: LogRecordProcessor[];
};
```
The configuration helper automatically collects these components and integrates them into the OpenTelemetry SDK configuration.

> [!TIP]
> You can create custom providers by implementing this interface - they will be seamlessly processed by the configuration helper. See [our implementations](../source/providers/backends/) for reference.

## New Relic

> [!IMPORTANT]
> In order to use this provider you need to have a New Relic account and an API key. See the [official documentation](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/) on how to create your API Key.

The [New Relic provider](../source/providers/backends/new-relic.ts) allows you to export telemetry signals into [New Relic](https://newrelic.com/). It supports all signal types: traces, metrics, and logs. Below you'll find the configuration options and setup instructions for this provider.

```ts
import { newRelic } from "@adobe/aio-lib-telemetry/providers";
import { defineTelemetryConfig, makeNodeSdkConfig } from "@adobe/aio-lib-telemetry";

// These are the configuration options accepted by the New Relic provider.
type NewRelicProviderConfig = {
  region: "us" | "eu";
  apiKey: string;
};

// ... in your telemetry.{js|ts} file
defineTelemetryConfig((params) => {
  makeNodeSdkConfig({
    // ... other configuration options.
    providers: [
      newRelic({
        via: "otlp-grpc",
        region: "us",
        apiKey: params.NEW_RELIC_API_KEY,
      }),
    ],
  })
})
```

This configuration enables automatic export of telemetry signals to New Relic through the OpenTelemetry protocol via the gRPC ingestion endpoint. For additional details on integrating OpenTelemetry with New Relic, refer to their [official documentation](https://docs.newrelic.com/docs/opentelemetry/opentelemetry-introduction/).
