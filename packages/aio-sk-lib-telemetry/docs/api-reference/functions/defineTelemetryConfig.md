# `defineTelemetryConfig()`

```ts
function defineTelemetryConfig(
  init: (
    params: RecursiveStringRecord,
    isDevelopment: boolean,
  ) => Partial<TelemetryApi> & {
    diagnostics?: false | TelemetryDiagnosticsConfig;
    sdkConfig: Partial<NodeSDKConfiguration>;
  },
): {
  initializeTelemetry: (
    params: RecursiveStringRecord,
    isDevelopment: boolean,
  ) => Partial<TelemetryApi> & {
    diagnostics?: false | TelemetryDiagnosticsConfig;
    sdkConfig: Partial<NodeSDKConfiguration>;
  };
};
```

Defined in: [core/config.ts:22](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/core/config.ts#L22)

Helper to define the telemetry config for an entrypoint (with type safety).

## Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                 | Description                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `init`    | (`params`: `RecursiveStringRecord`, `isDevelopment`: `boolean`) => `Partial`\<[`TelemetryApi`](../interfaces/TelemetryApi.md)\> & \{ `diagnostics?`: \| `false` \| [`TelemetryDiagnosticsConfig`](../interfaces/TelemetryDiagnosticsConfig.md); `sdkConfig`: `Partial`\<`NodeSDKConfiguration`\>; \} | The function to initialize the telemetry. |

## Returns

```ts
{
  initializeTelemetry: (params: RecursiveStringRecord, isDevelopment: boolean) => Partial<TelemetryApi> & {
     diagnostics?:   | false
        | TelemetryDiagnosticsConfig;
     sdkConfig: Partial<NodeSDKConfiguration>;
  };
}
```

### initializeTelemetry()

```ts
initializeTelemetry: (params: RecursiveStringRecord, isDevelopment: boolean) => Partial<TelemetryApi> & {
  diagnostics?:   | false
     | TelemetryDiagnosticsConfig;
  sdkConfig: Partial<NodeSDKConfiguration>;
} = init;
```

#### Parameters

| Parameter       | Type                    |
| --------------- | ----------------------- |
| `params`        | `RecursiveStringRecord` |
| `isDevelopment` | `boolean`               |

#### Returns

`Partial`\<[`TelemetryApi`](../interfaces/TelemetryApi.md)\> & \{
`diagnostics?`: \| `false`
\| [`TelemetryDiagnosticsConfig`](../interfaces/TelemetryDiagnosticsConfig.md);
`sdkConfig`: `Partial`\<`NodeSDKConfiguration`\>;
\}
