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

Defined in: [core/config.ts:22](https://github.com/adobe/commerce-integration-starter-kit/blob/6d4d9f7c629d2abc0e81fce4567de926c2bddb60/packages/aio-lib-telemetry/source/core/config.ts#L22)

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
