# 👁️ Telemetry Module for App Builder Actions

<br />
<div align="center">
  <img alt="OpenTelemetry Logo" src="./docs/images/open-telemetry.png">
</div>
<br />

This module contains a set of utilities for integrating observability into App Builder actions. It leverages OpenTelemetry to enable developers to capture, export, and analyze traces, metrics and logs. You can use these tools to monitor action performance, diagnose issues, and gain insights into application behavior, without significant changes to your codebase.

- [👁️ Telemetry Module for App Builder Actions](#️-telemetry-module-for-app-builder-actions)
  - [👋🏻 Introduction](#-introduction)
  - [🛠️ Installation and Setup](#️-installation-and-setup)
    - [Prerequisites](#prerequisites)
    - [Installing the Module](#installing-the-module)
  - [⚙️ Configuration](#️-configuration)
    - [Open Telemetry Configuration](#open-telemetry-configuration)
    - [Environment Variables](#environment-variables)
    - [Node SDK Configuration](#node-sdk-configuration)
      - [Configuration Helper](#configuration-helper)
  - [📚 How to Use](#-how-to-use)
    - [Writing your Telemetry Configuration](#writing-your-telemetry-configuration)
      - [Configuring the Application Monitor](#configuring-the-application-monitor)
      - [Enabling OpenTelemetry Diagnostics](#enabling-opentelemetry-diagnostics)
    - [Instrumenting Your Code](#instrumenting-your-code)
      - [Traces](#traces)
        - [Instrumentation Configuration](#instrumentation-configuration)
      - [Logs](#logs)
        - [Exporting Log Data](#exporting-log-data)
      - [Metrics](#metrics)
        - [Configuring Metrics](#configuring-metrics)
        - [Working With Our Metrics](#working-with-our-metrics)
        - [Considerations](#considerations)
    - [Distributed Tracing and Context Propagation](#distributed-tracing-and-context-propagation)
      - [Propagating the Trace Context](#propagating-the-trace-context)
      - [Receiving a Trace Context](#receiving-a-trace-context)
      - [Automatic Propagation](#automatic-propagation)
    - [Instrumentation Helpers](#instrumentation-helpers)
  - [❓ Next Up](#-next-up)
  - [🩺 Troubleshooting](#-troubleshooting)
    - [Hot Reloading and `aio app dev`](#hot-reloading-and-aio-app-dev)
    - [Telemetry Signals Not Being Exported](#telemetry-signals-not-being-exported)


## 👋🏻 Introduction

This guide assumes you have a basic understanding of OpenTelemetry and are familiar with its core concepts, as we will be referencing them throughout this document without detailed explanation.

If you're not familiar with OpenTelemetry yet, don't worry, we've put together a general overview to help you get started. It introduces the fundamental concepts and provides the context you need to begin understanding how OpenTelemetry (and this module) works. The overview distills the most important OpenTelemetry concepts and patterns from the (quite extensive) official documentation. 

For topics not covered in the overview, you'll find links throughout this guide that point directly to relevant sections of the official OpenTelemetry documentation. Use these links to explore details or advanced topics as needed.

Find it here: [OpenTelemetry General Overview](./docs/open-telemetry.md)

> [!IMPORTANT]
> To understand how this library works (and the reasoning behind some of its design decisions) it's important to first grasp the core concepts of OpenTelemetry. If you're new to the framework, we highly recommend reading the overview before continuing. 

## 🛠️ Installation and Setup

### Prerequisites

This library is designed for use within an Adobe App Builder runtime action, as it expects to find relevant information in the environment. It is written in TypeScript and distributed as a JavaScript bundle compatible with both ESM and CJS. You'll need:

- An `aio` scaffolded project
- A package manager of your choice (we'll use `npm` in our code examples)
- A destination for your telemetry signals (we'll guide you through available options and setup)
  
> [!NOTE]
> Throughout this guide, we will frequently distinguish between `development` and `production` environments. For context, deployed App Builder runtime actions do not differentiate between these environments (a deployed runtime action is always considered to be in `production`, regardless of the namespace). When we refer to the `development` environment, we are specifically referring to when you're running your runtime actions locally via `aio app dev`.

### Installing the Module

```sh
npm install @adobe/aio-lib-telemetry
```
## ⚙️ Configuration

This library uses the [Open Telemetry Node SDK](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-sdk-node).

> [!NOTE]
> The Open Telemetry Node SDK remains experimental and under active development. Despite this status, it has proven reliable and complete for our production use cases. Across our integration and testing in App Builder actions, we have not observed any major gaps or operational issues affecting standard observability workflows.

The library is designed to configure OpenTelemetry on a **per-action basis**, but don't worry, you won't need to write your configuration multiple times (though you can if you need different telemetry configurations for specific actions).

### Open Telemetry Configuration

There are 2 different ways to configure Open Telemetry in Node.js:

- [Using environment variables](https://opentelemetry.io/docs/languages/sdk-configuration/) (currently not supported)
- At runtime, via the [Node SDK configuration](https://open-telemetry.github.io/opentelemetry-js/modules/_opentelemetry_sdk-node.html#configuration) object

### Environment Variables

When searching for OpenTelemetry usage examples, you'll find numerous tutorials demonstrating how to configure the SDK using environment variables. These variables are automatically processed by the SDK to configure its behavior. 

However, these variables need to be present in `process.env`, and due to how App Builder handles environment variables (fed via `params`), this configuration method is currently not supported. It's technically feasible to implement, so we may add support for it in the future.

### Node SDK Configuration

This is the currently supported method for configuring OpenTelemetry with this library. You'll need to provide a NodeSDK configuration object that will be passed directly to the `NodeSDK` constructor. For detailed information about each configuration option, please refer to the [official OpenTelemetry documentation](https://opentelemetry.io/docs/languages/js/instrumentation/#initialize-the-sdk).

#### Configuration Helper

For advanced use cases, you can configure the Node SDK directly using its native configuration object. However, to lower the entry barrier and simplify the setup process, we've provided a configuration helper named `makeNodeSdkConfig` that makes the SDK more accessible and easier to configure. We will see an example usage later. 

This helper has the following interface:

```ts
interface TelemetryConfig {
  /** Which instrumentations to use. You can pass a list of instrumentations or a preset. */
  instrumentations?: "simple" | "full" | Instrumentation[];

  /** The service name to use for the exported telemetry signals. */
  serviceName?: string;

  /** The service version to use for the exported telemetry signals. */
  serviceVersion?: string;

  /** The resource attributes used for the exported telemetry signals. */
  resource?: Record<string, string>;

  /** Which out of the box providers to use. */
  providers?: TelemetryProvider[];
}
```
The entire configuration is completely optional, as it comes with sensible defaults. However, if you want to export your telemetry data to an observability platform, you'll need to configure at least the appropriate providers. 

Click on each property below for an explanation of what it represents:

<table>
  <thead>
    <tr>
      <!-- Use a very large-width for full-width table -->
      <th width="3000px" align="center">Configuration Helper API Reference</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <details>
          <summary>
            <code>instrumentations</code>: Configure automatic telemetry collection for third-party libraries
          </summary>
          <p></p>
          <p>
            This property accepts <code>Instrumentation</code> objects, which are the standard interface defined by OpenTelemetry for JavaScript (often referred to as "auto-instrumentations"). These objects enable the SDK to automatically patch third-party libraries that don't natively provide telemetry capabilities, allowing them to emit observability signals without requiring manual code changes. See <a href="https://opentelemetry.io/docs/zero-code/js/">zero-code instrumentations</a>
          </p>
          <p>
            You can <a href="https://opentelemetry.io/docs/languages/js/libraries/">use any instrumentations of your choice</a> or select from one of the presets we have preconfigured for your convenience. It defaults to <code>full</code> in <b>development</b> and <code>basic</code> in <b>production</b>.
          </p>
          <ul>
            <li>
              <p>
                <span>
                  <code>simple</code>:
                </span>
                <span>
                  A basic preset that includes instrumentations for network calls to external APIs, GraphQL operations, and the <a href="">Winston logging library</a> (which is used internally by the <code>@adobe/aio-core-sdk</code>).
                </span>
              </p>
            </li>
            <li>
              <p>
                <span>
                  <code>full</code>:
                </span>
                <span>
                  Utilizes the <code>getNodeAutoInstrumentations</code> <a href="https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node">OpenTelemetry helper</a>, which provides a set of telemetry signals for a wide range of commonly used third-party libraries in the Node.js ecosystem.
                </span>
              </p>
            </li>
        </details>
      </td>
    </tr>
    <tr>
      <td>
        <details>
          <summary>
            <code>serviceName</code>: Set the service name for telemetry identification
          </summary>
          <p></p>
          <p>
            A convenient shorthand for setting the service name <a href="https://opentelemetry.io/docs/concepts/semantic-conventions/">semantic attribute</a>, which is typically required by most observability platforms. This value determines how your service will be identified and displayed within your chosen observability backend.
          </p>
          <p>
            In <b>production</b>, this defaults to <code>${AIO_NAMESPACE}/${AIO_RUNTIME_ACTION_PACKAGE}</code>, while in <b>development</b> it follows the same pattern but appends a <code>local-development</code> suffix to the namespace. Note that in development environments, the package name cannot be inferred when using older versions of the <code>aio</code> CLI. In such cases, the package name will be omitted from the <code>serviceName</code>.
          </p>
        </details>
      </td>
    </tr>
    <tr>
      <td>
        <details>
          <summary>
            <code>serviceVersion</code>: Set the service version for telemetry identification
          </summary>
          <p></p>
          <p>
            A convenient shorthand for setting the service version <a href="https://opentelemetry.io/docs/concepts/semantic-conventions/">semantic attribute</a>, which is typically required by most observability platforms. This value determines the version of your service that will be displayed within your chosen observability backend.
          </p>
          <p>
            In <b>production</b>, this defaults to <code>${__OW_ACTION_VERSION}</code>, while in <b>development</b> it defaults to <code>0.0.0 (development)</code>.
          </p>
        </details>
      </td>
    </tr>
    <tr>
      <td>
        <details>
          <summary>
            <code>resource</code>: Key-value pairs that describe the entity producing telemetry
          </summary>
          <p></p>
          <p>
            This property allows you to specify <a href="https://opentelemetry.io/docs/languages/js/resources/">resource attributes</a>, which are key-value pairs describing the environment in which telemetry data is produced. These attributes are passed directly to OpenTelemetry and are used for service identification, filtering, and enrichment in observability platforms. Many attributes have predefined names defined by <a href="https://opentelemetry.io/docs/concepts/semantic-conventions/">semantic conventions</a> to ensure consistency across different observability tools and platforms.
          </p>
          <p>
            When using the configuration helper, this property is automatically prepopulated with detailed information about the Adobe App Builder environment, including the action name, namespace, package, and other relevant metadata. You can override or extend these attributes as needed for your use case.
          </p>
        </details>
      </td>
    </tr>
    <tr>
      <td>
        <details>
          <summary>
            <code>providers</code>: Control telemetry data export and processing
          </summary>
          <p></p>
          <p>
            Providers define how telemetry data is processed and exported. Each provider is a function that receives a configuration object and returns a collection of span processors, log record processors, and optionally a single metric reader. These components determine the handling and destination of traces, logs, and metrics generated by your application.
          </p>
        </details>
      </td>
    </tr>
  </tbody>
</table>

## 📚 How to Use

This section provides a comprehensive guide for instrumenting App Builder Runtime Actions and demonstrates how to leverage this module's API for streamlined telemetry implementation.

### Writing your Telemetry Configuration

Begin by creating a `telemetry.js` file (or `telemetry.ts` if using TypeScript). This file will export your global telemetry configuration, which will be shared across all instrumented runtime actions. If a single configuration doesn't meet your requirements, you can export multiple configurations from this file (or create separate configuration files) and use them as needed.

> [!WARNING]
> The configuration object you define must be written in the format expected by OpenTelemetry. Please refer to the [Node SDK Configuration section above](#node-sdk-configuration) for details. Note that the `makeNodeSdkConfig` helper accepts the simplified configuration format and returns it in the OpenTelemetry-compatible format. Be careful not to confuse these two different formats.

```ts
// telemetry.{js|ts}

import { makeNodeSdkConfig, defineTelemetryConfig } from "@adobe/aio-lib-telemetry"

// Use the `defineTelemetryConfig` helper to define your configuration.
// The given callback receives your `env` params and must return the OpenTelemetry config.
const telemetryConfig = defineTelemetryConfig((params) => {
  const sdkConfig = makeNodeSdkConfig({
    serviceName: "my-app-builder-app",
    serviceVersion: "0.0.1",
    instrumentations: "simple",

    // Add custom resource attributes and telemetry providers as needed.
    // resource: { },
    // providers: [ ]
  })

  return {
    sdkConfig
  };
});

export { telemetryConfig }
```

> [!TIP]
> You can leverage the configuration helper for simplified setup and extend or override it with OpenTelemetry's options. Instead of returning the helper's config directly, use the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to merge it with any additional configuration not covered by the helper.
> ```ts 
>   return {
>     sdkConfig: {
>       ...sdkConfig,
>
>       // Override or extend with additional OpenTelemetry configuration
>       sampler: new TraceIdRatioBasedSampler(0.1),
>       views: [/* custom metric views */],
>     }
>   };
> });
> ```

#### Configuring the Application Monitor

The application monitor is a global object that manages the lifecycle of key telemetry components in your instrumented application: the `tracer` (for creating spans), the `meter` (for defining metrics), and your custom application metrics. Configuration details for application metrics are covered in the dedicated [metrics](#metrics) section.

In most cases, you won't need to configure the application monitor manually since the module automatically sets one up for you, unless you want to define the previously mentioned metrics. Find below how to configure the monitor.

```ts
// ... in your `defineTelemetryConfig`
return {
  monitorConfig: {
    // Both default to the runtime action name.
    tracerName: "my-app-tracer-name",
    meterName: "my-app-meter-name",

    // Both default to the runtime action version.
    tracerVersion: "1.0.0",
    meterVersion: "1.0.0",

    // Explained in the `metrics` chapter.
    // createMetrics: (meter) => { /* ... your metrics */ } 
  }

  // Your SDK configuration
  sdkConfig,
}
```
Within your instrumented code, you can access the global application monitor instance using the `getApplicationMonitor` helper. This provides references to the managed `tracer`, `meter`, and `metrics`.

In most scenarios, you won't need the `tracer` or `meter` directly unless you have specific requirements for manually creating trace spans or defining metrics in-place (rare).

```ts
import { getApplicationMonitor } from "@adobe/aio-lib-telemetry"

function someFunctionInYourCode() {
  const { tracer, meter, metrics } = getApplicationMonitor();
  // ... do anything with any of these components.
}
```

#### Enabling OpenTelemetry Diagnostics

OpenTelemetry includes an internal diagnostic logging API for troubleshooting configuration and instrumentation issues. When your OpenTelemetry setup isn't behaving as expected, you can enable these `diagnostics` (which are disabled by default) through your telemetry configuration.

> [!NOTE]
> This module configures the diagnostics logger to use `winston` as the logging provider. For more details, see the [logs section](#logs). By default, logs are exported to any configured observability backends that support them. You can control this behavior using the `exportLogs` boolean option. Only logs with a `logLevel` of `info` and above will be exported. Other types of logging are too verbose and may contain irrelevant/sensitive data. 

```ts
// ... in your `defineTelemetryConfig`
return {
  diagnostics: {
    logLevel: "debug"

    // Optional properties.
    exportLogs: false // Defaults to `true`
    loggerName: "otel-diag-logger" // Defaults to `${actionName}/otel-diagnostics`
  }

  // Your SDK configuration
  sdkConfig,
}
```

### Instrumenting Your Code

With your configuration ready, you can now instrument a runtime action. OpenTelemetry provides three core observability signals: **traces**, **metrics**, and **logs**. Each signal serves a specific purpose in understanding your application's behavior and performance. This section will guide you through implementing each signal type.

Begin by instrumenting the entrypoint, the `main` function you need to always export when using Adobe App Builder. Navigate to the file containing the runtime action you wish to instrument, then import your configuration from the `telemetry.{js|ts}` file, along with the following function from this module: `instrumentEntrypoint`

```ts
import { telemetryConfig } from "./telemetry" // Or wherever it is located
import { instrumentEntrypoint } from "@adobe/aio-lib-telemetry"
```
Next, wrap your `main` function with `instrumentEntrypoint`. 

> [!IMPORTANT]
> This step is essential for telemetry to function correctly. Without proper entrypoint instrumentation, telemetry will not work and no signals will be exported. The entrypoint serves as the root span for trace exports and handles critical initialization processes.

```ts
function main(params) {
  // Your standard implementation.
}

const instrumentedMain = instrumentEntrypoint(main, telemetryConfig);
export {
  instrumentedMain as main
}
```
With this setup, your entrypoint is now instrumented and will automatically emit trace data. However, this creates only a single root span, which provides limited visibility. Let's explore how to instrument additional functions throughout your codebase for deeper insights.

#### Traces

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
>   // Functions without names will throw at runtime.
>   function apiRequest() {
>     // ... fetch("https://someapi.com")
>   }
> )
> ```

##### Instrumentation Configuration

In most cases, instrumenting your functions works seamlessly without additional configuration. However, certain scenarios, such as propagating an existing context for distributed tracing, customizing the span name, or reacting to the result of a wrapped function, may require further customization.

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
> The `instrumentEntrypoint` helper also supports instrumentation options, but since its second parameter is reserved for the global telemetry configuration, you must provide instrumentation-specific settings under the `instrumentationConfig` property:
> ```ts
> import { telemetryConfig } from "./telemetry"
>
> // Implementation of your main function
> function main(params) { /* ... */ }
> instrumentEntrypoint(main, {
>   ...telemetryConfig,
>   instrumentationConfig: {
>     // Place instrumentation options here.
>   }
> })
> ```

#### Logs

> [!WARNING]
> Log processing and exporting [is currently in development](https://opentelemetry.io/docs/languages/js/) in the OpenTelemetry SDK for Node.js. While we haven't encountered any issues or limitations, occasional problems or API changes may occur.

OpenTelemetry simplifies log exporting by handling the heavy lifting automatically, you just need to log normally. However, not all loggers are supported. OpenTelemetry provides auto-instrumentation for the Winston library, which in turn powers `@adobe/aio-lib-core-logging`, the library used for custom loggers in App Builder actions (and by the `Core.Logger` from `@adobe/aio-core-sdk`).

To export [logs](https://opentelemetry.io/docs/concepts/signals/logs/), ensure the Winston instrumentation is enabled. This comes configured by default in both `simple` and `full` presets when using the [configuration helper](#configuration-helper). If you're using a custom instrumentation array, make sure to include it.

You'll also need an observability backend capable of ingesting log data, such as New Relic, Grafana, or Betterstack. Refer to the [telemetry providers section](#-telemetry-providers) for more information.

##### Exporting Log Data

> [!TIP]
> When logging within an instrumented function (i.e., one that is traced), OpenTelemetry will automatically associate log entries with the corresponding trace, allowing you to correlate logs with specific trace executions.

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

#### Metrics

[Metrics](https://opentelemetry.io/docs/concepts/signals/metrics/) capture quantitative measurements of your service's behavior at runtime. Each measurement creates a metric event which consists not only of the measurement itself, but also the time at which it was captured and associated metadata. This section demonstrates how to implement metrics in your runtime actions using this module.

##### Configuring Metrics

To use metrics in our runtime actions, we'll need to revisit our `telemetry.{js|ts}` configuration file. In addition to returning the SDK configuration, we'll define a function that creates and returns our metrics as a key-value map. The module will manage the lifecycle of our metrics, making them accessible throughout our codebase.

This function is given to the `monitorConfig` property of the configuration, see the documentation on the  [application monitor](#configuring-the-application-monitor) above for more details. It receives the managed `meter` instance, which you can use to create your application metrics. Refer to the OpenTelemetry [metrics documentation](https://opentelemetry.io/docs/concepts/signals/metrics/) for more details on which types of metrics you can create.

```ts
const telemetryConfig = defineTelemetryConfig((params) => {
  const sdkConfig = makeNodeSdkConfig({
    /* Your telemetry configuration */
  })

  return {
    sdkConfig,
    monitorConfig: {
      createMetrics: (meter) => {
        return {
          // Add metrics as needed.
          counter: meter.createCounter("my_counter"),
        }
      }
    }
  };
});
```

##### Working With Our Metrics

With our metrics defined, we can now access the `metrics` managed by the application monitor. Using the `getApplicationMonitor` helper, we can retrieve our defined metrics throughout different parts of our codebase and record measurements as needed.

```ts
import { getApplicationMonitor } from "@adobe/aio-lib-telemetry"

function someFunctionInYourCode() {
  const { metrics } = getApplicationMonitor();
  metrics.counter.add(1);
}
```

> [!TIP]
> If you're working with TypeScript and you want to have type-safety for your metrics, you can give a generic argument to the `getApplicationMonitor` helper. This type must be a record of metric names and their corresponding metric types. 
> ```ts
> import { getApplicationMonitor } from "@adobe/aio-lib-telemetry"
> import { Counter } from "@opentelemetry/api"
>
> type MyMetrics = {
>   counter: Counter<Attributes>
> };
>
> const { metrics } = getApplicationMonitor<MyMetrics>();
> metrics.counter.add(1); // Type-safe and with auto-completion.
> ```

##### Considerations

- **Metrics reset on cold starts**: Runtime actions are not a process that runs continuously. Because of this, reported values represent data for the **current invocation only**. It's up to your observability backend to aggregate these values over time.

- **Aggregation happens externally**: Totals, averages, and other aggregations should be performed by your metrics backend (e.g., Prometheus, Datadog, or Adobe’s monitoring platform). Individual actions simply report raw measurements.

### Distributed Tracing and Context Propagation

In distributed systems, maintaining trace continuity across service boundaries is crucial for effective observability. This process, known as context propagation, enables distributed tracing by sharing trace context between services. For comprehensive details on this concept, refer to the [OpenTelemetry documentation](https://opentelemetry.io/docs/languages/js/propagation/).

This module automatically is able to handle context propagation, requiring only that you pass the carrier object (containing the trace context) to downstream services.

#### Propagating the Trace Context

When propagating the trace context, you need to pass the carrier object to the next service. This module provides a `serializeContextIntoCarrier` helper function to do this for you.

```ts
import { serializeContextIntoCarrier } from "@adobe/aio-lib-telemetry"

// Somewhere in your codebase.
function callExternalInstrumentedService() {
  const carrier = serializeContextIntoCarrier();
  // ... call the external service and send the carrier.
}
```
This will serialize the currently active trace context into the carrier object, which you can then send to the external service.

#### Receiving a Trace Context

To deserialize the trace context, specify where the `instrumentEntrypoint` (or `instrument`) helper should locate the carrier object. In the [instrumentation configuration](#instrumentation-configuration), provide a `getContextCarrier` function that **receives your instrumented function's arguments** and returns the carrier object.

```ts
function main(params) {
  // ...
}

instrumentEntrypoint(main, {
  instrumentationConfig: {
    propagation: {
      getContextCarrier: (params) => {
        return { 
          carrier: params.data.myCarrier
        }
      }
    }
  }
})
```
With this setup, your carrier object will be deserialized and the resulting context will be set for you.

#### Automatic Propagation

The module is built to automatically deserialize the trace context from a custom `x-telemetry-context` header. This is done by default when you use the `instrumentEntrypoint` helper. If you're invoking an external service that is instrumented with this module, such as another runtime action, you can send the pre-serialized carrier in a custom `x-telemetry-context` header. It will be automatically deserialized and used.

### Instrumentation Helpers

Within an instrumented runtime action, the `getInstrumentationHelpers` function provides a convenient set of utilities to streamline your telemetry code.

> [!WARNING]
> If you invoke this function from a non-instrumented function, it will throw an error.

```ts
import { getInstrumentationHelpers } from "@adobe/aio-lib-telemetry"

function someInstrumentedFunctionInYourCode() {
  const { currentSpan, context, monitor, logger } = getInstrumentationHelpers();

  // You can also use the helpers to create spans, metrics, etc.
  currentSpan.setAttribute("my-attribute", "my-value");
  monitor.metrics.counter.add(1);
  logger.info("my log message!");
  
  // The context object contains the current active trace context.
  // And a pre-serialized carrier object that you can use to propagate the trace context.
  const { active, carrier } = context;
}
```
This function receives the following helpers:

- `currentSpan`: The current span of the current operation.
- `context`: The current context of the current operation. It contains the following properties:
  - `current`: The current active trace context.
  - `carrier`: A pre-serialized carrier object that you can use to propagate the trace context.
- `monitor`: The managed instance of the application monitor.
- `logger`: A logger instance created for the current operation.

## ❓ Next Up

This module is a thin wrapper around the OpenTelemetry SDK for Node.js. For more information on the OpenTelemetry SDK, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/languages/js/). 

> [!IMPORTANT]
> It's not intended to be a full-fledged observability solution, but rather a tool to help you get started with OpenTelemetry and collect telemetry data in the context of Adobe App Builder runtime actions. It doesn't cover all the features of OpenTelemetry, but rather provides a simple and easy to use interface to get you started. 
>
> For advanced use cases you'll need to use the configuration options provided by this module to directly configure the underlying OpenTelemetry SDK, or use the OpenTelemetry SDK directly.

## 🩺 Troubleshooting

We are aware of a couple of (occasional) issues, which you can find workarounds for below. If you encounter any other problems, please file a GitHub issue.

### Hot Reloading and `aio app dev`

OpenTelemetry relies on global state to manage its internal components. When developing locally with `aio app dev`, your code is hot-reloaded as you make changes. Since the process remains alive during these reloads, the global state persists without being reset. This creates conflicts with the OpenTelemetry SDK, which expects to be initialized only once per process along with all its components. 

While this module attempts to manage the underlying OpenTelemetry SDK to minimize hot-reloading conflicts, some edge cases may still occur. If you encounter any issues, please file a GitHub issue with reproduction steps so we can address it.

### Telemetry Signals Not Being Exported

Due to the ephemeral nature of runtime actions, telemetry signals may occasionally fail to export before the container shuts down. While the module attempts to flush all signals when an action completes, certain edge cases can prevent this from occurring. If you experience this issue, please file a GitHub issue with reproduction steps so we can address it.

