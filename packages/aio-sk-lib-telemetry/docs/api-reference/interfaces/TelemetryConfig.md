# `TelemetryConfig`

Defined in: [types.ts:140](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L140)

The configuration options for the telemetry module.

## Extends

- `Partial`\<[`TelemetryApi`](TelemetryApi.md)\>

## Properties

### diagnostics?

```ts
optional diagnostics: false | TelemetryDiagnosticsConfig;
```

Defined in: [types.ts:148](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L148)

The configuration options for the telemetry diagnostics.

---

### meter?

```ts
optional meter: Meter;
```

Defined in: [types.ts:181](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L181)

The meter used to create metrics.

#### Inherited from

```ts
Partial.meter;
```

---

### sdkConfig

```ts
sdkConfig: Partial<NodeSDKConfiguration>;
```

Defined in: [types.ts:145](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L145)

The configuration options for the OpenTelemetry SDK.
See the [NodeSDKConfiguration](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.NodeSDKConfiguration.html) interface.

---

### tracer?

```ts
optional tracer: Tracer;
```

Defined in: [types.ts:178](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L178)

The tracer used to create spans.

#### Inherited from

```ts
Partial.tracer;
```
