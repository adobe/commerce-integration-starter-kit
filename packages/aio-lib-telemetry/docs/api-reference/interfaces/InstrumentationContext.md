# `InstrumentationContext`

Defined in: types.ts:185

The context for the current operation.

## Properties

### contextCarrier

```ts
contextCarrier: Record<string, string>;
```

Defined in: types.ts:199

Holds a carrier that can be used to propagate the active context.

---

### currentSpan

```ts
currentSpan: Span;
```

Defined in: types.ts:196

The span of the current operation.

---

### logger

```ts
logger: AioLogger;
```

Defined in: types.ts:193

The logger for the current operation.

---

### meter

```ts
meter: Meter;
```

Defined in: types.ts:190

The meter used to create the metrics.

---

### tracer

```ts
tracer: Tracer;
```

Defined in: types.ts:187

The tracer used to create the spans.
