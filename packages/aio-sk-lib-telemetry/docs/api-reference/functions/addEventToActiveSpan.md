# `addEventToActiveSpan()`

```ts
function addEventToActiveSpan(event: string, attributes?: Attributes): void;
```

Defined in: [api/global.ts:66](https://github.com/adobe/commerce-integration-starter-kit/blob/d616b93af2f8c2e2024d489ade1c7b27c609acd4/packages/aio-sk-lib-telemetry/source/api/global.ts#L66)

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
