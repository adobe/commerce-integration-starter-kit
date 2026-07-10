## Integrate Adobe Commerce customer group updated event with a third party

This runtime action is responsible for notifying the integration with the 3rd party after a customer group is updated in Adobe Commerce.

![Alt text](CommerceCustomerGroupUpdateSync.png "Title")

# Incoming event payload

The incoming event payload depends on the fields specified during the event registration in Adobe Commerce. For more information, please check it here: https://developer.adobe.com/commerce/extensibility/events/configure-commerce/#subscribe-and-register-events.
Here is a payload example of the data received in the event:

```json
{
  "customer_group_id": 6,
  "customer_group_code": "Group name code",
  "tax_class_id": 4,
  "tax_class_name": "Tax class name",
  "extension_attributes": {
    "exclude_website_ids": []
  }
}
```

There is other interesting information that you can access from `params`, like the event type and event ID.

## Connect with the 3rd party

The `sendData` function in the `sender.js` file defines the connection with the third party.
Please include all the authentication and connection login on that `sender.js` file or an extracted file outside `index.js`.
Any values from the environment could be accessed from `params`. Pass the required parameters by the action by configuring them in the `actions/customer/commerce/actions.config.yaml` under `group-updated -> inputs` as follows:

```yaml
group-updated:
  function: commerce/updated/index.js
  web: "no"
  runtime: nodejs:22
  inputs:
    LOG_LEVEL: debug
    HERE_YOUR_PARAM: $HERE_YOUR_PARAM_ENV
  annotations:
    require-adobe-auth: true
    final: true
```
