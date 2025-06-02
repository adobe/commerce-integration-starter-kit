# `InstrumentationContext`

Defined in: [types.ts:187](https://github.com/adobe/commerce-integration-starter-kit/blob/b6f5b383edc83f7aedbb27a8160882f8ad6b4ea9/packages/aio-sk-lib-telemetry/source/types.ts#L187)

The context for the current operation.

## Properties

### contextCarrier

```ts
contextCarrier: Record<string, string>;
```

Defined in: [types.ts:201](https://github.com/adobe/commerce-integration-starter-kit/blob/b6f5b383edc83f7aedbb27a8160882f8ad6b4ea9/packages/aio-sk-lib-telemetry/source/types.ts#L201)

Holds a carrier that can be used to propagate the active context.

---

### currentSpan

```ts
currentSpan: Span;
```

Defined in: [types.ts:198](https://github.com/adobe/commerce-integration-starter-kit/blob/b6f5b383edc83f7aedbb27a8160882f8ad6b4ea9/packages/aio-sk-lib-telemetry/source/types.ts#L198)

The span of the current operation.

---

### logger

```ts
logger: AioLogger;
```

Defined in: [types.ts:195](https://github.com/adobe/commerce-integration-starter-kit/blob/b6f5b383edc83f7aedbb27a8160882f8ad6b4ea9/packages/aio-sk-lib-telemetry/source/types.ts#L195)

The logger for the current operation.

---

### meter

```ts
meter: Meter;
```

Defined in: [types.ts:192](https://github.com/adobe/commerce-integration-starter-kit/blob/b6f5b383edc83f7aedbb27a8160882f8ad6b4ea9/packages/aio-sk-lib-telemetry/source/types.ts#L192)

The meter used to create the metrics.

---

### tracer

```ts
tracer: Tracer;
```

Defined in: [types.ts:189](https://github.com/adobe/commerce-integration-starter-kit/blob/b6f5b383edc83f7aedbb27a8160882f8ad6b4ea9/packages/aio-sk-lib-telemetry/source/types.ts#L189)

The tracer used to create the spans.
