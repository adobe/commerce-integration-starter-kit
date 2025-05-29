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

Defined in: [core/config.ts:22](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/core/config.ts#L22)

Helper to define the telemetry config for an entrypoint.

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
