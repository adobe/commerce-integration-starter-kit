# `tryGetActiveSpan()`

```ts
function tryGetActiveSpan(ctx: Context): null | Span;
```

Defined in: [api/global.ts:33](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/api/global.ts#L33)

Tries to get the active span from the given context.

## Parameters

| Parameter | Type      | Description                       |
| --------- | --------- | --------------------------------- |
| `ctx`     | `Context` | The context to get the span from. |

## Returns

`null` \| `Span`
