const DEFAULT_SUBSCRIPTIONS = {
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
  customer: {},
  order: {},
  stock: {},
};

module.exports = {
  DEFAULT_SUBSCRIPTIONS,
};
