# `addEventToActiveSpan()`

```ts
function addEventToActiveSpan(event: string, attributes?: Attributes): void;
```

Defined in: [api/global.ts:66](https://github.com/adobe/commerce-integration-starter-kit/blob/d331e59f0d2bdbb84c234c4a5a46f01bc1fa0c09/packages/aio-lib-telemetry/source/api/global.ts#L66)

Adds an event to the given span.

## Parameters

| Parameter     | Type         | Description                         |
| ------------- | ------------ | ----------------------------------- |
| `event`       | `string`     | The event name to add.              |
| `attributes?` | `Attributes` | The attributes to add to the event. |

## Returns

`void`

## Example

```ts
addEventToActiveSpan("my-event", { foo: "bar" });
```
