# `InstrumentationConfig\<T\>`

Defined in: types.ts:87

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
  onSuccess?: (result: ReturnType<T>, span: Span) => void;
};
```

Defined in: types.ts:119

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

#### onSuccess()?

```ts
optional onSuccess: (result: ReturnType<T>, span: Span) => void;
```

A function that will be called when the instrumented function succeeds.
You can use it to do something with the Span.

##### Parameters

| Parameter | Type                | Description                              |
| --------- | ------------------- | ---------------------------------------- |
| `result`  | `ReturnType`\<`T`\> | The result of the instrumented function. |
| `span`    | `Span`              | The span of the instrumented function.   |

##### Returns

`void`

---

### spanConfig?

```ts
optional spanConfig: SpanOptions & {
  automaticSpanEvents?: AutomaticSpanEvents[];
  getBaseContext?: (...args: Parameters<T>) => Context;
  spanName?: string;
};
```

Defined in: types.ts:92

Configuration options related to the span started by the instrumented function.
See also the [SpanOptions](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api._opentelemetry_api.SpanOptions.html) interface.

#### Type declaration

##### automaticSpanEvents?

```ts
optional automaticSpanEvents: AutomaticSpanEvents[];
```

The events that should be automatically recorded on the span.
See the [AutomaticSpanEvents](../type-aliases/AutomaticSpanEvents.md) type for the available options.

> [!WARNING]
> BE CAREFUL about how you use this, as you may end up exposing sensitive data in your observability platform.

###### Default

```ts
[];
```

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
