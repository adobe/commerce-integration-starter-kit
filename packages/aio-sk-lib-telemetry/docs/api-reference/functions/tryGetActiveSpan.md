# `tryGetActiveSpan()`

```ts
function tryGetActiveSpan(ctx: Context): null | Span;
```

Defined in: [api/global.ts:47](https://github.com/adobe/commerce-integration-starter-kit/blob/dc8e8d16862bde414fa630722c6f5b2fafb02d6d/packages/aio-sk-lib-telemetry/source/api/global.ts#L47)

Tries to get the active span from the given context.

## Parameters

| Parameter | Type      | Description                       |
| --------- | --------- | --------------------------------- |
| `ctx`     | `Context` | The context to get the span from. |

## Returns

`null` \| `Span`

## Example

```ts
const span = tryGetActiveSpan();
if (span) {
  span.addEvent("my-event", { foo: "bar" });
}
```
