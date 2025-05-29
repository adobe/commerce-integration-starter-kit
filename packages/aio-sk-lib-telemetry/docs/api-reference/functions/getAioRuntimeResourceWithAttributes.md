# `getAioRuntimeResourceWithAttributes()`

```ts
function getAioRuntimeResourceWithAttributes(
  attributes: Record<string, string>,
): Resource;
```

Defined in: [api/attributes.ts:57](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/api/attributes.ts#L57)

Combines the attributes inferred from the Adobe I/O Runtime with the provided attributes.

## Parameters

| Parameter    | Type                           | Description                                                                        |
| ------------ | ------------------------------ | ---------------------------------------------------------------------------------- |
| `attributes` | `Record`\<`string`, `string`\> | The attributes to combine with the attributes inferred from the Adobe I/O Runtime. |

## Returns

`Resource`

## See

https://opentelemetry.io/docs/languages/js/resources/

## Example

```ts
const resource = getAioRuntimeResourceWithAttributes({ foo: "bar" });
// resource = { action.namespace: "my-namespace", action.name: "my-action", foo: "bar", ... }
// use this resource in your OpenTelemetry configuration
```
