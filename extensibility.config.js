require("dotenv").config();
const eventTemplates = require("./scripts/onboarding/event-templates.js");

module.exports = {
  app: {},
  adminUi: {},
  eventing: {
    providers: [
      {
        id: process.env.BACKOFFICE_PROVIDER_ID,
        label: "Backoffice Provider",
        providerMetadata: "3rd_party_custom_events",
        description:
          "Backoffice Provider that will receive events from commerce",
        docsUrl: null,
        eventsMetadata: [
          {
            eventCode: "be-observer.catalog_product_create",
            label: "be-observer.catalog_product_create",
            description:
              "Event triggered when a product is created in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.catalog_product_create"],
          },
          {
            eventCode: "be-observer.catalog_product_update",
            label: "be-observer.catalog_product_update",
            description:
              "Event triggered when a product is updated in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.catalog_product_update"],
          },
          {
            eventCode: "be-observer.catalog_product_delete",
            label: "be-observer.catalog_product_delete",
            description:
              "Event triggered when a product is deleted in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.catalog_product_delete"],
          },
          {
            eventCode: "be-observer.customer_create",
            label: "be-observer.customer_create",
            description:
              "Event triggered when a customer is created in the backoffice system",
            sampleEventTemplate: eventTemplates["be-observer.customer_create"],
          },
          {
            eventCode: "be-observer.customer_update",
            label: "be-observer.customer_update",
            description:
              "Event triggered when a customer is updated in the backoffice system",
            sampleEventTemplate: eventTemplates["be-observer.customer_update"],
          },
          {
            eventCode: "be-observer.customer_delete",
            label: "be-observer.customer_delete",
            description:
              "Event triggered when a customer is deleted in the backoffice system",
            sampleEventTemplate: eventTemplates["be-observer.customer_delete"],
          },
          {
            eventCode: "be-observer.customer_group_create",
            label: "be-observer.customer_group_create",
            description:
              "Event triggered when a customer group is created in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.customer_group_create"],
          },
          {
            eventCode: "be-observer.customer_group_update",
            label: "be-observer.customer_group_update",
            description:
              "Event triggered when a customer group is updated in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.customer_group_update"],
          },
          {
            eventCode: "be-observer.customer_group_delete",
            label: "be-observer.customer_group_delete",
            description:
              "Event triggered when a customer group is deleted in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.customer_group_delete"],
          },
          {
            eventCode: "be-observer.sales_order_status_update",
            label: "be-observer.sales_order_status_update",
            description:
              "Event triggered when an order status is updated in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.sales_order_status_update"],
          },
          {
            eventCode: "be-observer.sales_order_shipment_create",
            label: "be-observer.sales_order_shipment_create",
            description:
              "Event triggered when an order shipment is created in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.sales_order_shipment_create"],
          },
          {
            eventCode: "be-observer.sales_order_shipment_update",
            label: "be-observer.sales_order_shipment_update",
            description:
              "Event triggered when an order shipment is updated in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.sales_order_shipment_update"],
          },
          {
            eventCode: "be-observer.catalog_stock_update",
            label: "be-observer.catalog_stock_update",
            description:
              "Event triggered when catalog stock is updated in the backoffice system",
            sampleEventTemplate:
              eventTemplates["be-observer.catalog_stock_update"],
          },
        ],
      },
      {
        id: process.env.COMMERCE_PROVIDER_ID,
        label: "Commerce Provider",
        providerMetadata: "dx_commerce_events",
        description: "Event provider for Adobe Commerce",
        docsUrl: "https://developer.adobe.com/commerce/extensibility/events/",
        eventsMetadata: [
          {
            eventCode:
              "com.adobe.commerce.observer.catalog_product_delete_commit_after",
            label:
              "com.adobe.commerce.observer.catalog_product_delete_commit_after",
            description:
              "Event triggered after a product is deleted in Adobe Commerce",
            sampleEventTemplate:
              eventTemplates[
                "com.adobe.commerce.observer.catalog_product_delete_commit_after"
              ].value,
          },
          {
            eventCode:
              "com.adobe.commerce.observer.catalog_product_save_commit_after",
            label:
              "com.adobe.commerce.observer.catalog_product_save_commit_after",
            description:
              "Event triggered after a product is saved (created or updated) in Adobe Commerce",
            sampleEventTemplate:
              eventTemplates[
                "com.adobe.commerce.observer.catalog_product_save_commit_after"
              ].value,
          },
          {
            eventCode: "com.adobe.commerce.observer.customer_save_commit_after",
            label: "com.adobe.commerce.observer.customer_save_commit_after",
            description:
              "Event triggered after a customer is saved (created or updated) in Adobe Commerce",
            sampleEventTemplate:
              eventTemplates[
                "com.adobe.commerce.observer.customer_save_commit_after"
              ].value,
          },
          {
            eventCode:
              "com.adobe.commerce.observer.customer_delete_commit_after",
            label: "com.adobe.commerce.observer.customer_delete_commit_after",
            description:
              "Event triggered after a customer is deleted in Adobe Commerce",
            sampleEventTemplate:
              eventTemplates[
                "com.adobe.commerce.observer.customer_delete_commit_after"
              ].value,
          },
          {
            eventCode:
              "com.adobe.commerce.observer.customer_group_save_commit_after",
            label:
              "com.adobe.commerce.observer.customer_group_save_commit_after",
            description:
              "Event triggered after a customer group is saved (created or updated) in Adobe Commerce",
            sampleEventTemplate:
              eventTemplates[
                "com.adobe.commerce.observer.customer_group_save_commit_after"
              ].value,
          },
          {
            eventCode:
              "com.adobe.commerce.observer.customer_group_delete_commit_after",
            label:
              "com.adobe.commerce.observer.customer_group_delete_commit_after",
            description:
              "Event triggered after a customer group is deleted in Adobe Commerce",
            sampleEventTemplate:
              eventTemplates[
                "com.adobe.commerce.observer.customer_group_delete_commit_after"
              ].value,
          },
          {
            eventCode:
              "com.adobe.commerce.observer.sales_order_save_commit_after",
            label: "com.adobe.commerce.observer.sales_order_save_commit_after",
            description:
              "Event triggered after a sales order is saved (created or updated) in Adobe Commerce",
            sampleEventTemplate:
              eventTemplates[
                "com.adobe.commerce.observer.sales_order_save_commit_after"
              ].value,
          },
          {
            eventCode:
              "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after",
            label:
              "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after",
            description:
              "Event triggered after a stock item is saved (inventory updated) in Adobe Commerce",
            sampleEventTemplate:
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
