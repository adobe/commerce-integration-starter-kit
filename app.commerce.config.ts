import { defineConfig } from "@adobe/aio-commerce-lib-app/config";

const field = (name: string, source?: string) =>
  source ? { name, source } : { name };

export default defineConfig({
  metadata: {
    id: "commerce-integration-starter-kit",
    displayName: "Commerce Integration Starter Kit",
    version: "1.0.2",
    description:
      "To reduce the cost of integrating with Enterprise Resource Planning (ERP) solutions and to improve the reliability of real-time connections, Adobe is introducing an integration starter kit for back-office integrations using Adobe Developer App Builder.",
  },
  eventing: {
    commerce: [
      {
        provider: {
          label: "Commerce Provider",
          description:
            "Commerce Provider that will receive events from commerce",
          key: "commerce",
        },
        events: [
          {
            name: "observer.catalog_product_delete_commit_after",
            label: "Product Deleted",
            description:
              "Fires after a product is deleted in Commerce, used to sync the deletion to external systems",
            fields: [
              field("id"),
              field("sku"),
              field("name"),
              field("created_at"),
              field("updated_at"),
              field("description"),
            ],
            runtimeActions: ["product-commerce/deleted"],
          },
          {
            name: "observer.catalog_product_save_commit_after",
            label: "Product Created or Updated",
            description:
              "Fires after a product is created or updated in Commerce, used to sync product changes to external systems",
            fields: [
              field("id"),
              field("sku"),
              field("name"),
              field("created_at"),
              field("updated_at"),
              field("description"),
            ],
            runtimeActions: [
              "product-commerce/created",
              "product-commerce/updated",
            ],
          },
          {
            name: "observer.customer_save_commit_after",
            label: "Customer Created or Updated",
            description:
              "Fires after a customer is created or updated in Commerce, used to sync customer changes to external systems",
            fields: [
              field("id"),
              field("firstname"),
              field("lastname"),
              field("email"),
              field("created_at"),
              field("updated_at"),
            ],
            runtimeActions: [
              "customer-commerce/created",
              "customer-commerce/updated",
            ],
          },
          {
            name: "observer.customer_delete_commit_after",
            label: "Customer Deleted",
            description:
              "Fires after a customer is deleted in Commerce, used to sync the deletion to external systems",
            fields: [
              field("id"),
              field("firstname"),
              field("lastname"),
              field("email"),
            ],
            runtimeActions: ["customer-commerce/deleted"],
          },
          {
            name: "observer.customer_group_save_commit_after",
            label: "Customer Group Created or Updated",
            description:
              "Fires after a customer group is created or updated in Commerce, used to sync group changes to external systems",
            fields: [
              field("customer_group_code"),
              field("tax_class_id"),
              field("extension_attributes"),
              field("customer_group_id"),
            ],
            runtimeActions: ["customer-commerce/group-updated"],
          },
          {
            name: "observer.customer_group_delete_commit_after",
            label: "Customer Group Deleted",
            description:
              "Fires after a customer group is deleted in Commerce, used to sync the deletion to external systems",
            fields: [
              field("customer_group_code"),
              field("customer_group_id"),
              field("tax_class_id"),
            ],
            runtimeActions: ["customer-commerce/group-deleted"],
          },
          {
            name: "observer.sales_order_save_commit_after",
            label: "Sales Order Created or Updated",
            description:
              "Fires after a sales order is created or updated in Commerce, used to sync order changes to external systems",
            fields: [
              field("id"),
              field("increment_id"),
              field("created_at"),
              field("updated_at"),
            ],
            runtimeActions: [
              "order-commerce/created",
              "order-commerce/updated",
            ],
          },
          {
            name: "observer.cataloginventory_stock_item_save_commit_after",
            label: "Stock Item Updated",
            description:
              "Fires after inventory data for a stock item is created or updated in Commerce, used to sync stock levels to external systems",
            fields: [
              field("item_id"),
              field("product_id"),
              field("stock_id"),
              field("qty"),
              field("min_qty"),
              field("use_config_min_qty"),
              field("is_qty_decimal"),
              field("backorders"),
              field("use_config_backorders"),
              field("min_sale_qty"),
              field("use_config_min_sale_qty"),
              field("max_sale_qty"),
              field("use_config_max_sale_qty"),
              field("is_in_stock"),
              field("low_stock_date"),
              field("notify_stock_qty"),
              field("use_config_notify_stock_qty"),
              field("manage_stock"),
              field("use_config_manage_stock"),
              field("stock_status_changed_auto"),
              field("use_config_qty_increments"),
              field("qty_increments"),
              field("use_config_enable_qty_inc"),
              field("enable_qty_increments"),
              field("is_decimal_divided"),
              field("website_id"),
              field("deferred_stock_update"),
              field("use_config_deferred_stock_update"),
              field("type_id"),
              field("min_qty_allowed_in_shopping_cart"),
            ],
            runtimeActions: ["stock-commerce/updated"],
          },
        ],
      },
    ],
    external: [
      {
        provider: {
          label: "Backoffice Provider",
          description:
            "Backoffice Provider that will receive events from commerce",
          key: "backoffice",
        },
        events: [
          {
            name: "be-observer.catalog_product_create",
            label: "Backoffice Product Created",
            description:
              "Notifies Commerce that a product was created in the backoffice system",
            runtimeActions: ["product-backoffice/created"],
          },
          {
            name: "be-observer.catalog_product_update",
            label: "Backoffice Product Updated",
            description:
              "Notifies Commerce that a product was updated in the backoffice system",
            runtimeActions: ["product-backoffice/updated"],
          },
          {
            name: "be-observer.catalog_product_delete",
            label: "Backoffice Product Deleted",
            description:
              "Notifies Commerce that a product was deleted in the backoffice system",
            runtimeActions: ["product-backoffice/deleted"],
          },
          {
            name: "be-observer.customer_create",
            label: "Backoffice Customer Created",
            description:
              "Notifies Commerce that a customer was created in the backoffice system",
            runtimeActions: ["customer-backoffice/created"],
          },
          {
            name: "be-observer.customer_update",
            label: "Backoffice Customer Updated",
            description:
              "Notifies Commerce that a customer was updated in the backoffice system",
            runtimeActions: ["customer-backoffice/updated"],
          },
          {
            name: "be-observer.customer_delete",
            label: "Backoffice Customer Deleted",
            description:
              "Notifies Commerce that a customer was deleted in the backoffice system",
            runtimeActions: ["customer-backoffice/deleted"],
          },
          {
            name: "be-observer.customer_group_create",
            label: "Backoffice Customer Group Created",
            description:
              "Notifies Commerce that a customer group was created in the backoffice system",
            runtimeActions: ["customer-backoffice/group-created"],
          },
          {
            name: "be-observer.customer_group_update",
            label: "Backoffice Customer Group Updated",
            description:
              "Notifies Commerce that a customer group was updated in the backoffice system",
            runtimeActions: ["customer-backoffice/group-updated"],
          },
          {
            name: "be-observer.customer_group_delete",
            label: "Backoffice Customer Group Deleted",
            description:
              "Notifies Commerce that a customer group was deleted in the backoffice system",
            runtimeActions: ["customer-backoffice/group-deleted"],
          },
          {
            name: "be-observer.sales_order_status_update",
            label: "Backoffice Order Status Updated",
            description:
              "Notifies Commerce that a sales order status was updated in the backoffice system",
            runtimeActions: ["order-backoffice/updated"],
          },
          {
            name: "be-observer.sales_order_shipment_create",
            label: "Backoffice Order Shipment Created",
            description:
              "Notifies Commerce that a shipment was created for a sales order in the backoffice system",
            runtimeActions: ["order-backoffice/shipment-created"],
          },
          {
            name: "be-observer.sales_order_shipment_update",
            label: "Backoffice Order Shipment Updated",
            description:
              "Notifies Commerce that a shipment was updated for a sales order in the backoffice system",
            runtimeActions: ["order-backoffice/shipment-updated"],
          },
          {
            name: "be-observer.catalog_stock_update",
            label: "Backoffice Stock Updated",
            description:
              "Notifies Commerce that stock levels were updated in the backoffice system",
            runtimeActions: ["stock-backoffice/updated"],
          },
        ],
      },
    ],
  },
  webhooks: [
    {
      label: "Cart Stock Validation",
      description:
        "Validates stock availability for cart items in real time before a product is added to the cart",
      category: "validation",
      runtimeAction: "webhook/check-stock",
      requireAdobeAuth: true,
      webhook: {
        webhook_method: "observer.checkout_cart_product_add_before",
        webhook_type: "before",
        batch_name: "validate_stock",
        hook_name: "check_stock",
        method: "POST",
        required: true,
        soft_timeout: 1000,
        timeout: 5000,
        fallback_error_message: "The product stock validation failed",
        fields: [field("data.cart_id"), field("data.items")],
      },
    },
  ],
});
