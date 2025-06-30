# `instrument()`

```ts
function instrument<T>(
  fn: T,
  config: InstrumentationConfig<T>,
): (...args: Parameters<T>) => ReturnType<T>;
```

Defined in: [core/instrumentation.ts:91](https://github.com/adobe/commerce-integration-starter-kit/blob/6d4d9f7c629d2abc0e81fce4567de926c2bddb60/packages/aio-lib-telemetry/source/core/instrumentation.ts#L91)

Instruments a function.

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

A wrapped function with the same signature as the original function, but with telemetry instrumentation.

```ts
(...args: Parameters<T>): ReturnType<T>;
```

### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| ...`args` | `Parameters`\<`T`\> |

### Returns

`ReturnType`\<`T`\>

## Example

```ts
const instrumentedFn = instrument(someFunction, {
  // Optional configuration
  spanConfig: {
    spanName: "some-span",
    attributes: {
      "some-attribute": "some-value",
    },
  },
});
```
