# `getActiveSpan()`

```ts
function getActiveSpan(ctx: Context): Span;
```

Defined in: [api/global.ts:26](https://github.com/adobe/commerce-integration-starter-kit/blob/b6f5b383edc83f7aedbb27a8160882f8ad6b4ea9/packages/aio-sk-lib-telemetry/source/api/global.ts#L26)

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
