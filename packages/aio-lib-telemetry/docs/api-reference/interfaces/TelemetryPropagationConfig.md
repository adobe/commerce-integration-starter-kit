# `TelemetryPropagationConfig\<T\>`

Defined in: [types.ts:55](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L55)

Configuration related to context propagation (for distributed tracing).

## Type Parameters

| Type Parameter              |
| --------------------------- |
| `T` _extends_ `AnyFunction` |

## Properties

### getContextCarrier()?

```ts
optional getContextCarrier: (...args: Parameters<T>) => {
  baseCtx?: Context;
  carrier: Record<string, string>;
};
```

Defined in: [types.ts:71](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L71)

A function that returns the carrier for the current context.
Use it to specify where your carrier is located in the incoming parameters, when it's not one of the defaults.

#### Parameters

| Parameter | Type                | Description                                 |
| --------- | ------------------- | ------------------------------------------- |
| ...`args` | `Parameters`\<`T`\> | The arguments of the instrumented function. |

#### Returns

```ts
{
  baseCtx?: Context;
  carrier: Record<string, string>;
}
```

The carrier of the context to retrieve and an optional base context to use for the started span (defaults to the active context).

##### baseCtx?

```ts
optional baseCtx: Context;
```

##### carrier

```ts
carrier: Record<string, string>;
```

---

### skip?

```ts
optional skip: boolean;
```

Defined in: [types.ts:62](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/types.ts#L62)

By default, an instrumented entrypoint will try to automatically read (and use) the context from the incoming request.
Set to `true` if you want to skip this automatic context propagation.

#### Default

```ts
false;
```
