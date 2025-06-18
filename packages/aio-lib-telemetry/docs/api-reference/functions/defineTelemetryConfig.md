# `defineTelemetryConfig()`

```ts
function defineTelemetryConfig(
  init: (
    params: RecursiveStringRecord,
    isDevelopment: boolean,
  ) => TelemetryConfig,
): {
  initializeTelemetry: (
    params: RecursiveStringRecord,
    isDevelopment: boolean,
  ) => TelemetryConfig;
};
```

Defined in: [core/config.ts:22](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/core/config.ts#L22)

Helper to define the telemetry config for an entrypoint.

## Parameters

| Parameter | Type                                                                                                                     | Description                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `init`    | (`params`: `RecursiveStringRecord`, `isDevelopment`: `boolean`) => [`TelemetryConfig`](../interfaces/TelemetryConfig.md) | The function to initialize the telemetry. |

## Returns

```ts
{
  initializeTelemetry: (
    params: RecursiveStringRecord,
    isDevelopment: boolean,
  ) => TelemetryConfig;
}
```

### initializeTelemetry()

```ts
initializeTelemetry: (params: RecursiveStringRecord, isDevelopment: boolean) =>
  (TelemetryConfig = init);
```

#### Parameters

| Parameter       | Type                    |
| --------------- | ----------------------- |
| `params`        | `RecursiveStringRecord` |
| `isDevelopment` | `boolean`               |

#### Returns

[`TelemetryConfig`](../interfaces/TelemetryConfig.md)
