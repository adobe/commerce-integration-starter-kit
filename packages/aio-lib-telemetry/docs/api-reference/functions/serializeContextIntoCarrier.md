# `serializeContextIntoCarrier()`

```ts
function serializeContextIntoCarrier<Carrier>(
  carrier?: Carrier,
  ctx?: Context,
): Carrier;
```

Defined in: [api/propagation.ts:34](https://github.com/adobe/commerce-integration-starter-kit/blob/6d4d9f7c629d2abc0e81fce4567de926c2bddb60/packages/aio-lib-telemetry/source/api/propagation.ts#L34)

Serializes the current context into a carrier.

## Type Parameters

| Type Parameter                                     |
| -------------------------------------------------- |
| `Carrier` _extends_ `Record`\<`string`, `string`\> |

## Parameters

| Parameter  | Type      | Description                                               |
| ---------- | --------- | --------------------------------------------------------- |
| `carrier?` | `Carrier` | The carrier object to inject the context into.            |
| `ctx?`     | `Context` | The context to serialize. Defaults to the active context. |

## Returns

`Carrier`

## Examples

```ts
const carrier = serializeContextIntoCarrier();
// carrier is now a record with the context data
```

```ts
const myCarrier = { more: "data" };
const carrier = serializeContextIntoCarrier(myCarrier);
// carrier now contains both the existing data and the context data
// carrier = { more: 'data', ...contextData }
```
