# `TelemetryConfig`

Defined in: [types.ts:131](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L131)

The configuration options for the telemetry module.

## Extends

- `Partial`\<[`TelemetryApi`](TelemetryApi.md)\>

## Properties

### diagnostics?

```ts
optional diagnostics: false | TelemetryDiagnosticsConfig;
```

Defined in: [types.ts:139](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L139)

The configuration options for the telemetry diagnostics.

---

### meter?

```ts
optional meter: Meter;
```

Defined in: [types.ts:171](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L171)

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

Defined in: [types.ts:136](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L136)

The configuration options for the OpenTelemetry SDK.
See the [NodeSDKConfiguration](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.NodeSDKConfiguration.html) interface.

---

### tracer?

```ts
optional tracer: Tracer;
```

Defined in: [types.ts:168](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L168)

The tracer used to create spans.

#### Inherited from

```ts
Partial.tracer;
```
