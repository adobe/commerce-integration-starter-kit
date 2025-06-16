# `TelemetryConfig`

Defined in: types.ts:141

The configuration options for the telemetry module.

## Extends

- `Partial`\<[`TelemetryApi`](TelemetryApi.md)\>

## Properties

### diagnostics?

```ts
optional diagnostics: false | TelemetryDiagnosticsConfig;
```

Defined in: types.ts:149

The configuration options for the telemetry diagnostics.

---

### meter?

```ts
optional meter: Meter;
```

Defined in: types.ts:181

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

Defined in: types.ts:146

The configuration options for the OpenTelemetry SDK.
See the [NodeSDKConfiguration](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.NodeSDKConfiguration.html) interface.

---

### tracer?

```ts
optional tracer: Tracer;
```

Defined in: types.ts:178

The tracer used to create spans.

#### Inherited from

```ts
Partial.tracer;
```
