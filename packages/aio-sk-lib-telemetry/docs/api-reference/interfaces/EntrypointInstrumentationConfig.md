# `EntrypointInstrumentationConfig\<T\>`

Defined in: [types.ts:152](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L152)

The configuration for entrypoint instrumentation.

## Extends

- [`InstrumentationConfig`](InstrumentationConfig.md)\<`T`\>

## Type Parameters

| Type Parameter              | Default type  |
| --------------------------- | ------------- |
| `T` _extends_ `AnyFunction` | `AnyFunction` |

## Properties

### hooks?

```ts
optional hooks: {
  onError?: (error: unknown, span: Span) => undefined | Error;
  onSuccess?: (result: ReturnType<T>, span: Span) => void;
};
```

Defined in: [types.ts:118](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L118)

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

#### Inherited from

[`InstrumentationConfig`](InstrumentationConfig.md).[`hooks`](InstrumentationConfig.md#hooks)

---

### initializeTelemetry()

```ts
initializeTelemetry: (params: RecursiveStringRecord, isDevelopment: boolean) =>
  TelemetryConfig;
```

Defined in: [types.ts:169](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L169)

This function will be called at the very beginning of the action.

#### Parameters

| Parameter       | Type                    | Description                                        |
| --------------- | ----------------------- | -------------------------------------------------- |
| `params`        | `RecursiveStringRecord` | The parameters of the action.                      |
| `isDevelopment` | `boolean`               | Whether the action is running in development mode. |

#### Returns

[`TelemetryConfig`](TelemetryConfig.md)

The telemetry configuration to use for the action.

---

### propagation?

```ts
optional propagation: TelemetryPropagationConfig<T>;
```

Defined in: [types.ts:160](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L160)

Configuration options related to context propagation.
See the [TelemetryPropagationConfig](TelemetryPropagationConfig.md) for the interface.

---

### spanConfig?

```ts
optional spanConfig: {
  automaticSpanEvents?: AutomaticSpanEvents[];
  getBaseContext?: (...args: Parameters<T>) => Context;
  spanName?: string;
  spanOptions?: SpanOptions;
};
```

Defined in: [types.ts:90](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L90)

Configuration options related to the span started by the instrumented function.

#### automaticSpanEvents?

```ts
optional automaticSpanEvents: AutomaticSpanEvents[];
```

The events that should be automatically recorded on the span.

BE CAREFUL about how you use this, as you may end up exposing sensitive data in your observability platform.

##### Default

```ts
[];
```

#### getBaseContext()?

```ts
optional getBaseContext: (...args: Parameters<T>) => Context;
```

The base context to use for the started span.

##### Parameters

| Parameter | Type                | Description                                 |
| --------- | ------------------- | ------------------------------------------- |
| ...`args` | `Parameters`\<`T`\> | The arguments of the instrumented function. |

##### Returns

`Context`

The base context to use for the started span.

#### spanName?

```ts
optional spanName: string;
```

The name of the span. Defaults to the name of given function.
You must use a named function or a provide a name here.

#### spanOptions?

```ts
optional spanOptions: SpanOptions;
```

The [options](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api._opentelemetry_api.SpanOptions.html) for the span.

#### Inherited from

[`InstrumentationConfig`](InstrumentationConfig.md).[`spanConfig`](InstrumentationConfig.md#spanconfig)
