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

Defined in: [api/presets.ts:43](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/api/presets.ts#L43)

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
