/**
 * This function transform the received product data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // This is a sample implementation. Please adapt based on your needs
  // Notice that the attribute_set_id may need to be changed
  return {
    product: {
      attribute_set_id: 4,
      custom_attributes: [
        {
          attribute_code: "description",
          value: params.data.description,
        },
      ],
      name: params.data.name,
      price: params.data.price,
      sku: params.data.sku,
    },
  };
}

export { transformData };
