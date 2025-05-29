# `TelemetryPropagationConfig\<T\>`

Defined in: [types.ts:55](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L55)

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

Defined in: [types.ts:66](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L66)

A function that returns the carrier for the current context.

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

Defined in: [types.ts:60](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L60)

Whether to skip the propagation of the context.

#### Default

```ts
false;
```
