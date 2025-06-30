# `getActiveSpan()`

```ts
function getActiveSpan(ctx: Context): Span;
```

Defined in: [api/global.ts:26](https://github.com/adobe/commerce-integration-starter-kit/blob/6d4d9f7c629d2abc0e81fce4567de926c2bddb60/packages/aio-lib-telemetry/source/api/global.ts#L26)

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
