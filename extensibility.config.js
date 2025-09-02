require("dotenv").config();
const eventTemplates = require("./scripts/onboarding/event-templates.js");

const BACKOFFICE_PROVIDER_ID = process.env.BACKOFFICE_PROVIDER_ID;
const COMMERCE_PROVIDER_ID = process.env.COMMERCE_PROVIDER_ID;

// Commerce event codes
const CATALOG_PRODUCT_DELETE_COMMIT_AFTER =
  "com.adobe.commerce.observer.catalog_product_delete_commit_after";
const CATALOG_PRODUCT_SAVE_COMMIT_AFTER =
  "com.adobe.commerce.observer.catalog_product_save_commit_after";
const CUSTOMER_SAVE_COMMIT_AFTER =
  "com.adobe.commerce.observer.customer_save_commit_after";
const CUSTOMER_DELETE_COMMIT_AFTER =
  "com.adobe.commerce.observer.customer_delete_commit_after";
const CUSTOMER_GROUP_SAVE_COMMIT_AFTER =
  "com.adobe.commerce.observer.customer_group_save_commit_after";
const CUSTOMER_GROUP_DELETE_COMMIT_AFTER =
  "com.adobe.commerce.observer.customer_group_delete_commit_after";
const SALES_ORDER_SAVE_COMMIT_AFTER =
  "com.adobe.commerce.observer.sales_order_save_commit_after";
const CATALOGINVENTORY_STOCK_ITEM_SAVE_COMMIT_AFTER =
  "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after";

// Backoffice event codes
const BE_CATALOG_PRODUCT_CREATE = "be-observer.catalog_product_create";
const BE_CATALOG_PRODUCT_UPDATE = "be-observer.catalog_product_update";
const BE_CATALOG_PRODUCT_DELETE = "be-observer.catalog_product_delete";
const BE_CUSTOMER_CREATE = "be-observer.customer_create";
const BE_CUSTOMER_UPDATE = "be-observer.customer_update";
const BE_CUSTOMER_DELETE = "be-observer.customer_delete";
const BE_CUSTOMER_GROUP_CREATE = "be-observer.customer_group_create";
const BE_CUSTOMER_GROUP_UPDATE = "be-observer.customer_group_update";
const BE_CUSTOMER_GROUP_DELETE = "be-observer.customer_group_delete";
const BE_SALES_ORDER_STATUS_UPDATE = "be-observer.sales_order_status_update";
const BE_SALES_ORDER_SHIPMENT_CREATE =
  "be-observer.sales_order_shipment_create";
const BE_SALES_ORDER_SHIPMENT_UPDATE =
  "be-observer.sales_order_shipment_update";
const BE_CATALOG_STOCK_UPDATE = "be-observer.catalog_stock_update";

// Subscription event names (using prefixCommerceEventName for consistency)
const SUBSCRIPTION_CATALOG_PRODUCT_DELETE =
  "observer.catalog_product_delete_commit_after";
const SUBSCRIPTION_CATALOG_PRODUCT_SAVE =
  "observer.catalog_product_save_commit_after";
const SUBSCRIPTION_CUSTOMER_SAVE = "observer.customer_save_commit_after";
const SUBSCRIPTION_CUSTOMER_DELETE = "observer.customer_delete_commit_after";
const SUBSCRIPTION_CUSTOMER_GROUP_SAVE =
  "observer.customer_group_save_commit_after";
const SUBSCRIPTION_CUSTOMER_GROUP_DELETE =
  "observer.customer_group_delete_commit_after";
const SUBSCRIPTION_SALES_ORDER_SAVE = "observer.sales_order_save_commit_after";
const SUBSCRIPTION_CATALOGINVENTORY_STOCK_ITEM_SAVE =
  "observer.cataloginventory_stock_item_save_commit_after";

