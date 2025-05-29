# `instrument()`

```ts
function instrument<T>(
  fn: T,
  config: InstrumentationConfig<T>,
): (...args: Parameters<T>) => ReturnType<T>;
```

Defined in: [core/instrumentation.ts:76](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/core/instrumentation.ts#L76)

Instrument a function.

## Type Parameters

| Type Parameter              |
| --------------------------- |
| `T` _extends_ `AnyFunction` |

## Parameters

| Parameter | Type                                                                     | Description                                |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------ |
| `fn`      | `T`                                                                      | The function to instrument.                |
| `config`  | [`InstrumentationConfig`](../interfaces/InstrumentationConfig.md)\<`T`\> | The configuration for the instrumentation. |

## Returns

```ts
(...args: Parameters<T>): ReturnType<T>;
```

### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| ...`args` | `Parameters`\<`T`\> |

### Returns

`ReturnType`\<`T`\>
