# `InstrumentationContext`

Defined in: [types.ts:128](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L128)

The context for the current operation.

## Properties

### contextCarrier

```ts
contextCarrier: Record<string, string>;
```

Defined in: [types.ts:142](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L142)

Holds a carrier that can be used to propagate the active context.

---

### currentSpan

```ts
currentSpan: Span;
```

Defined in: [types.ts:139](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L139)

The span of the current operation.

---

### logger

```ts
logger: AioLogger;
```

Defined in: [types.ts:136](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L136)

The logger for the current operation.

---

### meter

```ts
meter: Meter;
```

Defined in: [types.ts:133](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L133)

The meter used to create the metrics.

---

### tracer

```ts
tracer: Tracer;
```

Defined in: [types.ts:130](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/types.ts#L130)

The tracer used to create the spans.
