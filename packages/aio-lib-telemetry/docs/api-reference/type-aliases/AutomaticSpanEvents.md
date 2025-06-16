# `AutomaticSpanEvents`

```ts
type AutomaticSpanEvents = "success" | "error" | "parameters";
```

Defined in: types.ts:84

Defines a set of events that can automatically be attached to a span.

- `success`: Adds an event if the instrumented function succeeds, with the result as the payload.
- `error`: Adds an event if the instrumented function fails, with the error as the payload.
- `parameters`: Adds an event with the parameters received by the instrumented function.
