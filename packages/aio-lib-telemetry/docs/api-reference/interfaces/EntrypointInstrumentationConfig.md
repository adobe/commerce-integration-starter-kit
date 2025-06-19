# `EntrypointInstrumentationConfig\<T\>`

Defined in: [types.ts:143](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L143)

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
  onResult?: (result: ReturnType<T>, span: Span) => void;
};
```

Defined in: [types.ts:109](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L109)

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

#### Inherited from

[`InstrumentationConfig`](InstrumentationConfig.md).[`hooks`](InstrumentationConfig.md#hooks)

---

### initializeTelemetry()

```ts
initializeTelemetry: (params: RecursiveStringRecord, isDevelopment: boolean) =>
  TelemetryConfig;
```

Defined in: [types.ts:159](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L159)

This function is called at the start of the action.

#### Parameters

| Parameter       | Type                    | Description                                        |
| --------------- | ----------------------- | -------------------------------------------------- |
| `params`        | `RecursiveStringRecord` | The parameters of the action.                      |
| `isDevelopment` | `boolean`               | Whether the action is running in development mode. |

#### Returns

[`TelemetryConfig`](TelemetryConfig.md)

The telemetry configuration to use for the action.

---

### isSuccessful()?

```ts
optional isSuccessful: (result: ReturnType<T>) => boolean;
```

Defined in: [types.ts:106](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L106)

A function that will be called to determine if the instrumented function was successful.
By default, the function is considered successful if it doesn't throw an error.

#### Parameters

| Parameter | Type                | Description                              |
| --------- | ------------------- | ---------------------------------------- |
| `result`  | `ReturnType`\<`T`\> | The result of the instrumented function. |

#### Returns

`boolean`

Whether the instrumented function was successful.

#### Inherited from

[`InstrumentationConfig`](InstrumentationConfig.md).[`isSuccessful`](InstrumentationConfig.md#issuccessful)

---

### propagation?

```ts
optional propagation: TelemetryPropagationConfig<T>;
```

Defined in: [types.ts:150](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L150)

Configuration options related to context propagation.
See the [TelemetryPropagationConfig](TelemetryPropagationConfig.md) for the interface.

---

### spanConfig?

```ts
optional spanConfig: SpanOptions & {
  getBaseContext?: (...args: Parameters<T>) => Context;
  spanName?: string;
};
```

Defined in: [types.ts:83](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L83)

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

#### Inherited from

[`InstrumentationConfig`](InstrumentationConfig.md).[`spanConfig`](InstrumentationConfig.md#spanconfig)
