# `InstrumentationContext`

Defined in: [types.ts:188](https://github.com/adobe/commerce-integration-starter-kit/blob/10ddba8a9c7717ad0f94121f8c82f9de10856848/packages/aio-sk-lib-telemetry/source/types.ts#L188)

The context for the current operation.

## Properties

### contextCarrier

```ts
contextCarrier: Record<string, string>;
```

Defined in: [types.ts:202](https://github.com/adobe/commerce-integration-starter-kit/blob/10ddba8a9c7717ad0f94121f8c82f9de10856848/packages/aio-sk-lib-telemetry/source/types.ts#L202)

Holds a carrier that can be used to propagate the active context.

---

### currentSpan

```ts
currentSpan: Span;
```

Defined in: [types.ts:199](https://github.com/adobe/commerce-integration-starter-kit/blob/10ddba8a9c7717ad0f94121f8c82f9de10856848/packages/aio-sk-lib-telemetry/source/types.ts#L199)

The span of the current operation.

---

### logger

```ts
logger: AioLogger;
```

Defined in: [types.ts:196](https://github.com/adobe/commerce-integration-starter-kit/blob/10ddba8a9c7717ad0f94121f8c82f9de10856848/packages/aio-sk-lib-telemetry/source/types.ts#L196)

The logger for the current operation.

---

### meter

```ts
meter: Meter;
```

Defined in: [types.ts:193](https://github.com/adobe/commerce-integration-starter-kit/blob/10ddba8a9c7717ad0f94121f8c82f9de10856848/packages/aio-sk-lib-telemetry/source/types.ts#L193)

The meter used to create the metrics.

---

### tracer

```ts
tracer: Tracer;
```

Defined in: [types.ts:190](https://github.com/adobe/commerce-integration-starter-kit/blob/10ddba8a9c7717ad0f94121f8c82f9de10856848/packages/aio-sk-lib-telemetry/source/types.ts#L190)

The tracer used to create the spans.
