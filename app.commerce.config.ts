import { defineConfig } from "@adobe/aio-commerce-lib-app/config";

const field = (name: string, source?: string) =>
  source ? { name, source } : { name };

export default defineConfig({
  eventing: {
    commerce: [
      {
        events: [
          {
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
            label: "Product Deleted",
            name: "observer.catalog_product_delete_commit_after",
            runtimeActions: ["product-commerce/deleted"],
          },
          {
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
            label: "Product Created or Updated",
            name: "observer.catalog_product_save_commit_after",
            runtimeActions: [
              "product-commerce/created",
              "product-commerce/updated",
            ],
          },
          {
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
            label: "Customer Created or Updated",
            name: "observer.customer_save_commit_after",
            runtimeActions: [
              "customer-commerce/created",
              "customer-commerce/updated",
            ],
          },
          {
            description:
              "Fires after a customer is deleted in Commerce, used to sync the deletion to external systems",
            fields: [
              field("id"),
              field("firstname"),
              field("lastname"),
              field("email"),
            ],
            label: "Customer Deleted",
            name: "observer.customer_delete_commit_after",
            runtimeActions: ["customer-commerce/deleted"],
          },
          {
            description:
              "Fires after a customer group is created or updated in Commerce, used to sync group changes to external systems",
            fields: [
              field("customer_group_code"),
              field("tax_class_id"),
              field("extension_attributes"),
              field("customer_group_id"),
            ],
            label: "Customer Group Created or Updated",
            name: "observer.customer_group_save_commit_after",
            runtimeActions: ["customer-commerce/group-updated"],
          },
          {
            description:
              "Fires after a customer group is deleted in Commerce, used to sync the deletion to external systems",
            fields: [
              field("customer_group_code"),
              field("customer_group_id"),
              field("tax_class_id"),
            ],
            label: "Customer Group Deleted",
            name: "observer.customer_group_delete_commit_after",
            runtimeActions: ["customer-commerce/group-deleted"],
          },
          {
            description:
              "Fires after a sales order is created or updated in Commerce, used to sync order changes to external systems",
            fields: [
              field("id"),
              field("increment_id"),
              field("created_at"),
              field("updated_at"),
            ],
            label: "Sales Order Created or Updated",
            name: "observer.sales_order_save_commit_after",
            runtimeActions: [
              "order-commerce/created",
              "order-commerce/updated",
            ],
          },
          {
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
            label: "Stock Item Updated",
            name: "observer.cataloginventory_stock_item_save_commit_after",
            runtimeActions: ["stock-commerce/updated"],
          },
        ],
        provider: {
          description:
            "Commerce Provider that will receive events from commerce",
          key: "commerce",
          label: "Commerce Provider",
        },
      },
    ],
    external: [
      {
        events: [
          {
            description:
              "Notifies Commerce that a product was created in the backoffice system",
            label: "Backoffice Product Created",
            name: "be-observer.catalog_product_create",
            runtimeActions: ["product-backoffice/created"],
          },
          {
            description:
              "Notifies Commerce that a product was updated in the backoffice system",
            label: "Backoffice Product Updated",
            name: "be-observer.catalog_product_update",
            runtimeActions: ["product-backoffice/updated"],
          },
          {
            description:
              "Notifies Commerce that a product was deleted in the backoffice system",
            label: "Backoffice Product Deleted",
            name: "be-observer.catalog_product_delete",
            runtimeActions: ["product-backoffice/deleted"],
          },
          {
            description:
              "Notifies Commerce that a customer was created in the backoffice system",
            label: "Backoffice Customer Created",
            name: "be-observer.customer_create",
            runtimeActions: ["customer-backoffice/created"],
          },
          {
            description:
              "Notifies Commerce that a customer was updated in the backoffice system",
            label: "Backoffice Customer Updated",
            name: "be-observer.customer_update",
            runtimeActions: ["customer-backoffice/updated"],
          },
          {
            description:
              "Notifies Commerce that a customer was deleted in the backoffice system",
            label: "Backoffice Customer Deleted",
            name: "be-observer.customer_delete",
            runtimeActions: ["customer-backoffice/deleted"],
          },
          {
            description:
              "Notifies Commerce that a customer group was created in the backoffice system",
            label: "Backoffice Customer Group Created",
            name: "be-observer.customer_group_create",
            runtimeActions: ["customer-backoffice/group-created"],
          },
          {
            description:
              "Notifies Commerce that a customer group was updated in the backoffice system",
            label: "Backoffice Customer Group Updated",
            name: "be-observer.customer_group_update",
            runtimeActions: ["customer-backoffice/group-updated"],
          },
          {
            description:
              "Notifies Commerce that a customer group was deleted in the backoffice system",
            label: "Backoffice Customer Group Deleted",
            name: "be-observer.customer_group_delete",
            runtimeActions: ["customer-backoffice/group-deleted"],
          },
          {
            description:
              "Notifies Commerce that a sales order status was updated in the backoffice system",
            label: "Backoffice Order Status Updated",
            name: "be-observer.sales_order_status_update",
            runtimeActions: ["order-backoffice/updated"],
          },
          {
            description:
              "Notifies Commerce that a shipment was created for a sales order in the backoffice system",
            label: "Backoffice Order Shipment Created",
            name: "be-observer.sales_order_shipment_create",
            runtimeActions: ["order-backoffice/shipment-created"],
          },
          {
            description:
              "Notifies Commerce that a shipment was updated for a sales order in the backoffice system",
            label: "Backoffice Order Shipment Updated",
            name: "be-observer.sales_order_shipment_update",
            runtimeActions: ["order-backoffice/shipment-updated"],
          },
          {
            description:
              "Notifies Commerce that stock levels were updated in the backoffice system",
            label: "Backoffice Stock Updated",
            name: "be-observer.catalog_stock_update",
            runtimeActions: ["stock-backoffice/updated"],
          },
        ],
        provider: {
          description:
            "Backoffice Provider that will receive events from commerce",
          key: "backoffice",
          label: "Backoffice Provider",
        },
      },
    ],
  },
  metadata: {
    description:
      "To reduce the cost of integrating with Enterprise Resource Planning (ERP) solutions and to improve the reliability of real-time connections, Adobe is introducing an integration starter kit for back-office integrations using Adobe Developer App Builder.",
    displayName: "Commerce Integration Starter Kit",
    id: "commerce-integration-starter-kit",
    version: "1.0.2",
  },
  webhooks: [
    {
      category: "validation",
      description:
        "Validates stock availability for cart items in real time before a product is added to the cart",
      label: "Cart Stock Validation",
      requireAdobeAuth: true,
      runtimeAction: "webhook/check-stock",
      webhook: {
        batch_name: "validate_stock",
        fallback_error_message: "The product stock validation failed",
        fields: [field("data.cart_id"), field("data.items")],
        hook_name: "check_stock",
        method: "POST",
        required: true,
        soft_timeout: 1000,
        timeout: 5000,
        webhook_method: "observer.checkout_cart_product_add_before",
        webhook_type: "before",
      },
    },
  ],
});
