require("dotenv").config();
const eventTemplates = require("./scripts/onboarding/event-templates.js");

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
        id: process.env.BACKOFFICE_PROVIDER_ID,
        label: "Backoffice Provider",
        provider_metadata: "3rd_party_custom_events",
        description:
          "Backoffice Provider that will receive events from commerce",
        docs_url: null,
        events_metadata: [
          {
            event_code: "be-observer.catalog_product_create",
            label: "be-observer.catalog_product_create",
            description:
              "Event triggered when a product is created in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.catalog_product_create"],
          },
          {
            event_code: "be-observer.catalog_product_update",
            label: "be-observer.catalog_product_update",
            description:
              "Event triggered when a product is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.catalog_product_update"],
          },
          {
            event_code: "be-observer.catalog_product_delete",
            label: "be-observer.catalog_product_delete",
            description:
              "Event triggered when a product is deleted in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.catalog_product_delete"],
          },
          {
            event_code: "be-observer.customer_create",
            label: "be-observer.customer_create",
            description:
              "Event triggered when a customer is created in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_create"],
          },
          {
            event_code: "be-observer.customer_update",
            label: "be-observer.customer_update",
            description:
              "Event triggered when a customer is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_update"],
          },
          {
            event_code: "be-observer.customer_delete",
            label: "be-observer.customer_delete",
            description:
              "Event triggered when a customer is deleted in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_delete"],
          },
          {
            event_code: "be-observer.customer_group_create",
            label: "be-observer.customer_group_create",
            description:
              "Event triggered when a customer group is created in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_group_create"],
          },
          {
            event_code: "be-observer.customer_group_update",
            label: "be-observer.customer_group_update",
            description:
              "Event triggered when a customer group is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_group_update"],
          },
          {
            event_code: "be-observer.customer_group_delete",
            label: "be-observer.customer_group_delete",
            description:
              "Event triggered when a customer group is deleted in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.customer_group_delete"],
          },
          {
            event_code: "be-observer.sales_order_status_update",
            label: "be-observer.sales_order_status_update",
            description:
              "Event triggered when an order status is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.sales_order_status_update"],
          },
          {
            event_code: "be-observer.sales_order_shipment_create",
            label: "be-observer.sales_order_shipment_create",
            description:
              "Event triggered when an order shipment is created in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.sales_order_shipment_create"],
          },
          {
            event_code: "be-observer.sales_order_shipment_update",
            label: "be-observer.sales_order_shipment_update",
            description:
              "Event triggered when an order shipment is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.sales_order_shipment_update"],
          },
          {
            event_code: "be-observer.catalog_stock_update",
            label: "be-observer.catalog_stock_update",
            description:
              "Event triggered when catalog stock is updated in the backoffice system",
            sample_event_template:
              eventTemplates["be-observer.catalog_stock_update"],
          },
        ],
      },
      {
        id: process.env.COMMERCE_PROVIDER_ID,
        label: "Commerce Provider",
        provider_metadata: "dx_commerce_events",
        description: "Event provider for Adobe Commerce",
        docs_url: "https://developer.adobe.com/commerce/extensibility/events/",
        events_metadata: [
          {
            event_code:
              "com.adobe.commerce.observer.catalog_product_delete_commit_after",
            label:
              "com.adobe.commerce.observer.catalog_product_delete_commit_after",
            description:
              "Event triggered after a product is deleted in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.catalog_product_delete_commit_after"
              ].value,
          },
          {
            event_code:
              "com.adobe.commerce.observer.catalog_product_save_commit_after",
            label:
              "com.adobe.commerce.observer.catalog_product_save_commit_after",
            description:
              "Event triggered after a product is saved (created or updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.catalog_product_save_commit_after"
              ].value,
          },
          {
            event_code:
              "com.adobe.commerce.observer.customer_save_commit_after",
            label: "com.adobe.commerce.observer.customer_save_commit_after",
            description:
              "Event triggered after a customer is saved (created or updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.customer_save_commit_after"
              ].value,
          },
          {
            event_code:
              "com.adobe.commerce.observer.customer_delete_commit_after",
            label: "com.adobe.commerce.observer.customer_delete_commit_after",
            description:
              "Event triggered after a customer is deleted in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.customer_delete_commit_after"
              ].value,
          },
          {
            event_code:
              "com.adobe.commerce.observer.customer_group_save_commit_after",
            label:
              "com.adobe.commerce.observer.customer_group_save_commit_after",
            description:
              "Event triggered after a customer group is saved (created or updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.customer_group_save_commit_after"
              ].value,
          },
          {
            event_code:
              "com.adobe.commerce.observer.customer_group_delete_commit_after",
            label:
              "com.adobe.commerce.observer.customer_group_delete_commit_after",
            description:
              "Event triggered after a customer group is deleted in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.customer_group_delete_commit_after"
              ].value,
          },
          {
            event_code:
              "com.adobe.commerce.observer.sales_order_save_commit_after",
            label: "com.adobe.commerce.observer.sales_order_save_commit_after",
            description:
              "Event triggered after a sales order is saved (created or updated) in Adobe Commerce",
            sample_event_template:
              eventTemplates[
                "com.adobe.commerce.observer.sales_order_save_commit_after"
              ].value,
          },
          {
            event_code:
              "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after",
            label:
              "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after",
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
          name: "observer.catalog_product_delete_commit_after",
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
          name: "observer.catalog_product_save_commit_after",
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
          name: "observer.customer_save_commit_after",
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
          name: "observer.customer_delete_commit_after",
          fields: ["id", "email", "firstname", "lastname"],
        },
      },
      {
        event: {
          name: "observer.customer_group_save_commit_after",
          fields: "*",
        },
      },
      {
        event: {
          name: "observer.customer_group_delete_commit_after",
          fields: "*",
        },
      },
      {
        event: {
          name: "observer.sales_order_save_commit_after",
          fields: ["id", "increment_id", "created_at", "updated_at"],
        },
      },
      {
        event: {
          name: "observer.cataloginventory_stock_item_save_commit_after",
          fields: "*",
        },
      },
    ],
  },
  webhooks: [],
};
