# `InstrumentationContext`

Defined in: [types.ts:185](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L185)

The context for the current operation.

## Properties

### contextCarrier

```ts
contextCarrier: Record<string, string>;
```

Defined in: [types.ts:199](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L199)

Holds a carrier that can be used to propagate the active context.

---

### currentSpan

```ts
currentSpan: Span;
```

Defined in: [types.ts:196](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L196)

The span of the current operation.

---

### logger

```ts
logger: AioLogger;
```

Defined in: [types.ts:193](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L193)

The logger for the current operation.

---

### meter

```ts
meter: Meter;
```

Defined in: [types.ts:190](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L190)

The meter used to create the metrics.

---

### tracer

```ts
tracer: Tracer;
```

Defined in: [types.ts:187](https://github.com/adobe/commerce-integration-starter-kit/blob/7bab865cdac63499cf83c46b58de1aec6528b17f/packages/aio-sk-lib-telemetry/source/types.ts#L187)

The tracer used to create the spans.
