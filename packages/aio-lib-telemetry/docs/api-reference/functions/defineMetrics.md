# `defineMetrics()`

```ts
function defineMetrics<T>(createMetrics: (meter: Meter) => T): T;
```

Defined in: [core/config.ts:44](https://github.com/adobe/commerce-integration-starter-kit/blob/ee21c0d99f4f907fa0cc3bc14f4f86e941a1c9f2/packages/aio-lib-telemetry/source/core/config.ts#L44)

Helper to define a record of metrics.

## Type Parameters

| Type Parameter                                    |
| ------------------------------------------------- |
| `T` _extends_ `Record`\<`string`, `MetricTypes`\> |

## Parameters

| Parameter       | Type                      | Description                                                               |
| --------------- | ------------------------- | ------------------------------------------------------------------------- |
| `createMetrics` | (`meter`: `Meter`) => `T` | A function that receives a meter which can be used to create the metrics. |

## Returns

`T`

## See

https://opentelemetry.io/docs/concepts/signals/metrics/

## Example

```ts
const metrics = defineMetrics((meter) => {
  return {
    myMetric: meter.createCounter("my-metric", { description: "My metric" }),
  };
});
```
