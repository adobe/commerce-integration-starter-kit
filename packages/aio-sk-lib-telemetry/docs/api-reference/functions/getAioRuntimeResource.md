# `getAioRuntimeResource()`

```ts
function getAioRuntimeResource(): Resource;
```

Defined in: [api/attributes.ts:41](https://github.com/adobe/commerce-integration-starter-kit/blob/dc8e8d16862bde414fa630722c6f5b2fafb02d6d/packages/aio-sk-lib-telemetry/source/api/attributes.ts#L41)

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
