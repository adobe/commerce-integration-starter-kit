# `AutomaticSpanEvents`

```ts
type AutomaticSpanEvents = "success" | "error" | "parameters";
```

Defined in: [types.ts:84](https://github.com/adobe/commerce-integration-starter-kit/blob/86a7b96f6f56ae964aa8997541d4360d7dfdd7b9/packages/aio-sk-lib-telemetry/source/types.ts#L84)

Defines a set of events that can automatically be attached to a span.

- `success`: Adds an event if the instrumented function succeeds, with the result as the payload.
- `error`: Adds an event if the instrumented function fails, with the error as the payload.
- `parameters`: Adds an event with the parameters received by the instrumented function.
