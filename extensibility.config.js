const eventTemplates = require("./scripts/onboarding/event-templates.js");
const { SampleEventTemplate } = require("./utils/sample-event-template.js");

const sampleEvents = new Map(
  Object.entries(eventTemplates).map(([eventCode, template]) => [
    eventCode,
    new SampleEventTemplate(eventCode, template),
  ]),
);

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
        key: "commerce",
        label: "Commerce Provider",
        description: "Commerce Provider that will receive events from commerce",
        docs_url: null,
      },
      {
        key: "backoffice",
        label: "Backoffice Provider",
        description:
          "Backoffice Provider that will receive events from commerce",
        docs_url: null,
      },
    ],
    subscriptions: [
      {
        providerKey: "commerce",
        events: {
          "com.adobe.commerce.observer.catalog_product_delete_commit_after": {
            sampleEventTemplate: sampleEvents.get(
              "com.adobe.commerce.observer.catalog_product_delete_commit_after",
            ),
          },
          "com.adobe.commerce.observer.catalog_product_save_commit_after": {
            sampleEventTemplate: sampleEvents.get(
              "com.adobe.commerce.observer.catalog_product_save_commit_after",
            ),
          },
          "com.adobe.commerce.observer.customer_save_commit_after": {
            sampleEventTemplate: sampleEvents.get(
              "com.adobe.commerce.observer.customer_save_commit_after",
            ),
          },
          "com.adobe.commerce.observer.customer_delete_commit_after": {
            sampleEventTemplate: sampleEvents.get(
              "com.adobe.commerce.observer.customer_delete_commit_after",
            ),
          },
          "com.adobe.commerce.observer.customer_group_save_commit_after": {
            sampleEventTemplate: sampleEvents.get(
              "com.adobe.commerce.observer.customer_group_save_commit_after",
            ),
          },
          "com.adobe.commerce.observer.customer_group_delete_commit_after": {
            sampleEventTemplate: sampleEvents.get(
              "com.adobe.commerce.observer.customer_group_delete_commit_after",
            ),
          },
          "com.adobe.commerce.observer.sales_order_save_commit_after": {
            sampleEventTemplate: sampleEvents.get(
              "com.adobe.commerce.observer.sales_order_save_commit_after",
            ),
          },
          "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after":
            {
              sampleEventTemplate: sampleEvents.get(
                "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after",
              ),
            },
        },
      },
      {
        providerKey: "backoffice",
        events: {
          "be-observer.catalog_product_create": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.catalog_product_create",
            ),
          },
          "be-observer.catalog_product_update": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.catalog_product_update",
            ),
          },
          "be-observer.catalog_product_delete": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.catalog_product_delete",
            ),
          },
          "be-observer.customer_create": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.customer_create",
            ),
          },
          "be-observer.customer_update": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.customer_update",
            ),
          },
          "be-observer.customer_delete": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.customer_delete",
            ),
          },
          "be-observer.customer_group_create": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.customer_group_create",
            ),
          },
          "be-observer.customer_group_update": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.customer_group_update",
            ),
          },
          "be-observer.customer_group_delete": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.customer_group_delete",
            ),
          },
          "be-observer.sales_order_status_update": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.sales_order_status_update",
            ),
          },
          "be-observer.sales_order_shipment_create": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.sales_order_shipment_create",
            ),
          },
          "be-observer.sales_order_shipment_update": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.sales_order_shipment_update",
            ),
          },
          "be-observer.catalog_stock_update": {
            sampleEventTemplate: sampleEvents.get(
              "be-observer.catalog_stock_update",
            ),
          },
        },
      },
    ],
  },
  webhooks: [],
};
