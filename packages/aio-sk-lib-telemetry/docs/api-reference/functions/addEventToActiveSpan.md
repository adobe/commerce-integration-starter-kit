# `addEventToActiveSpan()`

```ts
function addEventToActiveSpan(event: string, attributes?: Attributes): void;
```

Defined in: [api/global.ts:47](https://github.com/adobe/commerce-integration-starter-kit/blob/fe75c4bc3a72d4e1427ca0ca82f37e4da289ae29/packages/aio-sk-lib-telemetry/source/api/global.ts#L47)

Adds an event to the given span.

## Parameters

| Parameter     | Type         | Description                         |
| ------------- | ------------ | ----------------------------------- |
| `event`       | `string`     | The event name to add.              |
| `attributes?` | `Attributes` | The attributes to add to the event. |

## Returns

`void`
