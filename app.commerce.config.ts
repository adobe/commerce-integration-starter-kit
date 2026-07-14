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
            label: "Observer catalog product delete commit after",
            description: "Observer catalog product delete commit after",
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
            label: "Observer catalog product save commit after",
            description: "Observer catalog product save commit after",
            fields: [
              field("id"),
              field("sku"),
              field("name"),
              field("created_at"),
              field("updated_at"),
              field("description"),
            ],
            runtimeActions: ["product-commerce/upsert"],
          },
          {
            name: "observer.customer_save_commit_after",
            label: "Observer customer save commit after",
            description: "Observer customer save commit after",
            fields: [
              field("id"),
              field("firstname"),
              field("lastname"),
              field("email"),
              field("created_at"),
              field("updated_at"),
            ],
            runtimeActions: ["customer-commerce/upsert"],
          },
          {
            name: "observer.customer_delete_commit_after",
            label: "Observer customer delete commit after",
            description: "Observer customer delete commit after",
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
            label: "Observer customer group save commit after",
            description: "Observer customer group save commit after",
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
            label: "Observer customer group delete commit after",
            description: "Observer customer group delete commit after",
            fields: [
              field("customer_group_code"),
              field("customer_group_id"),
              field("tax_class_id"),
            ],
            runtimeActions: ["customer-commerce/group-deleted"],
          },
          {
            name: "observer.sales_order_save_commit_after",
            label: "Observer sales order save commit after",
            description: "Observer sales order save commit after",
            fields: [
              field("id"),
              field("increment_id"),
              field("created_at"),
              field("updated_at"),
            ],
            runtimeActions: ["order-commerce/upsert"],
          },
          {
            name: "observer.cataloginventory_stock_item_save_commit_after",
            label: "Observer cataloginventory stock item save commit after",
            description:
              "Observer cataloginventory stock item save commit after",
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
            label: "Be observer catalog product create",
            description: "Be observer catalog product create",
            runtimeActions: ["product-backoffice/created"],
          },
          {
            name: "be-observer.catalog_product_update",
            label: "Be observer catalog product update",
            description: "Be observer catalog product update",
            runtimeActions: ["product-backoffice/updated"],
          },
          {
            name: "be-observer.catalog_product_delete",
            label: "Be observer catalog product delete",
            description: "Be observer catalog product delete",
            runtimeActions: ["product-backoffice/deleted"],
          },
          {
            name: "be-observer.customer_create",
            label: "Be observer customer create",
            description: "Be observer customer create",
            runtimeActions: ["customer-backoffice/created"],
          },
          {
            name: "be-observer.customer_update",
            label: "Be observer customer update",
            description: "Be observer customer update",
            runtimeActions: ["customer-backoffice/updated"],
          },
          {
            name: "be-observer.customer_delete",
            label: "Be observer customer delete",
            description: "Be observer customer delete",
            runtimeActions: ["customer-backoffice/deleted"],
          },
          {
            name: "be-observer.customer_group_create",
            label: "Be observer customer group create",
            description: "Be observer customer group create",
            runtimeActions: ["customer-backoffice/group-created"],
          },
          {
            name: "be-observer.customer_group_update",
            label: "Be observer customer group update",
            description: "Be observer customer group update",
            runtimeActions: ["customer-backoffice/group-updated"],
          },
          {
            name: "be-observer.customer_group_delete",
            label: "Be observer customer group delete",
            description: "Be observer customer group delete",
            runtimeActions: ["customer-backoffice/group-deleted"],
          },
          {
            name: "be-observer.sales_order_status_update",
            label: "Be observer sales order status update",
            description: "Be observer sales order status update",
            runtimeActions: ["order-backoffice/updated"],
          },
          {
            name: "be-observer.sales_order_shipment_create",
            label: "Be observer sales order shipment create",
            description: "Be observer sales order shipment create",
            runtimeActions: ["order-backoffice/shipment-created"],
          },
          {
            name: "be-observer.sales_order_shipment_update",
            label: "Be observer sales order shipment update",
            description: "Be observer sales order shipment update",
            runtimeActions: ["order-backoffice/shipment-updated"],
          },
          {
            name: "be-observer.catalog_stock_update",
            label: "Be observer catalog stock update",
            description: "Be observer catalog stock update",
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
