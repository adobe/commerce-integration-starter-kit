/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// Product version constraints (no App Management equivalent — for reference only):
// Adobe Commerce compatibility: >= 2.4.4, < 2.4.9
// Contact Adobe Commerce Marketplace for guidance on version enforcement.
import { defineConfig } from "@adobe/aio-commerce-lib-app/config";

const field = (name: string) => ({ name });

export default defineConfig({
  metadata: {
    id: "commerce-integration-starter-kit",
    displayName: "Commerce Integration Starter Kit",
    version: "1.0.2",
    description:
      "To reduce the cost of integrating with Enterprise Resource Planning (ERP) solutions and to improve the reliability of real-time connections, Adobe is introducing an integration starter kit for back-office integrations using Adobe Developer App Builder....",
  },
  eventing: {
    commerce: [
      {
        provider: {
          label: "Commerce Provider",
          description: "Commerce Provider that will receive events from commerce",
          key: "commerce",
        },
        events: [
          {
            name: "observer.catalog_product_delete_commit_after",
            label: "Observer catalog product delete commit after",
            description: "Observer catalog product delete commit after",
            fields: [field("id"), field("sku"), field("name"), field("created_at"), field("updated_at"), field("description")],
            runtimeActions: ["product-commerce/consumer"],
          },
          {
            name: "observer.catalog_product_save_commit_after",
            label: "Observer catalog product save commit after",
            description: "Observer catalog product save commit after",
            fields: [field("id"), field("sku"), field("name"), field("created_at"), field("updated_at"), field("description")],
            runtimeActions: ["product-commerce/consumer"],
          },
          {
            name: "observer.customer_save_commit_after",
            label: "Observer customer save commit after",
            description: "Observer customer save commit after",
            fields: [field("id"), field("firstname"), field("lastname"), field("email"), field("created_at"), field("updated_at")],
            runtimeActions: ["customer-commerce/consumer"],
          },
          {
            name: "observer.customer_delete_commit_after",
            label: "Observer customer delete commit after",
            description: "Observer customer delete commit after",
            fields: [field("id"), field("firstname"), field("lastname"), field("email")],
            runtimeActions: ["customer-commerce/consumer"],
          },
          {
            name: "observer.customer_group_save_commit_after",
            label: "Observer customer group save commit after",
            description: "Observer customer group save commit after",
            fields: [field("customer_group_code"), field("tax_class_id"), field("extension_attributes"), field("customer_group_id")],
            runtimeActions: ["customer-commerce/consumer"],
          },
          {
            name: "observer.customer_group_delete_commit_after",
            label: "Observer customer group delete commit after",
            description: "Observer customer group delete commit after",
            fields: [field("customer_group_code"), field("customer_group_id"), field("tax_class_id")],
            runtimeActions: ["customer-commerce/consumer"],
          },
          {
            name: "observer.sales_order_save_commit_after",
            label: "Observer sales order save commit after",
            description: "Observer sales order save commit after",
            fields: [field("id"), field("increment_id"), field("created_at"), field("updated_at")],
            runtimeActions: ["order-commerce/consumer"],
          },
          {
            name: "observer.cataloginventory_stock_item_save_commit_after",
            label: "Observer cataloginventory stock item save commit after",
            description: "Observer cataloginventory stock item save commit after",
            fields: [field("item_id"), field("product_id"), field("stock_id"), field("qty"), field("min_qty"), field("use_config_min_qty"), field("is_qty_decimal"), field("backorders"), field("use_config_backorders"), field("min_sale_qty"), field("use_config_min_sale_qty"), field("max_sale_qty"), field("use_config_max_sale_qty"), field("is_in_stock"), field("low_stock_date"), field("notify_stock_qty"), field("use_config_notify_stock_qty"), field("manage_stock"), field("use_config_manage_stock"), field("stock_status_changed_auto"), field("use_config_qty_increments"), field("qty_increments"), field("use_config_enable_qty_inc"), field("enable_qty_increments"), field("is_decimal_divided"), field("website_id"), field("deferred_stock_update"), field("use_config_deferred_stock_update"), field("type_id"), field("min_qty_allowed_in_shopping_cart")],
            runtimeActions: ["stock-commerce/consumer"],
          },
        ],
      },
    ],
    external: [
      {
        provider: {
          label: "Backoffice Provider",
          description: "Backoffice Provider that will receive events from commerce",
        },
        events: [
          { name: "be-observer.catalog_product_create", label: "Be observer catalog product create", description: "Be observer catalog product create", fields: [], runtimeActions: ["product-backoffice/consumer"] },
          { name: "be-observer.catalog_product_update", label: "Be observer catalog product update", description: "Be observer catalog product update", fields: [], runtimeActions: ["product-backoffice/consumer"] },
          { name: "be-observer.catalog_product_delete", label: "Be observer catalog product delete", description: "Be observer catalog product delete", fields: [], runtimeActions: ["product-backoffice/consumer"] },
          { name: "be-observer.customer_create", label: "Be observer customer create", description: "Be observer customer create", fields: [], runtimeActions: ["customer-backoffice/consumer"] },
          { name: "be-observer.customer_update", label: "Be observer customer update", description: "Be observer customer update", fields: [], runtimeActions: ["customer-backoffice/consumer"] },
          { name: "be-observer.customer_delete", label: "Be observer customer delete", description: "Be observer customer delete", fields: [], runtimeActions: ["customer-backoffice/consumer"] },
          { name: "be-observer.customer_group_create", label: "Be observer customer group create", description: "Be observer customer group create", fields: [], runtimeActions: ["customer-backoffice/consumer"] },
          { name: "be-observer.customer_group_update", label: "Be observer customer group update", description: "Be observer customer group update", fields: [], runtimeActions: ["customer-backoffice/consumer"] },
          { name: "be-observer.customer_group_delete", label: "Be observer customer group delete", description: "Be observer customer group delete", fields: [], runtimeActions: ["customer-backoffice/consumer"] },
          { name: "be-observer.sales_order_status_update", label: "Be observer sales order status update", description: "Be observer sales order status update", fields: [], runtimeActions: ["order-backoffice/consumer"] },
          { name: "be-observer.sales_order_shipment_create", label: "Be observer sales order shipment create", description: "Be observer sales order shipment create", fields: [], runtimeActions: ["order-backoffice/consumer"] },
          { name: "be-observer.sales_order_shipment_update", label: "Be observer sales order shipment update", description: "Be observer sales order shipment update", fields: [], runtimeActions: ["order-backoffice/consumer"] },
          { name: "be-observer.catalog_stock_update", label: "Be observer catalog stock update", description: "Be observer catalog stock update", fields: [], runtimeActions: ["stock-backoffice/consumer"] },
        ],
      },
    ],
  },
});
