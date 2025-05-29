# `getPresetInstrumentations()`

```ts
function getPresetInstrumentations(
  preset: TelemetryPreset,
):
  | (
      | HttpInstrumentation
      | GraphQLInstrumentation
      | UndiciInstrumentation
      | WinstonInstrumentation
    )[]
  | Instrumentation<InstrumentationConfig>[];
```

Defined in: [api/presets.ts:43](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/api/presets.ts#L43)

Get the instrumentations for a given preset.

## Parameters

| Parameter | Type                                                    | Description                                 |
| --------- | ------------------------------------------------------- | ------------------------------------------- |
| `preset`  | [`TelemetryPreset`](../type-aliases/TelemetryPreset.md) | The preset to get the instrumentations for. |

## Returns

\| (
\| `HttpInstrumentation`
\| `GraphQLInstrumentation`
\| `UndiciInstrumentation`
\| `WinstonInstrumentation`)[]
\| `Instrumentation`\<`InstrumentationConfig`\>[]
