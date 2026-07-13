# Integrate a third-party customer group created event with Adobe Commerce.

This runtime action is responsible for notifying the integration with Adobe Commerce after a customer is created in the 3rd party.

![Alt text](ExternalCustomerGroupCreateSync.png "Title")

# Incoming event payload

The incoming event payload depends on the third party API and entity model.
Here is a payload example of the data received in the event:

```json
{
  "name": "A Group Name",
  "taxClassId": 25
}
```

# Data validation

The incoming data is validated against a JSON schema defined in the `schema.json` file.
Here's an example:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "taxClassId": { "type": "number" }
  },
  "required": ["name", "taxClassId"],
  "additionalProperties": true
}
```

## Interact with the Adobe Commerce API

The `sendData` function in the `sender.js` file defines the interaction with the Adobe Commerce API.
This function delegates to the `createCustomerGroup` method in the `src/commerce-extensibility-1/actions/customer/commerce-customer-group-api-client.js` interaction with the Commerce API.
Any parameters needed from the execution environment could be accessed from `params`.
These parameters can be passed on the action by configuring them in the `src/commerce-extensibility-1/actions/customer/external/actions.config.yaml` under `group-created -> inputs` as follows:

```yaml
group-created:
  function: group/created/index.js
  web: "no"
  runtime: nodejs:24
  inputs:
    LOG_LEVEL: $LOG_LEVEL
    AIO_COMMERCE_AUTH_IMS_CLIENT_ID: $AIO_COMMERCE_AUTH_IMS_CLIENT_ID
    AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS: $AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS
    AIO_COMMERCE_AUTH_IMS_TECHNICAL_ACCOUNT_ID: $AIO_COMMERCE_AUTH_IMS_TECHNICAL_ACCOUNT_ID
    AIO_COMMERCE_AUTH_IMS_TECHNICAL_ACCOUNT_EMAIL: $AIO_COMMERCE_AUTH_IMS_TECHNICAL_ACCOUNT_EMAIL
    AIO_COMMERCE_AUTH_IMS_ORG_ID: $AIO_COMMERCE_AUTH_IMS_ORG_ID
    AIO_COMMERCE_AUTH_IMS_SCOPES: $AIO_COMMERCE_AUTH_IMS_SCOPES
  annotations:
    final: true
```
