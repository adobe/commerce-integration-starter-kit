# 🔭 Introduction to OpenTelemetry

This overview serves as a curated collection of the most important concepts and patterns from the extensive official OpenTelemetry documentation. For any topics not included here, you will find links throughout the guide that direct you to the relevant sections of the official documentation. Use these links to explore further or clarify details as you work with OpenTelemetry in practice.

<br />
<div align="center">
  <img alt="OpenTelemetry Logo" src="./images/open-telemetry.png">
</div>
<br />

- [🔭 Introduction to OpenTelemetry](#-introduction-to-opentelemetry)
  - [What is OpenTelemetry?](#what-is-opentelemetry)
  - [OTLP Protocol](#otlp-protocol)
    - [Supported Transmission Protocols](#supported-transmission-protocols)
    - [Default Ports](#default-ports)
  - [Usage Patterns](#usage-patterns)
    - [Application-Level Export](#application-level-export)
    - [Collector-Based Export](#collector-based-export)
      - [Architecture: Receivers, Processors, Exporters](#architecture-receivers-processors-exporters)
  - [Supported Services and Backends](#supported-services-and-backends)
  - [What does _instrumentation_ mean?](#what-does-instrumentation-mean)
    - [Automatic Instrumentation](#automatic-instrumentation)
    - [Manual Instrumentation](#manual-instrumentation)
  - [Next Up](#next-up)


## What is OpenTelemetry?

OpenTelemetry is an open-source framework for collecting, processing, and exporting telemetry data from applications, such as traces, metrics, and logs. It provides standardized APIs and SDKs that enable consistent observability across distributed systems, regardless of language or platform. 

> [!NOTE]
> The framework is governed by a comprehensive specification that defines the behavior and requirements for all OpenTelemetry components, ensuring interoperability and consistency across different implementations.

## OTLP Protocol

The OpenTelemetry Protocol (OTLP) is the default, vendor-neutral protocol for transmitting telemetry data between components such as SDKs, collectors, and backends. OTLP supports traces, metrics, and logs, and enables efficient, standardized communication across the observability pipeline. ([Learn more](https://opentelemetry.io/docs/specs/otlp/))

### Supported Transmission Protocols

OTLP supports multiple transmission protocols and encodings to accommodate different environments and performance requirements:

- **gRPC (Protobuf)** is the primary protocol for OTLP, offering efficient, bi-directional streaming and low-latency communication between components. All data is encoded using Protobuf.

- **HTTP/Protobuf** uses HTTP as the transport protocol with Protobuf-encoded payloads (`Content-Type: application/x-protobuf`). This is widely supported and efficient for most production use cases.

- **HTTP/JSON** uses HTTP as the transport protocol with JSON-encoded payloads (`Content-Type: application/json`). The JSON encoding follows the Protobuf-to-JSON mapping defined by the OTLP spec, making it suitable for environments where Protobuf is not practical or for easier debugging and interoperability. Not all backends support JSON yet, but it is part of the official specification.

### Default Ports

- **OTLP/gRPC** uses port `4317` by default.
- **OTLP/HTTP** (both Protobuf and JSON) uses port `4318` by default.

## Usage Patterns

### Application-Level Export

The simplest pattern is to export your telemetry signals directly to an observability backend. This is usually done via a language-specific OpenTelemetry SDK. It's the easiest to setup and requires no intermediate infrastructure, which makes it suitable for development/test environments, but not for production use cases.

> [!NOTE]
> When exporting telemetry directly from the application, the pipeline model described above does not fully apply. There are no receivers involved; the SDK sends data directly to the backend using an exporter (with optional, in-code processing).

<br />
<div align="center">
  <img alt="OpenTelemetry Logo" src="./images/no-collector.png">
</div>

### Collector-Based Export

The OpenTelemetry Collector is a standalone service designed to receive, process, and export telemetry data from multiple sources. It acts as an intermediary between instrumented applications and observability backends, providing a flexible and scalable way to manage telemetry pipelines.

When using a Collector, your application sends telemetry data to the Collector endpoint instead of directly to the backend. The Collector receives this data (via its receivers), applies optional processing (such as batching, filtering, or transformation), and then exports it to one or more destinations using its configured exporters. This architecture decouples your application from backend-specific exporters and allows you to centralize telemetry management, transformation, and routing.

Collectors are commonly deployed in two patterns:

- **Agent:** Runs as a sidecar or daemon on the same host as your application, collecting telemetry locally before forwarding it to a central Collector or backend. ([Learn more](https://opentelemetry.io/docs/collector/deployment/agent/))

- **Gateway:** Runs as a remote service, aggregating telemetry from multiple sources before exporting to observability platforms. ([Learn more](https://opentelemetry.io/docs/collector/deployment/gateway/))

This approach is recommended for production environments, as it enables advanced features like multi-destination export, data enrichment, and dynamic configuration without modifying application code. ([Learn more](https://opentelemetry.io/docs/collector/))

<br />
<div align="center">
  <img alt="OpenTelemetry Collector Architecture" src="./images/with-collector.png">
</div>

#### Architecture: Receivers, Processors, Exporters

The OpenTelemetry Collector follows a pipeline model consisting of three key components, **receivers**, **processors**, and **exporters**.

1. Telemetry data is first collected by receivers, which ingest data from instrumented applications or external sources. 
2. The data then passes through processors, which can modify, batch, or filter the telemetry before it is sent to exporters. 
3. Exporters are responsible for delivering the processed data to external observability platforms or storage systems.

<br />
<div align="center">
  <img alt="OpenTelemetry Logo" src="./images/otel-architecture.png">
</div>

## Supported Services and Backends

OpenTelemetry is highly versatile and is rapidly becoming the standard for observability across the industry. It is supported by a wide range of cloud providers, monitoring platforms, and open source tools, enabling you to export telemetry data to systems like AWS X-Ray, Google Cloud Operations, Azure Monitor, Datadog, New Relic, Jaeger, Zipkin, Prometheus, and many others.

## What does _instrumentation_ mean?

For a system to be [observable](https://opentelemetry.io/docs/concepts/observability-primer/#what-is-observability), it must be instrumented: that is, code from the system's components must emit [signals](https://opentelemetry.io/docs/concepts/signals/), such as [traces](https://opentelemetry.io/docs/concepts/signals/), [metrics](https://opentelemetry.io/docs/concepts/signals/metrics/), and [logs](https://opentelemetry.io/docs/concepts/signals/logs/). Using OpenTelemetry, you can instrument your code in two primary ways:

### Automatic Instrumentation

Automatic instrumentation in OpenTelemetry comes in two main forms: zero-code and native instrumentation.

**Zero-code instrumentation** enables you to collect telemetry from your application without changing its source code. This is typically achieved by using agents, environment variables, or runtime hooks that automatically instrument supported libraries and frameworks. Zero-code is ideal for quickly adding observability, especially when you cannot or do not want to modify application code. It provides visibility into what's happening at the edges of your application and is a fast way to get started. ([Learn more](https://opentelemetry.io/docs/concepts/instrumentation/zero-code/))

**Native instrumentation** refers to libraries and platforms that have OpenTelemetry support built in. When you use these libraries, they emit telemetry data automatically, providing deep and reliable observability. OpenTelemetry recommends native instrumentation as the most robust approach, since it is directly maintained by library authors and ensures consistent, high-quality telemetry. ([Learn more](https://opentelemetry.io/docs/concepts/instrumentation/libraries/))

### Manual Instrumentation

Manual (code-based) instrumentation involves explicitly adding OpenTelemetry API calls to your application code. This approach gives you full control to create custom spans, metrics, and logs that reflect your business logic and critical operations. Manual instrumentation is essential for capturing deep, application-specific insights that automatic or zero-code instrumentation cannot provide.

You can use manual instrumentation alongside automatic and native approaches for the most complete observability. It is especially valuable for tracking custom workflows, business transactions, or any logic not covered by existing libraries or frameworks.

For details and examples, see the [OpenTelemetry code-based instrumentation guide](https://opentelemetry.io/docs/concepts/instrumentation/code-based/).

## Next Up

For more comprehensive information and advanced topics, refer to the [official OpenTelemetry documentation](https://opentelemetry.io/docs/). This overview introduces core concepts but does not cover every aspect or advanced feature of the OpenTelemetry ecosystem.
