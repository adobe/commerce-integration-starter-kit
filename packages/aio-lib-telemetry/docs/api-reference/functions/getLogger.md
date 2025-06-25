# `getLogger()`

```ts
function getLogger(name: string, config?: AioLoggerConfig): AioLogger;
```

Defined in: [core/logging.ts:81](https://github.com/adobe/commerce-integration-starter-kit/blob/6d4d9f7c629d2abc0e81fce4567de926c2bddb60/packages/aio-lib-telemetry/source/core/logging.ts#L81)

Get a logger instance.

## Parameters

| Parameter | Type              | Description                      |
| --------- | ----------------- | -------------------------------- |
| `name`    | `string`          | The name of the logger           |
| `config?` | `AioLoggerConfig` | The configuration for the logger |

## Returns

`AioLogger`

## Example

```ts
const logger = getLogger("my-logger", { level: "debug" });
logger.debug("Hello, world!");
```
