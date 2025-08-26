module.exports = {
  app: {
    registrations: {
      product: ["commerce", "backoffice"],
      customer: ["commerce", "backoffice"],
      order: ["commerce", "backoffice"],
      stock: ["commerce", "backoffice"],
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
    subscriptions: {
      product: {
        commerce: {
          "com.adobe.commerce.observer.catalog_product_delete_commit_after": {
            sampleEventTemplate: {
              value: {
                id: 2,
                sku: "24-MB01",
                name: "Joust Duffle Bag",
                created_at: "2024-06-12 16:31:43",
                updated_at: "2024-08-05 10:03:49",
                description: "Comfortable sporty duffel bag",
              },
            },
          },
          "com.adobe.commerce.observer.catalog_product_save_commit_after": {
            sampleEventTemplate: {
              value: {
                id: 2,
                sku: "24-MB01",
                name: "Joust Duffle Bag",
                created_at: "2024-06-12 16:31:43",
                updated_at: "2024-08-05 10:03:49",
                description: "Comfortable sporty duffel bag",
              },
            },
          },
        },
        backoffice: {
          "be-observer.catalog_product_create": {
            sampleEventTemplate: {
              sku: "SKU-EXT-0001",
              name: "Product Created Externally",
              price: 0.0,
              description: "This is a sample product created externally",
            },
          },
          "be-observer.catalog_product_update": {
            sampleEventTemplate: {
              sku: "SKU-EXT-0001",
              name: "Product Created Externally",
              price: 99.99,
              description: "This is a sample product created externally",
            },
          },
          "be-observer.catalog_product_delete": {
            sampleEventTemplate: {
              sku: "SKU-EXT-0001",
            },
          },
        },
      },
      customer: {
        commerce: {
          "com.adobe.commerce.observer.customer_save_commit_after": {
            sampleEventTemplate: {
              value: {
                id: 123,
                firstname: "John",
                lastname: "Doe",
                email: "john.doe@fakedomain.com",
                created_at: "2024-06-12 16:31:43",
                updated_at: "2024-08-05 10:03:49",
              },
            },
          },
          "com.adobe.commerce.observer.customer_delete_commit_after": {
            sampleEventTemplate: {
              value: {
                id: 123,
                firstname: "John",
                lastname: "Doe",
                email: "john.doe@fakedomain.com",
              },
            },
          },
          "com.adobe.commerce.observer.customer_group_save_commit_after": {
            sampleEventTemplate: {
              value: {
                customer_group_code: "VIP",
                tax_class_id: 3,
                extension_attributes: {
                  exclude_website_ids: [],
                },
                customer_group_id: "18",
              },
            },
          },
          "com.adobe.commerce.observer.customer_group_delete_commit_after": {
            sampleEventTemplate: {
              value: {
                customer_group_code: "VIP",
                customer_group_id: "18",
                tax_class_id: "3",
              },
            },
          },
        },
        backoffice: {
          "be-observer.customer_create": {
            sampleEventTemplate: {
              name: "Jane",
              lastname: "Doe",
              email: "jane.doe@fakedomain.com",
            },
          },
          "be-observer.customer_update": {
            sampleEventTemplate: {
              id: 15,
              name: "Jane",
              lastname: "Doe",
              email: "jane.doe@fakedomain.com",
            },
          },
          "be-observer.customer_delete": {
            sampleEventTemplate: {
              id: 15,
            },
          },
          "be-observer.customer_group_create": {
            sampleEventTemplate: {
              name: "Backoffice Group",
              taxClassId: 3,
            },
          },
          "be-observer.customer_group_update": {
            sampleEventTemplate: {
              id: 19,
              name: "Backoffice Group",
              taxClassId: 2,
            },
          },
          "be-observer.customer_group_delete": {
            sampleEventTemplate: {
              id: 19,
            },
          },
        },
      },
      order: {
        commerce: {
          "com.adobe.commerce.observer.sales_order_save_commit_after": {
            sampleEventTemplate: {
              value: {
                id: "12",
                increment_id: "000000012",
                created_at: "2024-08-05 14:34:19",
                updated_at: "2024-08-05 14:34:19",
              },
            },
          },
        },
        backoffice: {
          "be-observer.sales_order_status_update": {
            sampleEventTemplate: {
              id: 1,
              status: "shipped",
              notifyCustomer: false,
            },
          },
          "be-observer.sales_order_shipment_create": {
            sampleEventTemplate: {
              orderId: 8,
              items: [
                {
                  orderItemId: 8,
                  qty: 1,
                },
              ],
              tracks: [
                {
                  trackNumber: "Custom Value",
                  title: "Custom Title",
                  carrierCode: "custom",
                },
              ],
              comment: {
                comment: "Order Shipped in Backoffice",
                visibleOnFront: true,
              },
              stockSourceCode: "default",
            },
          },
          "be-observer.sales_order_shipment_update": {
            sampleEventTemplate: {
              id: 33,
              orderId: 8,
              items: [
                {
                  entityId: 19,
                  orderItemId: 8,
                  qty: 1,
                },
              ],
              tracks: [
                {
                  entityId: 19,
                  trackNumber: "Custom Value Upd",
                  title: "Custom Title Upd",
                  carrierCode: "custom",
                },
              ],
              comments: [
                {
                  entityId: 19,
                  notifyCustomer: false,
                  comment: "Order Shipment Updated in Backoffice",
                  visibleOnFront: true,
                },
              ],
              stockSourceCode: "default",
            },
          },
        },
      },
      stock: {
        commerce: {
          "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after":
            {
              sampleEventTemplate: {
                value: {
                  item_id: "25",
                  product_id: "27",
                  stock_id: 1,
                  qty: "0",
                  min_qty: "0",
                  use_config_min_qty: "1",
                  is_qty_decimal: "0",
                  backorders: "0",
                  use_config_backorders: "1",
                  min_sale_qty: "1",
                  use_config_min_sale_qty: "1",
                  max_sale_qty: "10000",
                  use_config_max_sale_qty: "1",
                  is_in_stock: "0",
                  low_stock_date: "2024-08-05 14:37:59",
                  notify_stock_qty: "1",
                  use_config_notify_stock_qty: "1",
                  manage_stock: "1",
                  use_config_manage_stock: "1",
                  stock_status_changed_auto: "0",
                  use_config_qty_increments: "1",
                  qty_increments: "1",
                  use_config_enable_qty_inc: "1",
                  enable_qty_increments: "0",
                  is_decimal_divided: 0,
                  website_id: 0,
                  deferred_stock_update: "0",
                  use_config_deferred_stock_update: "1",
                  type_id: "simple",
                  min_qty_allowed_in_shopping_cart: [
                    {
                      customer_group_id: "32000",
                      min_sale_qty: "",
                      record_id: "0",
                    },
                  ],
                },
              },
            },
        },
        backoffice: {
          "be-observer.catalog_stock_update": {
            sampleEventTemplate: [
              {
                sku: "SKU-EXT-0001",
                source: "default",
                quantity: 66,
                outOfStock: false,
              },
            ],
          },
        },
      },
    },
  },
  webhooks: [],
};
