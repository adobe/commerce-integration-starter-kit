# `getAioRuntimeResource()`

```ts
function getAioRuntimeResource(): Resource;
```

Defined in: [api/attributes.ts:41](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/api/attributes.ts#L41)

Creates a resource from the attributes inferred from the Adobe I/O Runtime,
and returns it as an OpenTelemetry Resource object.

## Returns

`Resource`

## See

https://opentelemetry.io/docs/languages/js/resources/

## Example

```ts
const resource = getAioRuntimeResource();
// use this resource in your OpenTelemetry configuration
```
