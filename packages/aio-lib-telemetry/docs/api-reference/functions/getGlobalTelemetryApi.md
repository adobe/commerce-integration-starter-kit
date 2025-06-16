# `getGlobalTelemetryApi()`

```ts
function getGlobalTelemetryApi(): TelemetryApi;
```

Defined in: core/telemetry-api.ts:32

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
