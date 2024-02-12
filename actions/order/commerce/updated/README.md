## Integrate Adobe Commerce order-updated event with a third party
This runtime action is responsible for notifying the integration with the external back-office application after an order is updated in Adobe Commerce.

![Alt text](CommerceOrderUpdateSync.png "Title")

# Input information
The incoming depends on the fields specified during the event registration in Adobe Commerce. For more information, please check it here: https://developer.adobe.com/commerce/extensibility/events/configure-commerce/#subscribe-and-register-events
For this runtime action, the required fields are `created_at` and `udpated_at`.
Here is a payload example of the data received in the event:
```json
{
  "real_order_id": "ORDER_ID",
  "increment_id": "ORRDER_INCREMENTAL_ID",
  "items": [
    {
      "item_id": "ITEM_ID"
    }
  ],
  "created_at": "2000-01-01",
  "updated_at": "2000-01-01"
}
```
There is other interesting information that you can access in params, like the event code triggered by Commerce and event ID.

## Payload transformation
Please proceed with any data transformation required for the information required format in the external back-office application in the extension module.
That transformation is defined in the `transformData` function in the `transformer.js` file.

## Preprocess data
Any preprocessing needed before calling the external backoffice application API can be implemented in the `preProcess` function in the `pre.js` file.

## Connect with the external back-office application
The connection with the third party is defined in the `sendData` function in the `sender.js` file.
Please include all the authentication and connection login on that `sender.js` file or an extracted file outside index.js.
Any need for parameters from the environment could be accessed from `params`. Add the needed parameter in the `actions/order/commerce/actions.config.yaml` under `updated -> inputs` as follows:
```yaml
updated:
  function: commerce/updated/index.js
  web: 'no'
  runtime: nodejs:16
  inputs:
    LOG_LEVEL: debug
    HERE_YOUR_PARAM: $HERE_YOUR_PARAM_ENV
  annotations:
    require-adobe-auth: true
    final: true
```

## Postprocess data
Any postprocessing needed after calling the external backoffice application API can be implemented in the `postProcess` function in the `post.js` file.

# Response expected
That runtime action must respond to 500 in case of an error with the external back-office application integration.
```javascript
return {
    statusCode: 500,
    error: 'error'
}

```
If everything is fine, return 200 to mark the event completed in Adobe I/O and close the loop.
```javascript
return {
  statusCode: 200
}
```

