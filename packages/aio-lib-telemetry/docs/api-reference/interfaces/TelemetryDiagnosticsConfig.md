# `TelemetryDiagnosticsConfig`

Defined in: [types.ts:36](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L36)

The configuration for the telemetry diagnostics.

## Properties

### exportLogs?

```ts
optional exportLogs: boolean;
```

Defined in: [types.ts:51](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L51)

Whether to make OpenTelemetry also export the diagnostic logs to the configured exporters.
Set to `false` if you don't want to see diagnostic logs in your observability platform.

#### Default

```ts
true;
```

---

### loggerName?

```ts
optional loggerName: string;
```

Defined in: [types.ts:44](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L44)

The name of the logger to use for the diagnostics.

#### Default

`${actionName}/otel-diagnostics`

---

### logLevel

```ts
logLevel: "info" | "error" | "none" | "warn" | "debug" | "verbose" | "all";
```

Defined in: [types.ts:38](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L38)

The log level to use for the diagnostics.
