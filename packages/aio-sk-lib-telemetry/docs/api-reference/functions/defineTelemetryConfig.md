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

Defined in: [core/config.ts:22](https://github.com/adobe/commerce-integration-starter-kit/blob/dc8e8d16862bde414fa630722c6f5b2fafb02d6d/packages/aio-sk-lib-telemetry/source/core/config.ts#L22)

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
