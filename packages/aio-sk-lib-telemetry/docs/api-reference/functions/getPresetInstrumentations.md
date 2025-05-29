# `getPresetInstrumentations()`

```ts
function getPresetInstrumentations(
  preset: TelemetryInstrumentationPreset,
):
  | (
      | HttpInstrumentation
      | GraphQLInstrumentation
      | UndiciInstrumentation
      | WinstonInstrumentation
    )[]
  | Instrumentation<InstrumentationConfig>[];
```

Defined in: [api/presets.ts:57](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/api/presets.ts#L57)

Get the instrumentations for a given preset.

## Parameters

| Parameter | Type                                                                                  | Description                                 |
| --------- | ------------------------------------------------------------------------------------- | ------------------------------------------- |
| `preset`  | [`TelemetryInstrumentationPreset`](../type-aliases/TelemetryInstrumentationPreset.md) | The preset to get the instrumentations for. |

## Returns

\| (
\| `HttpInstrumentation`
\| `GraphQLInstrumentation`
\| `UndiciInstrumentation`
\| `WinstonInstrumentation`)[]
\| `Instrumentation`\<`InstrumentationConfig`\>[]

The instrumentations for the given preset:

- `full`: All the Node.js [auto-instrumentations](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node)
- `simple`: Instrumentations for:
  [Http](https://www.npmjs.com/package/@opentelemetry/instrumentation-http),
  [GraphQL](https://www.npmjs.com/package/@opentelemetry/instrumentation-graphql),
  [Undici](https://www.npmjs.com/package/@opentelemetry/instrumentation-undici), and
  [Winston](https://www.npmjs.com/package/@opentelemetry/instrumentation-winston)

## Example

```ts
const instrumentations = getPresetInstrumentations("simple");
// instrumentations = [HttpInstrumentation, GraphQLInstrumentation, UndiciInstrumentation, WinstonInstrumentation]
```
