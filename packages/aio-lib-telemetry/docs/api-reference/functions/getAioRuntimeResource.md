# `getAioRuntimeResource()`

```ts
function getAioRuntimeResource(): Resource;
```

Defined in: [api/attributes.ts:41](https://github.com/adobe/commerce-integration-starter-kit/blob/ee21c0d99f4f907fa0cc3bc14f4f86e941a1c9f2/packages/aio-lib-telemetry/source/api/attributes.ts#L41)

Creates a [resource](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_sdk-node.resources.Resource.html)
from the attributes inferred from the Adobe I/O Runtime and returns it as an OpenTelemetry Resource object.

## Returns

`Resource`

## See

https://opentelemetry.io/docs/languages/js/resources/

## Example

```ts
const resource = getAioRuntimeResource();
// use this resource in your OpenTelemetry configuration
```
