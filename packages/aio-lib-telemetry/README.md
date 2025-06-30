# Telemetry Module for App Builder Actions

This module contains a set of utilities for integrating observability into App Builder actions. It leverages OpenTelemetry to enable developers to capture, export, and analyze traces, metrics and logs. You can use these tools to monitor action performance, diagnose issues, and gain insights into application behavior, without significant changes to your codebase.

> [!IMPORTANT]
> Keep in mind that this is only a thin wrapper around the [OpenTelemetry SDK](https://opentelemetry.io/docs/languages/js/) for Node.js. 
> 
> It's not intended to be a full-fledged observability solution, but rather a tool to help you get started with OpenTelemetry and collect telemetry data in the context of Adobe App Builder runtime actions. It doesn't cover all the features of OpenTelemetry, but rather provides a simple and easy to use interface to get you started. 
>
> For advanced use cases you'll need to use the configuration options provided by this module to directly configure the underlying OpenTelemetry SDK, or use the OpenTelemetry SDK directly.
    
- [Telemetry Module for App Builder Actions](#telemetry-module-for-app-builder-actions)
  - [Introduction](#introduction)
  - [Installation and Setup](#installation-and-setup)
    - [Prerequisites](#prerequisites)
    - [Installing the Module](#installing-the-module)
  - [Configuration](#configuration)
    - [Open Telemetry Configuration](#open-telemetry-configuration)
    - [Writing your Telemetry Configuration](#writing-your-telemetry-configuration)
  - [How to Use](#how-to-use)
    - [Setup](#setup)
    - [Traces](#traces)
    - [Logs](#logs)
    - [Metrics](#metrics)
    - [Instrumentation Helpers](#instrumentation-helpers)
  - [Advanced Usage](#advanced-usage)
    - [Configuring a Custom Tracer and Meter](#configuring-a-custom-tracer-and-meter)
    - [Instrumentation Configuration](#instrumentation-configuration)
  - [Additional Resources](#additional-resources)
    - [API Reference](#api-reference)
    - [Use Cases](#use-cases)
  - [Troubleshooting](#troubleshooting)
    - [Enabling OpenTelemetry Diagnostics](#enabling-opentelemetry-diagnostics)
    - [Known Issues](#known-issues)

## Introduction

This guide assumes you have a basic understanding of OpenTelemetry and are familiar with its core concepts, as we will be referencing them throughout this document without detailed explanation.

If you're not familiar with OpenTelemetry yet, don't worry, we've put together a general overview to help you get started. It introduces the fundamental concepts and provides the context you need to begin understanding how OpenTelemetry (and this module) works. The overview distills the most important OpenTelemetry concepts and patterns from the (quite extensive) official documentation. 

For topics not covered in the overview, you'll find links throughout this guide that point directly to relevant sections of the official OpenTelemetry documentation. Use these links to explore details or advanced topics as needed.

Find it here: [OpenTelemetry General Overview](./docs/open-telemetry.md)

> [!IMPORTANT]
> To understand how this library works (and the reasoning behind some of its design decisions) it's important to first grasp the core concepts of OpenTelemetry. If you're new to the framework, we highly recommend reading the overview before continuing. 

## Installation and Setup

This library is written in TypeScript and distributed as a JavaScript bundle compatible with both ESM and CJS.

### Prerequisites

This library is designed for use within an [Adobe App Builder](https://developer.adobe.com/app-builder/docs/intro_and_overview/) runtime action, as it expects to find relevant information in the environment. You'll need:

- An [Adobe App Builder](https://developer.adobe.com/app-builder/docs/intro_and_overview/) project
- A package manager of your choice (we'll use `npm` in our code examples)
- A destination for your telemetry signals (we'll guide you through available options and setup)
  
> [!NOTE]
> Throughout this guide, we will occasionally distinguish between `development` and `production` environments. For context, deployed App Builder runtime actions do not differentiate between these environments (a deployed runtime action is always considered to be in `production`, regardless of the namespace). When we refer to the `development` environment, we are specifically referring to when you're **running your runtime actions locally** via `aio app dev`.

### Installing the Module

> [!WARNING]
> This package is not yet published to the NPM Registry. After running `npm run build` in it, you can either:
> - Copy the minified files from `dist/` and import them directly in your project
> - Install it as a [workspace package](https://docs.npmjs.com/cli/v11/using-npm/workspaces) in a monorepo using `npm install` as you would with any other package.

```sh
npm install @adobe/aio-lib-telemetry
```

## Configuration

This library uses the [Open Telemetry Node SDK](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-sdk-node).

> [!NOTE]
> The Open Telemetry Node SDK remains experimental and under active development. Despite this status, it has proven reliable and complete for our production use cases. Across our integration and testing in App Builder actions, we have not observed any major gaps or operational issues affecting standard observability workflows.

The library is designed to configure OpenTelemetry on a **per-action basis**, but don't worry, you won't need to write your configuration multiple times (though you can if you need different telemetry configurations for specific actions).

### Open Telemetry Configuration

There are 2 different ways to configure Open Telemetry in Node.js:

- [Using environment variables](https://opentelemetry.io/docs/languages/sdk-configuration/) (currently not supported)
- At runtime, via the [Node SDK configuration](https://open-telemetry.github.io/opentelemetry-js/modules/_opentelemetry_sdk-node.html#configuration) object

#### Environment Variables

> [!WARNING]
> This method is currently not supported.

When searching for OpenTelemetry usage examples, you'll find numerous tutorials demonstrating how to configure the SDK using environment variables. These variables are automatically processed by the SDK to configure its behavior.

However, these variables need to be present in `process.env`, and due to how App Builder handles environment variables (fed via `params`), this configuration method is currently not supported.

#### Node SDK Configuration

This is the currently supported method for configuring OpenTelemetry with this library. You'll need to provide a NodeSDK configuration object that will be passed directly to the `NodeSDK` constructor. For detailed information about each configuration option, please refer to the [official OpenTelemetry documentation](https://opentelemetry.io/docs/languages/js/instrumentation/#initialize-the-sdk).

### Writing your Telemetry Configuration

Before you start using this library you need to configure it.

> [!NOTE]
> This section focuses on general telemetry configuration rather than backend-specific setup. Since observability backends require different configurations, we've created dedicated guides for popular options. See the [use cases](#use-cases) section for links to detailed backend setup instructions.

Begin by creating a `telemetry.js` file (or `telemetry.ts` if using TypeScript). This file will export your global telemetry configuration, which will be shared across all instrumented runtime actions. If a single configuration doesn't meet your requirements, you can export multiple configurations from this file (or create separate configuration files) and use them as needed.

```ts
// telemetry.{js|ts}

import { 
  defineTelemetryConfig, 
  getPresetInstrumentations,
  getAioRuntimeResource
} from "@adobe/aio-lib-telemetry"

// Use the `defineTelemetryConfig` helper to define your configuration.
// The given callback receives your `env` params and must return the OpenTelemetry config.
const telemetryConfig = defineTelemetryConfig((params, isDev) => {
  return {
    sdkConfig: {
      serviceName: "my-app-builder-app",
      instrumentations: getPresetInstrumentations("simple"),
      resource: getAioRuntimeResource(),

      // ... see other options in the OpenTelemetry documentation
    }
  }
});

export { telemetryConfig }
```

Refer to the API reference documentation of this library for more information about the helpers used in the above example: 

| Helper                      | Documentation                                                                |
| --------------------------- | ---------------------------------------------------------------------------- |
| `defineTelemetryConfig`     | [API reference](./docs/api-reference/functions/defineTelemetryConfig.md)     |
| `getPresetInstrumentations` | [API reference](./docs/api-reference/functions/getPresetInstrumentations.md) |
| `getAioRuntimeResource`     | [API reference](./docs/api-reference/functions/getAioRuntimeResource.md)     |


## How to Use

This section provides a comprehensive guide for instrumenting App Builder Runtime Actions and demonstrates how to leverage this module's API for streamlined telemetry implementation.

### Setup

With your configuration ready, you can now instrument a runtime action. OpenTelemetry provides three core observability signals: **traces**, **metrics**, and **logs**. Each signal serves a specific purpose in understanding your application's behavior and performance. This section will guide you through implementing each signal type.

> [!IMPORTANT]
> This step is essential for telemetry to function correctly. Without proper setup, telemetry will not work and no signals will be exported. The entrypoint serves as the root span for trace exports and handles critical initialization processes.

#### Setting the `ENABLE_TELEMETRY` environment variable

For granular control over which actions use telemetry without modifying source code, configure the `ENABLE_TELEMETRY` environment variable in your `app.config.yaml` file. Set it to `true` either at the individual action level, or [at the package level](https://developer.adobe.com/app-builder/docs/guides/app_builder_guides/configuration/configuration#appconfigyaml-1) if you want to enable it for all actions in that package.

> [!WARNING]
> If this environment variable is not set, telemetry signals will not be emitted.

```yaml
# app.config.yaml

runtimeManifest:
  packages:
    my-package:
      # Set it at the action level.
      actions:
        my-instrumented-action:
          function: actions/my-instrumented-action/index.js
          inputs:
            ENABLE_TELEMETRY: true
        
        my-non-instrumented-action:
          function: actions/my-non-instrumented-action/index.js
          inputs:
            ENABLE_TELEMETRY: false

        # Not having the `ENABLE_TELEMETRY` input will default to `false`.
        my-other-non-instrumented-action:
          function: actions/my-other-non-instrumented-action/index.js
    
    # Set it at the package level.
    my-instrumented-package:
      inputs:
        ENABLE_TELEMETRY: true
      
      actions:
        my-instrumented-action:
          function: actions/my-instrumented-action/index.js

        my-other-instrumented-action:
          function: actions/my-other-instrumented-action/index.js
```

#### Entrypoint Instrumentation

Once you have set the environment variable, you can instrument the entrypoint, the `main` function you need to always export when using Adobe App Builder. Navigate to the file containing the runtime action you wish to instrument, then import your configuration from the `telemetry.{js|ts}` file, along with the following function from this module: `instrumentEntrypoint`

```ts
import { telemetryConfig } from "./telemetry" // Or wherever it is located
import { instrumentEntrypoint } from "@adobe/aio-lib-telemetry"
```
Next, wrap your `main` function with `instrumentEntrypoint`. 

```ts
function main(params) {
  // Your standard implementation.
}

const instrumentedMain = instrumentEntrypoint(main, telemetryConfig);
export {
  instrumentedMain as main
}
```
With this setup, your entrypoint is now instrumented and will automatically emit trace data. However, this creates only a single root span, which provides limited visibility. Let's explore how to add traces to other functions throughout your codebase for deeper insights.

### Traces

> [!NOTE]
> Keep in mind that the exported trace data includes both manually configured traces and automatic instrumentation defined in the configuration's `instrumentations` property. These automatic instrumentations generate telemetry signals seamlessly as your code executes the targeted libraries.

With your entrypoint instrumented, you can begin adding trace instrumentation to other functions throughout your codebase that you want to trace. You don't need to instrument every function, focus on those where you want to monitor execution flow and performance. 

For regular functions, use the `instrument` helper instead of `instrumentEntrypoint`. The usage follows the same pattern, but without requiring the telemetry configuration

```ts
// somewhere/in_your/codebase/somefile.{js|ts}

import { instrument } from "@adobe/aio-lib-telemetry"

function expensiveOperationYouWantToMonitor() {
  // ... code for expensive operation.
}

function externalApiRequest() {
  // ... fetch("https://someapi.com")
}

const instrumentedApiRequest = instrument(externalApiRequest);
const instrumentedExpensiveOperation = instrument(expensiveOperationYouWantToMonitor);

export {
  instrumentedApiRequest as externalApiRequest,
  instrumentedExpensiveOperation as expensiveOperationYouWantToMonitor
}
```
> [!TIP]
> To avoid declaring functions twice for instrumentation, you can instrument and export them directly as shown below. **This pattern is only needed with ESM**; CommonJS allows inline instrumentation with the `module.exports` syntax, eliminating the need for double-declaration.
> ```ts
> export const externalApiRequest = instrument(
>   // Important: use a NAMED function. Avoid arrow or anonymous functions.
>   // Or use the `spanConfig.spanName` option in the instrumentation config.
>   // Functions without names and without a `spanConfig.spanName` will throw at runtime.
>   function apiRequest() {
>     // ... fetch("https://someapi.com")
>   }
> )
> ```

#### Distributed Tracing and Context Propagation

In distributed systems, maintaining trace continuity across service boundaries is crucial for effective observability. This process, known as context propagation, enables distributed tracing by sharing trace context between services. For comprehensive details on this concept, refer to the [OpenTelemetry documentation](https://opentelemetry.io/docs/languages/js/propagation/).

> [!IMPORTANT]
> Propagation should happen in the root span of the trace. Because of this, the `propagation` configuration option is available only for the `instrumentEntrypoint` helper. See below for more details on what can be configured, or see the API reference for the [`TelemetryPropagationConfig`](./docs/api-reference/interfaces/TelemetryPropagationConfig.md) interface.

This module, if well used, is able to automatically handle context propagation, requiring only that you pass the carrier object (containing the trace context) to downstream services. To serialize your context into a carrier object, you can use the `serializeContextIntoCarrier` helper. See the API reference for more details: [`serializeContextIntoCarrier`](./docs/api-reference/functions/serializeContextIntoCarrier.md)

```ts
import { serializeContextIntoCarrier } from "@adobe/aio-lib-telemetry"

// Somewhere in your codebase.
function callExternalInstrumentedService() {
  const carrier = serializeContextIntoCarrier();
  // ... call the external service and send the carrier.
}
```

##### Automatic Propagation

When invoking an external service instrumented with this module (such as another runtime action), you can include the context carrier in your request or event. Upon receiving the request, the library will automatically attempt to deserialize the context by checking these locations in order:

1. The `x-telemetry-context` header, if you're invoking via HTTP requests
2. The `params.__telemetryContext` parameter when invoking runtime actions directly through Openwhisk or Event Ingress
3. The `params.data.__telemetryContext` parameter - a convenience option for cases where parameters are nested under a `data` object

If you don't want this automatic behavior, you can opt-out by providing a `skip: true` option in the `propagation` configuration.

```ts
function main(params) {
  // ...
}

instrumentEntrypoint(main, {
  propagation: {
    skip: true
  }
})
```

##### Manual Propagation

When the automatic propagation feature cannot be used (usually because the context carrier cannot be passed in the supported formats described above) manual trace context deserialization is required. Here's how to configure it:

You need to specify where the `instrumentEntrypoint` (or `instrument`) helper should find the carrier object. Do this by implementing a `getContextCarrier` function in your entrypoint instrumentation configuration. This function receives your instrumented function's arguments and should return the carrier object.

```ts
function main(params) {
  // ...
}

instrumentEntrypoint(main, {
  propagation: {
    getContextCarrier: (params) => {
      return { 
        carrier: params.data.myCarrier
      }
    }
  }
})
```
With this setup, your carrier object will be deserialized and the resulting context will be set for you.

### Logs

> [!WARNING]
> Log processing and exporting [is currently in development](https://opentelemetry.io/docs/languages/js/) in the OpenTelemetry SDK for Node.js. While we haven't encountered any issues or limitations, occasional problems or API changes may occur.

OpenTelemetry simplifies log exporting by handling the heavy lifting automatically, you just need to log normally. However, not all loggers are supported. OpenTelemetry provides auto-instrumentation for the Winston library, which in turn powers `@adobe/aio-lib-core-logging`, the library used for custom loggers in App Builder actions (and by the `Core.Logger` from `@adobe/aio-core-sdk`).

To export [logs](https://opentelemetry.io/docs/concepts/signals/logs/), ensure the Winston instrumentation is enabled. This comes configured by default in both `simple` and `full` presets when using the [`getPresetInstrumentations`](./docs/api-reference/functions/getPresetInstrumentations.md) helper. If you're using a custom instrumentation array, make sure to include it.

#### Exporting Log Data

> [!TIP]
> When logging within an instrumented function (i.e. one that is traced), OpenTelemetry will automatically associate log entries with the corresponding trace, allowing you to correlate logs with specific trace executions.

To export logs, use the `getLogger` helper provided by this module. Its signature matches that of `@adobe/aio-lib-core-logging`, which supports both `winston` and `debug` as logging providers. However, this helper always enforces the use of `winston` to ensure compatibility with OpenTelemetry log export. 

By using this helper, your logs are automatically captured and routed through OpenTelemetry. Provided your telemetry configuration is set up correctly, this will enable seamless export to your observability backend of choice.

```ts
import { getLogger } from "@adobe/aio-lib-telemetry"

function someFunctionInYourCodebase() {
  const logger = getLogger("logger-name", {
    // See: https://github.com/adobe/aio-lib-core-logging
    // Logger configuration options.
  });

  logger.info("my log message!");
}
```

### Metrics

[Metrics](https://opentelemetry.io/docs/concepts/signals/metrics/) capture quantitative measurements of your service's behavior at runtime. Each measurement creates a metric event which consists not only of the measurement itself, but also the time at which it was captured and associated metadata. This section demonstrates how to implement metrics in your runtime actions using this module.

#### Creating Metrics

The `defineMetrics` helper allows you to create and manage metrics throughout your runtime actions. You can define metrics anywhere in your codebase using this helper, then export and import them as needed. For global metrics, consider placing them in your `telemetry.{js|ts}` configuration file. For more scoped metrics, define them closer to where they're used. See the OpenTelemetry [metrics documentation](https://opentelemetry.io/docs/concepts/signals/metrics/) for details on available metric types.

> [!WARNING]
> While metrics can be defined anywhere in your code, they become usable only when your runtime action begins execution. The `defineMetrics` helper creates metric definitions that are lazily initialized once the SDK starts up with the runtime action.

```ts
// somewhere/in_your/codebase/metrics.{js|ts}

import { defineMetrics } from "@adobe/aio-lib-telemetry"

export const myMetrics = defineMetrics((meter) => {
  return {
    counter: meter.createCounter("my_counter"),
  }
})

// Later, in your codebase.
import { myMetrics } from "./metrics"
myMetrics.counter.add(1)
```

#### Considerations

- **Metrics are per-process, not global**: A common misconception is that metrics behave like global state. They're tied to individual processes, meaning they reset whenever a runtime action ends and starts again. This reset only happens during **cold starts** when a new process spins up. During warm starts, the process is recycled and metrics persist. Your observability backend is responsible for aggregating these values over time, so make sure to configure your metrics carefully to avoid losing data or getting duplicate reports.
  
- **Aggregation happens externally**: Totals, averages, and other aggregations should be performed by your metrics backend (e.g., Prometheus, Datadog, or Adobe’s monitoring platform). Individual actions simply report raw measurements.

### Instrumentation Helpers

Within an instrumented runtime action, the `getInstrumentationHelpers` function provides a convenient set of utilities to streamline your telemetry code.

> [!WARNING]
> If you invoke this function from a non-instrumented function, it will throw an error.

```ts
import { getInstrumentationHelpers } from "@adobe/aio-lib-telemetry"

function someInstrumentedFunctionInYourCode() {
  const { currentSpan, contextCarrier, logger, meter, tracer } = getInstrumentationHelpers();

  // You can also use the helpers to create spans, metrics, etc.
  currentSpan.setAttribute("my-attribute", "my-value");
  logger.info("my log message!");
  
  // Use the pre-serialized carrier object to propagate the trace context.
  invokeExternalInstrumentedService({
    headers: {
      "x-telemetry-context": JSON.stringify(contextCarrier)
    }
  });
}
```
This function receives the following helpers:

- `currentSpan`: The active span for the current operation.
- `contextCarrier`: A pre-serialized carrier object for propagating trace context.
- `tracer`: The global tracer instance for creating spans. For accessing the tracer outside instrumented contexts, see [`getGlobalTelemetryApi`](./docs/api-reference/functions/getGlobalTelemetryApi.md).
- `meter`: The global meter instance for creating metrics. For accessing the meter outside instrumented contexts, see [`getGlobalTelemetryApi`](./docs/api-reference/functions/getGlobalTelemetryApi.md).
- `logger`: An auto-configured logger for the current operation. Uses the `LOG_LEVEL` environment variable when available, defaulting to `debug` in development and `info` in production. For custom logger configuration, see the [logs section](#logs) on using the `getLogger` helper.

## Advanced Usage

### Configuring a Custom Tracer and Meter

The library automatically creates a default tracer and meter if none are provided alongside the `sdkConfig`. However, you can supply your own custom implementations if you need more specific functionality.

> [!NOTE]
> Generally you shouldn't need more than one tracer and meter per app. That's why this library only works with a single instance of both. If you want different tracer/meter names per runtime action you can use environment variables.

```ts
// telemetry.{js|ts}

import { defineTelemetryConfig } from "@adobe/aio-lib-telemetry"
import { trace, metrics } from "@adobe/aio-lib-telemetry/otel"

const telemetryConfig = defineTelemetryConfig((params, isDev) => {
  const tracer = trace.getTracer("my-custom-tracer");
  const meter = metrics.getMeter("my-custom-meter");

  return {
    sdkConfig: { /* SDK Configuration */ },

    tracer,
    meter
  }
});

export { telemetryConfig }
```

See more about the `otel` import path in the API Reference: [OpenTelemetry Re-Exports](./docs/api-reference/README.md#opentelemetry-api).

### Instrumentation Configuration

In most cases, instrumenting your functions works seamlessly without additional configuration. However, certain scenarios, such as customizing the span name, configuring automatic span events or reacting to the result of a wrapped function, may require further customization.

The `instrument` helper accepts an optional **second argument** that allows you to fine-tune the instrumentation.

```ts
// somewhere/in_your/codebase/somefile.{js|ts}

import { instrument } from "@adobe/aio-lib-telemetry"

function externalApiRequest() { /* ... */ }
instrument(externalApiRequest, {
  // Place instrumentation options here.
});
```
> [!NOTE]
> The `instrumentEntrypoint` helper also supports instrumentation options, but since its second parameter is also used for the telemetry configuration, you must merge both (see below). Find the entrypoint configuration reference in: [`EntrypointInstrumentationConfig`](./docs/api-reference/interfaces/EntrypointInstrumentationConfig.md)
> ```ts
> import { telemetryConfig } from "./telemetry"
>
> // Implementation of your main function
> function main(params) { /* ... */ }
> instrumentEntrypoint(main, {
>   ...telemetryConfig,
>   // Place instrumentation options here.
> })
> ```

Example use cases on when you might want to use these options are:

- **Customizing Span Names**: If you want to use a custom span name for a function, you can set the [`spanConfig.spanName`](./docs/api-reference/interfaces/InstrumentationConfig.md#spanname) option. There are other span configuration options available, see the API reference for [`SpanConfig`](./docs/api-reference/interfaces/InstrumentationConfig.md#spanconfig) for more details.
  
- **Reacting to the Result**: If you want to react to the result of a function, you can set the [`onResult`](./docs/api-reference/interfaces/InstrumentationConfig.md#onresult) option.
  
- **Handling Errors**: If you want to handle errors of a function, you can set the [`onError`](./docs/api-reference/interfaces/InstrumentationConfig.md#onerror) option.
  
- **Handling Success/Failure**: By default, the library considers a function successful if it doesn't throw an error. You can customize this behavior by setting the [`isSuccessful`](./docs/api-reference/interfaces/InstrumentationConfig.md#issuccessful) option.
  - This option takes a function that receives the result and returns a boolean indicating whether the operation was successful.
  
  - The success/failure state may not matter for your use case. Internally, it determines when to trigger the [`onError`](./docs/api-reference/interfaces/InstrumentationConfig.md#onerror) and [`onResult`](./docs/api-reference/interfaces/InstrumentationConfig.md#onresult) hooks, and whether to [set the span status](https://opentelemetry.io/docs/concepts/signals/traces/#span-status) to `OK` or `ERROR`. Different observability backends might interpret these statuses in their own way.

See the API reference for the configuration options available: [`InstrumentationConfig`](./docs/api-reference/interfaces/InstrumentationConfig.md). 



## Additional Resources

### API Reference

Find the full API reference in: [docs/api-reference](./docs/api-reference/README.md). You can find there documentation for all the helpers and interfaces provided by this module.

### Use Cases

To help you get started, we've written a few more documentation on different use cases for integrating with popular observability platforms. Find them in the [docs/use-cases](./docs/use-cases) folder.

## Troubleshooting

### Enabling OpenTelemetry Diagnostics

OpenTelemetry includes an internal diagnostic logging API for troubleshooting configuration and instrumentation issues. When your OpenTelemetry setup isn't behaving as expected, you can enable these `diagnostics` (which are disabled by default) through your telemetry configuration.

> [!NOTE]
> This module configures the diagnostics logger to use `winston` as the logging provider. For more details about exporting logs, see the [logs section](#logs). By default, logs are exported to any configured observability backends that support them. You can control this behavior using the `exportLogs` boolean option. 
> 
> For these **OpenTelemetry internal diagnostic logs**, only those with a `logLevel` of `info` and above will be exported. Other types of logging are too verbose and may contain irrelevant/sensitive data. 

```ts
import { defineTelemetryConfig } from "@adobe/aio-lib-telemetry"

const telemetryConfig = defineTelemetryConfig((params, isDev) => {
  return {
    sdkConfig: { /* SDK Configuration */ },
    diagnostics: {
      logLevel: "debug",

      // Optional properties.
      exportLogs: false, // Defaults to `true`
      loggerName: "otel-diag-logger" // Defaults to `${actionName}/otel-diagnostics`
    }
  }
});

export { telemetryConfig }
```
See the API reference for the `diagnostics` property: [`TelemetryDiagnosticsConfig`](./docs/api-reference/interfaces/TelemetryDiagnosticsConfig.md)

### Known Issues

We are aware of a couple of (occasional) issues, which you can find workarounds for below. If you encounter any other problems, please file a GitHub issue.

#### Hot Reloading

OpenTelemetry uses global state to manage its internal components. When developing locally with `aio app dev`, your code is hot-reloaded as you make changes. This behavior is similar to what happens when your runtime action runs in a warm container, where the process is recycled. 

Since the process remains alive during these reloads, the global state persists without being reset. While this module handles the underlying OpenTelemetry SDK to work smoothly with hot-reloading, there might be some edge cases we haven't encountered or tested yet.

If you notice any unexpected behavior, please file a GitHub issue with reproduction steps so we can investigate and improve the module. As a temporary solution, you can restart the development server to start fresh.

#### Telemetry Signals Not Being Exported

Due to the ephemeral nature of runtime actions, telemetry signals may occasionally fail to export before the container shuts down. While the module attempts to flush all signals when an action completes, certain edge cases can prevent this from occurring. If you experience this issue, please file a GitHub issue with reproduction steps so we can address it.

