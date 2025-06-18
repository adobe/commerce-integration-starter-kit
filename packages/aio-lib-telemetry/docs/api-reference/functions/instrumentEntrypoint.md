# `instrumentEntrypoint()`

```ts
function instrumentEntrypoint<T>(
  fn: T,
  config: EntrypointInstrumentationConfig<T>,
): (params: RecursiveStringRecord) => Promise<Awaited<ReturnType<T>>>;
```

Defined in: [core/instrumentation.ts:247](https://github.com/adobe/commerce-integration-starter-kit/blob/ee21c0d99f4f907fa0cc3bc14f4f86e941a1c9f2/packages/aio-lib-telemetry/source/core/instrumentation.ts#L247)

Instruments the entrypoint of a runtime action.
Needs to be used ONLY with the `main` function of a runtime action.

## Type Parameters

| Type Parameter                                             |
| ---------------------------------------------------------- |
| `T` _extends_ (`params`: `RecursiveStringRecord`) => `any` |

## Parameters

| Parameter | Type                                                                                         | Description                                           |
| --------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `fn`      | `T`                                                                                          | The entrypoint function to instrument.                |
| `config`  | [`EntrypointInstrumentationConfig`](../interfaces/EntrypointInstrumentationConfig.md)\<`T`\> | The configuration for the entrypoint instrumentation. |

## Returns

A wrapped function with the same signature as the original function, but with telemetry instrumentation.

```ts
(params: RecursiveStringRecord): Promise<Awaited<ReturnType<T>>>;
```

### Parameters

| Parameter | Type                    |
| --------- | ----------------------- |
| `params`  | `RecursiveStringRecord` |

### Returns

`Promise`\<`Awaited`\<`ReturnType`\<`T`\>\>\>

## Example

```ts
import { telemetryConfig } from "../telemetry";

const instrumentedEntrypoint = instrumentEntrypoint(main, {
  ...telemetryConfig,
  // Optional configuration
});
```
