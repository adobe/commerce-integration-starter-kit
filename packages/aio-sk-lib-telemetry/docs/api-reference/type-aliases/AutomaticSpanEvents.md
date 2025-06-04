# `AutomaticSpanEvents`

```ts
type AutomaticSpanEvents = "success" | "error" | "parameters";
```

Defined in: [types.ts:85](https://github.com/adobe/commerce-integration-starter-kit/blob/96134280d686a55b5d5697e994fb1c049a995efa/packages/aio-sk-lib-telemetry/source/types.ts#L85)

Defines a set of events that can automatically be attached to an span.

- `success`: Adds an event if the instrumented function succeeds, with the result as the payload.
- `error`: Adds an event if the instrumented function fails, with the error as the payload.
- `parameters`: Adds an event with the parameters received by the instrumented function.
