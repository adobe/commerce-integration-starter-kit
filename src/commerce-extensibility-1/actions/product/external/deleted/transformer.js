/**
 * This function transform the received product data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  return params.data.sku;
}

export { transformData };