module.exports = {
  app: {
    meta: {
      // Can be used by Admin UI SDK for `extension-manifest.json`.
      slug: "my-oope-app",
      version: "1.0.0",
      displayName: "My OOPE App",
      description: "My OOPE App Description",
    },
  },
  adminUi: {},
  eventing: {
    providers: [
      {
        id: BACKOFFICE_PROVIDER_ID,
        label: "Backoffice Provider",
        provider_metadata: "3rd_party_custom_events",
        description:
          "Backoffice Provider that will receive events from commerce",
        docs_url: null,
        events_metadata: [
          {
            event_code: BE_CATALOG_PRODUCT_CREATE,
            label: BE_CATALOG_PRODUCT_CREATE,
            description:
              "Event triggered when a product is created in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.catalog_product_create"],
          },
          {
            event_code: BE_CATALOG_PRODUCT_UPDATE,
            label: BE_CATALOG_PRODUCT_UPDATE,
            description:
              "Event triggered when a product is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.catalog_product_update"],
          },
          {
            event_code: BE_CATALOG_PRODUCT_DELETE,
            label: BE_CATALOG_PRODUCT_DELETE,
            description:
              "Event triggered when a product is deleted in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.catalog_product_delete"],
          },
          {
            event_code: BE_CUSTOMER_CREATE,
            label: BE_CUSTOMER_CREATE,
            description:
              "Event triggered when a customer is created in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_create"],
          },
          {
            event_code: BE_CUSTOMER_UPDATE,
            label: BE_CUSTOMER_UPDATE,
            description:
              "Event triggered when a customer is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_update"],
          },
          {
            event_code: BE_CUSTOMER_DELETE,
            label: BE_CUSTOMER_DELETE,
            description:
              "Event triggered when a customer is deleted in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_delete"],
          },
          {
            event_code: BE_CUSTOMER_GROUP_CREATE,
            label: BE_CUSTOMER_GROUP_CREATE,
            description:
              "Event triggered when a customer group is created in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_group_create"],
          },
          {
            event_code: BE_CUSTOMER_GROUP_UPDATE,
            label: BE_CUSTOMER_GROUP_UPDATE,
            description:
              "Event triggered when a customer group is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_group_update"],
          },
          {
            event_code: BE_CUSTOMER_GROUP_DELETE,
            label: BE_CUSTOMER_GROUP_DELETE,
            description:
              "Event triggered when a customer group is deleted in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_group_delete"],
          },
          {
            event_code: BE_SALES_ORDER_STATUS_UPDATE,
            label: BE_SALES_ORDER_STATUS_UPDATE,
            description:
              "Event triggered when an order status is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.sales_order_status_update"],
          },
          {
            event_code: BE_SALES_ORDER_SHIPMENT_CREATE,
            label: BE_SALES_ORDER_SHIPMENT_CREATE,
            description:
              "Event triggered when an order shipment is created in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.sales_order_shipment_create"],
          },
          {
            event_code: BE_SALES_ORDER_SHIPMENT_UPDATE,
            label: BE_SALES_ORDER_SHIPMENT_UPDATE,
            description:
              "Event triggered when an order shipment is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.sales_order_shipment_update"],
          },
          {
            event_code: BE_CATALOG_STOCK_UPDATE,
            label: BE_CATALOG_STOCK_UPDATE,
            description:
              "Event triggered when catalog stock is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.catalog_stock_update"],
          },
        ],
      },
      {
        id: COMMERCE_PROVIDER_ID,
        label: "Commerce Provider",
        provider_metadata: "dx_commerce_events",
        description: "Event provider for Adobe Commerce",
        docs_url: "https://developer.adobe.com/commerce/extensibility/events/",
        events_metadata: [
          {
            event_code: CATALOG_PRODUCT_DELETE_COMMIT_AFTER,
            label: CATALOG_PRODUCT_DELETE_COMMIT_AFTER,
            description:
              "Event triggered after a product is deleted in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.catalog_product_delete_commit_after"
              ].value,
          },
          {
            event_code: CATALOG_PRODUCT_SAVE_COMMIT_AFTER,
            label: CATALOG_PRODUCT_SAVE_COMMIT_AFTER,
            description:
              "Event triggered after a product is saved (created or updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.catalog_product_save_commit_after"
              ].value,
          },
          {
            event_code: CUSTOMER_SAVE_COMMIT_AFTER,
            label: CUSTOMER_SAVE_COMMIT_AFTER,
            description:
              "Event triggered after a customer is saved (created or updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.customer_save_commit_after"
              ].value,
          },
          {
            event_code: CUSTOMER_DELETE_COMMIT_AFTER,
            label: CUSTOMER_DELETE_COMMIT_AFTER,
            description:
              "Event triggered after a customer is deleted in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.customer_delete_commit_after"
              ].value,
          },
          {
            event_code: CUSTOMER_GROUP_SAVE_COMMIT_AFTER,
            label: CUSTOMER_GROUP_SAVE_COMMIT_AFTER,
            description:
              "Event triggered after a customer group is saved (created or updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.customer_group_save_commit_after"
              ].value,
          },
          {
            event_code: CUSTOMER_GROUP_DELETE_COMMIT_AFTER,
            label: CUSTOMER_GROUP_DELETE_COMMIT_AFTER,
            description:
              "Event triggered after a customer group is deleted in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.customer_group_delete_commit_after"
              ].value,
          },
          {
            event_code: SALES_ORDER_SAVE_COMMIT_AFTER,
            label: SALES_ORDER_SAVE_COMMIT_AFTER,
            description:
              "Event triggered after a sales order is saved (created or updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.sales_order_save_commit_after"
              ].value,
          },
          {
            event_code: CATALOGINVENTORY_STOCK_ITEM_SAVE_COMMIT_AFTER,
            label: CATALOGINVENTORY_STOCK_ITEM_SAVE_COMMIT_AFTER,
            description:
              "Event triggered after a stock item is saved (inventory updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after"
              ].value,
          },
        ],
      },
    ],
    subscriptions: [
      {
        event: {
          name: SUBSCRIPTION_CATALOG_PRODUCT_DELETE,
          fields: [
            "id",
            "sku",
            "name",
            "created_at",
            "updated_at",
            "description",
          ],
        },
      },
      {
        event: {
          name: SUBSCRIPTION_CATALOG_PRODUCT_SAVE,
          fields: [
            "id",
            "sku",
            "name",
            "created_at",
            "updated_at",
            "description",
          ],
        },
      },
      {
        event: {
          name: SUBSCRIPTION_CUSTOMER_SAVE,
          fields: [
            "id",
            "email",
            "firstname",
            "lastname",
            "created_at",
            "updated_at",
          ],
        },
      },
      {
        event: {
          name: SUBSCRIPTION_CUSTOMER_DELETE,
          fields: ["id", "email", "firstname", "lastname"],
        },
      },
      {
        event: {
          name: SUBSCRIPTION_CUSTOMER_GROUP_SAVE,
          fields: "*",
        },
      },
      {
        event: {
          name: SUBSCRIPTION_CUSTOMER_GROUP_DELETE,
          fields: "*",
        },
      },
      {
        event: {
          name: SUBSCRIPTION_SALES_ORDER_SAVE,
          fields: ["id", "increment_id", "created_at", "updated_at"],
        },
      },
      {
        event: {
          name: SUBSCRIPTION_CATALOGINVENTORY_STOCK_ITEM_SAVE,
          fields: "*",
        },
      },
    ],
  },
  webhooks: [],
};
