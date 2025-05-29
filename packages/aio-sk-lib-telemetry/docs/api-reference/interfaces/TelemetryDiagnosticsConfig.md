# `TelemetryDiagnosticsConfig`

Defined in: [types.ts:37](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L37)

The configuration for the telemetry diagnostics.

## Properties

### exportLogs?

```ts
optional exportLogs: boolean;
```

Defined in: [types.ts:51](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L51)

Whether to export the logs to the console.

#### Default

```ts
true;
```

---

### loggerName?

```ts
optional loggerName: string;
```

Defined in: [types.ts:45](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L45)

The name of the logger to use for the diagnostics.

#### Default

`${actionName}/otel-diagnostics`

---

### logLevel

```ts
logLevel: "info" | "error" | "none" | "warn" | "debug" | "verbose" | "all";
```

Defined in: [types.ts:39](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L39)

The log level for the diagnostics.
