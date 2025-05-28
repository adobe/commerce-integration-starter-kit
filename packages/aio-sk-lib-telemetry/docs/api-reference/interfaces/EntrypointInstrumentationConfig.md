# `EntrypointInstrumentationConfig\<T\>`

Defined in: [types.ts:106](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/types.ts#L106)

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

Defined in: [types.ts:98](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/types.ts#L98)

Hooks that can be used to act on a span depending on the result of the function.

#### onError()?

```ts
optional onError: (error: unknown, span: Span) => undefined | Error;
```

##### Parameters

| Parameter | Type      |
| --------- | --------- |
| `error`   | `unknown` |
| `span`    | `Span`    |

##### Returns

`undefined` \| `Error`

#### onSuccess()?

```ts
optional onSuccess: (result: ReturnType<T>, span: Span) => void;
```

##### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| `result`  | `ReturnType`\<`T`\> |
| `span`    | `Span`              |

##### Returns

`void`

#### Inherited from

[`InstrumentationConfig`](InstrumentationConfig.md).[`hooks`](InstrumentationConfig.md#hooks)

---

### initializeTelemetry()

```ts
initializeTelemetry: (params: RecursiveStringRecord, isDevelopment: boolean) => Partial<TelemetryApi> & {
  diagnostics?: false | TelemetryDiagnosticsConfig;
  sdkConfig: Partial<NodeSDKConfiguration>;
};
```

Defined in: [types.ts:112](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/types.ts#L112)

This function will be called at the very beginning of the action.

#### Parameters

| Parameter       | Type                    |
| --------------- | ----------------------- |
| `params`        | `RecursiveStringRecord` |
| `isDevelopment` | `boolean`               |

#### Returns

`Partial`\<[`TelemetryApi`](TelemetryApi.md)\> & \{
`diagnostics?`: `false` \| [`TelemetryDiagnosticsConfig`](TelemetryDiagnosticsConfig.md);
`sdkConfig`: `Partial`\<`NodeSDKConfiguration`\>;
\}

---

### propagation?

```ts
optional propagation: TelemetryPropagationConfig<T>;
```

Defined in: [types.ts:109](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/types.ts#L109)

---

### traceConfig?

```ts
optional traceConfig: {
  automaticSpanEvents?: AutomaticSpanEvents[];
  getBaseContext?: (...args: Parameters<T>) => Context;
  spanName?: string;
  spanOptions?: SpanOptions;
};
```

Defined in: [types.ts:77](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/types.ts#L77)

#### automaticSpanEvents?

```ts
optional automaticSpanEvents: AutomaticSpanEvents[];
```

The events that should be automatically recorded on the span.

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

| Parameter | Type                |
| --------- | ------------------- |
| ...`args` | `Parameters`\<`T`\> |

##### Returns

`Context`

#### spanName?

```ts
optional spanName: string;
```

The name of the span.

##### Default

```ts
The name of the function.
```

#### spanOptions?

```ts
optional spanOptions: SpanOptions;
```

The options for the span.

#### Inherited from

[`InstrumentationConfig`](InstrumentationConfig.md).[`traceConfig`](InstrumentationConfig.md#traceconfig)
