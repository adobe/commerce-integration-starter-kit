# `addEventToActiveSpan()`

```ts
function addEventToActiveSpan(event: string, attributes?: Attributes): void;
```

Defined in: [api/global.ts:66](https://github.com/adobe/commerce-integration-starter-kit/blob/2915f6bdb41468caa52722d4a2ef6495006c03bd/packages/aio-lib-telemetry/source/api/global.ts#L66)

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
