# Integrate a third-party stock updated event with Adobe Commerce.
This runtime action is responsible for notifying the integration with Adobe Commerce after a customer is updated in the 3rd party.

![Alt text](ExternalStockUpdateSync.png "Title")

# Incoming information
The incoming data depends on the third party API and entity model.
Here is a JSON sample:
```json
{
  "sourceItems": [
    {
      "sku": "sku-one",
      "source": "source-one",
      "quantity": 0,
      "outOfStock": true
    },
    {
      "sku": "sku-two",
      "source": "source-two",
      "quantity": 66,
      "outOfStock": false
    }
  ]
}
```

# Data validation
The incoming data is validated against a JSON schema defined in the `schema.json` file.
Here's an example:
```json
{
  "type": "array",
  "items": {
    "properties": {
      "sku": { "type": "string" },
      "source": { "type": "string" },
      "quantity": { "type":  "number" },
      "outOfStock": { "type": "boolean" }
    },
    "required": [ "sku", "source", "quantity", "outOfStock" ],
    "additionalProperties": true
  }
}
```

## Payload transformation
Please proceed with any data transformation needed to adapt the incoming message to the Adobe Commerce API payload.
That transformation is defined in the `transformData` function in the `transformer.js` file.

## Preprocess data
Any preprocessing needed before calling the Adobe Commerce API can be implemented in the `preProcess` function in the `pre.js` file.

## Interact with the Adobe Commerce API
The interaction with the Adobe Commerce API is defined in the `sendData` function in the `sender.js` file.
This function delegates to the `updateStock` method in the `actions/stock/commerceStockApiClient.js` the interaction with the Commerce API.
Any parameters needed from the execution environment could be access from `params`. 
These parameters can be passed on the action by configuring them in the  `actions/stock/external/actions.config.yaml` under `updated -> inputs` as follows:
```yaml
updated:
  function: updated/index.js
  web: 'no'
  runtime: nodejs:16
  inputs:
    LOG_LEVEL: debug
    COMMERCE_BASE_URL: $COMMERCE_BASE_URL
    COMMERCE_CONSUMER_KEY: $COMMERCE_CONSUMER_KEY
    COMMERCE_CONSUMER_SECRET: $COMMERCE_CONSUMER_SECRET
    COMMERCE_ACCESS_TOKEN: $COMMERCE_ACCESS_TOKEN
    COMMERCE_ACCESS_TOKEN_SECRET: $COMMERCE_ACCESS_TOKEN_SECRET
  annotations:
    require-adobe-auth: true
    final: true
```

## Postprocess data
Any postprocessing needed after calling the Adobe Commerce API can be implemented in the `postProcess` function in the `post.js` file.

# Response expected
The runtime action must respond 400 if the validation fails. It will prevent the message processing from being retried by Adobe I/O.
```javascript
return {
    statusCode: 400,
    error: errors
}
```

The runtime action must respond 500 in case of an unexpected error while processing the request. Please send an array of errors so the consumer can log it and trigger the retry mechanism.
```javascript
return {
    statusCode: 500,
    error: errors
}
```

In case that everything is fine, return 200 to mark the event completed in Adobe I/O and close the loop.
```javascript
return {
    statusCode: 200
}
```

## Notes on this runtime action sample code
The code that synchronizes stock updates between a 3rd party system and Adobe Commerce implemented by this runtime action
uses the Adobe Commerce [inventory/source-items](https://adobe-commerce.redoc.ly/2.4.6-admin/tag/inventorysource-items/#operation/PostV1InventorySourceitems) REST endpoint to process the stock updates.

It is included in this starter-kit as a sample implementation and depending on the integration's nonfunctional requirements, it may have the following limitations.

### Payload above the limit enforced by Adobe I/O Runtime
The maximum `payload` size is documented in [Adobe I/O Runtime - System Settings](https://developer.adobe.com/runtime/docs/guides/using/system_settings/)
and it is not configurable. If an event carries a payload above the limit, e.g., when dealing with a full stock synchronization event, it will cause and error.

To prevent this situation, we recommend changing the code on the 3rd party system to generate event payloads within the `payload` limits.

### Timeouts during the event processing
The execution time range for a runtime action before causing a `timeout` response is documented in [Adobe I/O Runtime - System Settings](https://developer.adobe.com/runtime/docs/guides/using/system_settings/).
Note that the maximum execution time for a runtime action is different for `blocking` and `non-blocking` calls, with the limit being higher for the latest.

The timeout in a runtime action execution can be dealt with in two different ways, depending on what is causing it:

- if the timeout is caused by a slow/busy Adobe Commerce REST API call, one plausible solution could be to use the `async` endpoint. 
This approach will cause the Commerce API to respond quicker because the data processing is done asynchronously.
You can find additional details on the `async` endpoints in [Asynchronous web endpoints](https://developer.adobe.com/commerce/webapi/rest/use-rest/asynchronous-web-endpoints/).

- if the timeout is caused by a long-running runtime action, e.g., because it interacts with multiple APIs sequentially and the total processing goes over the limit, the recommendation is to use the [journaling approach](https://developer.adobe.com/app-builder/docs/resources/journaling-events/) for consuming events. 
