# `getGlobalTelemetryApi()`

```ts
function getGlobalTelemetryApi(): TelemetryApi;
```

Defined in: [core/telemetry-api.ts:32](https://github.com/adobe/commerce-integration-starter-kit/blob/0491355cd9c4d5daa558197e4e07bc6e025afd47/packages/aio-lib-telemetry/source/core/telemetry-api.ts#L32)

Gets the global telemetry API.

## Returns

[`TelemetryApi`](../interfaces/TelemetryApi.md)

## Throws

If the telemetry API is not initialized.

## Example

```ts
function someNonAutoInstrumentedFunction() {
  const { tracer } = getGlobalTelemetryApi();
  return tracer.startActiveSpan("some-span", (span) => {
    // ...
  });
}
```
