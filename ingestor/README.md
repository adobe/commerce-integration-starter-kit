# Integrate Adobe Commerce product-created event with a third party.
This runtime action is responsible for exposing a web entry point to external backoffice application for publishing information to IO events.


**To activate this feature**, remove the comment '#' from the line `#$include: ./ingestor/actions.config.yaml` in the file `app.config.yaml`.

![Alt text](BackofficeEventsIngestionWebhook.png "Title")

# Incoming information
The ingestion webhook supports bulk operations. data parameters hold the array of events to publish, each event must include entity, event, and value. value parameter holds the data to send through the event.
- The entities available are: [product, customer, customer-group, order, shipment, stock]
- The list of available events by entity are:
```json
{
  "product": [
      "be-observer.catalog_product_create",
      "be-observer.catalog_product_update",
      "be-observer.catalog_product_delete"
  ],
  "customer": [
      "be-observer.customer_create",
      "be-observer.customer_update",
      "be-observer.customer_delete"
  ],
  "customer-group": [
      "be-observer.customer_group_create",
      "be-observer.customer_group_update",
      "be-observer.customer_group_delete"
    ],
  "order": [
      "be-observer.order_status_change"
  ],
  "stock": [
      "be-observer.catalog_stock_update"
  ],
  "shipment": [
      "be-observer.order_shipment_create",
      "be-observer.order_shipment_update"
  ]
}

```

Here is webhook JSON sample information:
```json
{
  "data": [
    {
      "entity": "product",
      "event": "be-observer.catalog_product_create",
      "value": {
        "sku": "TEST_WEBHOOK_2",
        "name": "Test webhook 1 testu",
        "price": 52,
        "description": "Test webhook 1 description"
      }
    },
    {
      "entity": "product",
      "event": "be-observer.catalog_product_update",
      "value": {
        "sku": "POSTBUSTER_TEST",
        "name": "Test webhook 1 updated 3",
        "price": 52,
        "description": "Test webhook 3 updated description"
      }
    }
  ]
}
```

## Authentication
The webhook is not authenticated by default, you must implement your authentication check on the file `ingestor/auth.js` method checkAuthentication(params).

## Use extra env parameters
Any need for parameters from environment could be accessed from `params`. Add the needed parameter in the `actions/ingestor/consumer/actions.config.yaml` under `consumer -> inputs` as follows:
```yaml
consumer:
  function: ./consumer/index.js
  web: 'no'
  runtime: nodejs:16
  inputs:
    LOG_LEVEL: debug
    OAUTH_ORG_ID: $OAUTH_ORG_ID
    OAUTH_CLIENT_ID: $OAUTH_CLIENT_ID
    OAUTH_CLIENT_SECRET: $OAUTH_CLIENT_SECRET
    OAUTH_TECHNICAL_ACCOUNT_ID: $OAUTH_TECHNICAL_ACCOUNT_ID
    OAUTH_TECHNICAL_ACCOUNT_EMAIL: $OAUTH_TECHNICAL_ACCOUNT_EMAIL
    IO_MANAGEMENT_BASE_URL: $IO_MANAGEMENT_BASE_URL
    IO_CONSUMER_ID: $IO_CONSUMER_ID
    IO_PROJECT_ID: $IO_PROJECT_ID
    IO_WORKSPACE_ID: $IO_WORKSPACE_ID
    AIO_runtime_namespace: $AIO_runtime_namespace
    
    HERE_YOUR_PARAM: $HERE_YOUR_PARAM_ENV
    
  annotations:
    require-adobe-auth: false
    final: true
```

# Response expected
the runtime action returns the following response in case of error:
```javascript
return {
  error: {
    statusCode: '5XX or 4XX',
    body: {
      error: 'Error message'
    }
  }
}

```
In case that everything is fine, it returns 200 status code, success status, request data and events sent
```javascript
return {
  statusCode: 200,
  body: {
    request: {},
    response: {
      success: true,
      events: []
    }
  }
}
```
