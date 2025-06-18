# `InstrumentationContext`

Defined in: [types.ts:175](https://github.com/adobe/commerce-integration-starter-kit/blob/0491355cd9c4d5daa558197e4e07bc6e025afd47/packages/aio-lib-telemetry/source/types.ts#L175)

The context for the current operation.

## Properties

### contextCarrier

```ts
contextCarrier: Record<string, string>;
```

Defined in: [types.ts:189](https://github.com/adobe/commerce-integration-starter-kit/blob/0491355cd9c4d5daa558197e4e07bc6e025afd47/packages/aio-lib-telemetry/source/types.ts#L189)

Holds a carrier that can be used to propagate the active context.

---

### currentSpan

```ts
currentSpan: Span;
```

Defined in: [types.ts:186](https://github.com/adobe/commerce-integration-starter-kit/blob/0491355cd9c4d5daa558197e4e07bc6e025afd47/packages/aio-lib-telemetry/source/types.ts#L186)

The span of the current operation.

---

### logger

```ts
logger: AioLogger;
```

Defined in: [types.ts:183](https://github.com/adobe/commerce-integration-starter-kit/blob/0491355cd9c4d5daa558197e4e07bc6e025afd47/packages/aio-lib-telemetry/source/types.ts#L183)

The logger for the current operation.

---

### meter

```ts
meter: Meter;
```

Defined in: [types.ts:180](https://github.com/adobe/commerce-integration-starter-kit/blob/0491355cd9c4d5daa558197e4e07bc6e025afd47/packages/aio-lib-telemetry/source/types.ts#L180)

The global (managed by the library) meter instance used to create metrics.

---

### tracer

```ts
tracer: Tracer;
```

Defined in: [types.ts:177](https://github.com/adobe/commerce-integration-starter-kit/blob/0491355cd9c4d5daa558197e4e07bc6e025afd47/packages/aio-lib-telemetry/source/types.ts#L177)

The global (managed by the library) tracer instance used to create spans.
