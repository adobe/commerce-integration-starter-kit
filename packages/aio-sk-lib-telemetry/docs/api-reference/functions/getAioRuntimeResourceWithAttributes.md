# `getAioRuntimeResourceWithAttributes()`

```ts
function getAioRuntimeResourceWithAttributes(
  attributes: Record<string, string>,
): Resource;
```

Defined in: [api/attributes.ts:30](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/api/attributes.ts#L30)

Combines the attributes inferred from the Adobe I/O Runtime with the provided attributes.

## Parameters

| Parameter    | Type                           | Description                                                                        |
| ------------ | ------------------------------ | ---------------------------------------------------------------------------------- |
| `attributes` | `Record`\<`string`, `string`\> | The attributes to combine with the attributes inferred from the Adobe I/O Runtime. |

## Returns

`Resource`
