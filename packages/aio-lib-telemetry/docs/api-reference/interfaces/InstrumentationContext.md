# `InstrumentationContext`

Defined in: [types.ts:166](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L166)

The context for the current operation.

## Properties

### contextCarrier

```ts
contextCarrier: Record<string, string>;
```

Defined in: [types.ts:180](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L180)

Holds a carrier that can be used to propagate the active context.

---

### currentSpan

```ts
currentSpan: Span;
```

Defined in: [types.ts:177](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L177)

The span of the current operation.

---

### logger

```ts
logger: AioLogger;
```

Defined in: [types.ts:174](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L174)

The logger for the current operation.

---

### meter

```ts
meter: Meter;
```

Defined in: [types.ts:171](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L171)

The meter used to create the metrics.

---

### tracer

```ts
tracer: Tracer;
```

Defined in: [types.ts:168](https://github.com/adobe/commerce-integration-starter-kit/blob/d46a74bab8354601aa6e2e47719b09780c913f3a/packages/aio-lib-telemetry/source/types.ts#L168)

The tracer used to create the spans.
