# `InstrumentationConfig\<T\>`

Defined in: [types.ts:78](https://github.com/adobe/commerce-integration-starter-kit/blob/d331e59f0d2bdbb84c234c4a5a46f01bc1fa0c09/packages/aio-lib-telemetry/source/types.ts#L78)

The configuration for instrumentation.

## Extended by

- [`EntrypointInstrumentationConfig`](EntrypointInstrumentationConfig.md)

## Type Parameters

| Type Parameter              |
| --------------------------- |
| `T` _extends_ `AnyFunction` |

## Properties

### hooks?

```ts
optional hooks: {
  onError?: (error: unknown, span: Span) => undefined | Error;
  onResult?: (result: ReturnType<T>, span: Span) => void;
};
```

Defined in: [types.ts:109](https://github.com/adobe/commerce-integration-starter-kit/blob/d331e59f0d2bdbb84c234c4a5a46f01bc1fa0c09/packages/aio-lib-telemetry/source/types.ts#L109)

Hooks that can be used to act on a span depending on the result of the function.

#### onError()?

```ts
optional onError: (error: unknown, span: Span) => undefined | Error;
```

A function that will be called when the instrumented function fails.
You can use it to do something with the Span.

##### Parameters

| Parameter | Type      | Description                                      |
| --------- | --------- | ------------------------------------------------ |
| `error`   | `unknown` | The error produced by the instrumented function. |
| `span`    | `Span`    | The span of the instrumented function.           |

##### Returns

`undefined` \| `Error`

#### onResult()?

```ts
optional onResult: (result: ReturnType<T>, span: Span) => void;
```

A function that will be called with the result of the instrumented function (if any, and no error was thrown).
You can use it to do something with the Span.

##### Parameters

| Parameter | Type                | Description                              |
| --------- | ------------------- | ---------------------------------------- |
| `result`  | `ReturnType`\<`T`\> | The result of the instrumented function. |
| `span`    | `Span`              | The span of the instrumented function.   |

##### Returns

`void`

---

### isSuccessful()?

```ts
optional isSuccessful: (result: ReturnType<T>) => boolean;
```

Defined in: [types.ts:106](https://github.com/adobe/commerce-integration-starter-kit/blob/d331e59f0d2bdbb84c234c4a5a46f01bc1fa0c09/packages/aio-lib-telemetry/source/types.ts#L106)

A function that will be called to determine if the instrumented function was successful.
By default, the function is considered successful if it doesn't throw an error.

#### Parameters

| Parameter | Type                | Description                              |
| --------- | ------------------- | ---------------------------------------- |
| `result`  | `ReturnType`\<`T`\> | The result of the instrumented function. |

#### Returns

`boolean`

Whether the instrumented function was successful.

---

### spanConfig?

```ts
optional spanConfig: SpanOptions & {
  getBaseContext?: (...args: Parameters<T>) => Context;
  spanName?: string;
};
```

Defined in: [types.ts:83](https://github.com/adobe/commerce-integration-starter-kit/blob/d331e59f0d2bdbb84c234c4a5a46f01bc1fa0c09/packages/aio-lib-telemetry/source/types.ts#L83)

Configuration options related to the span started by the instrumented function.
See also the [SpanOptions](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api._opentelemetry_api.SpanOptions.html) interface.

#### Type declaration

##### getBaseContext()?

```ts
optional getBaseContext: (...args: Parameters<T>) => Context;
```

The base context to use for the started span.

###### Parameters

| Parameter | Type                | Description                                 |
| --------- | ------------------- | ------------------------------------------- |
| ...`args` | `Parameters`\<`T`\> | The arguments of the instrumented function. |

###### Returns

`Context`

The base context to use for the started span.

##### spanName?

```ts
optional spanName: string;
```

The name of the span. Defaults to the name of given function.
You must use a named function or a provide a name here.
