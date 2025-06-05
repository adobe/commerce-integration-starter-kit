# `getActiveSpan()`

```ts
function getActiveSpan(ctx: Context): Span;
```

Defined in: [api/global.ts:26](https://github.com/adobe/commerce-integration-starter-kit/blob/dc8e8d16862bde414fa630722c6f5b2fafb02d6d/packages/aio-sk-lib-telemetry/source/api/global.ts#L26)

Gets the active span from the given context.

## Parameters

| Parameter | Type      | Description                       |
| --------- | --------- | --------------------------------- |
| `ctx`     | `Context` | The context to get the span from. |

## Returns

`Span`

## Throws

An error if no span is found.

## Example

```ts
const span = getActiveSpan();
span.addEvent("my-event", { foo: "bar" });
```
