# `getAioRuntimeResourceWithAttributes()`

```ts
function getAioRuntimeResourceWithAttributes(
  attributes: Record<string, string>,
): Resource;
```

Defined in: [api/attributes.ts:58](https://github.com/adobe/commerce-integration-starter-kit/blob/6d4d9f7c629d2abc0e81fce4567de926c2bddb60/packages/aio-lib-telemetry/source/api/attributes.ts#L58)

Creates a [resource](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.resources.Resource.html)
that combines the attributes inferred from the Adobe I/O Runtime with the provided attributes.

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
