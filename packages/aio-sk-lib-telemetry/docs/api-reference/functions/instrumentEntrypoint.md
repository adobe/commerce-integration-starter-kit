# `instrumentEntrypoint()`

```ts
function instrumentEntrypoint<T>(
  fn: T,
  config: EntrypointInstrumentationConfig<T>,
): (params: RecursiveStringRecord) => Promise<Awaited<ReturnType<T>>>;
```

Defined in: [core/instrumentation.ts:243](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/core/instrumentation.ts#L243)

Instruments the entrypoint of a runtime action.

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

```ts
(params: RecursiveStringRecord): Promise<Awaited<ReturnType<T>>>;
```

### Parameters

| Parameter | Type                    |
| --------- | ----------------------- |
| `params`  | `RecursiveStringRecord` |

### Returns

`Promise`\<`Awaited`\<`ReturnType`\<`T`\>\>\>
