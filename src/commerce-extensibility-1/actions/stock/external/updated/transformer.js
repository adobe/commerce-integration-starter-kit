/**
 * This function transform the received stock data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  const sourceItems = [];
  for (const stockUpdate of params.data) {
    sourceItems.push(transform(stockUpdate));
  }
  return {
    sourceItems,
  };
}

/**
 *
 * @param {object} stockUpdate - stock update for an sku in a source
 * @returns - transformed stock update
 */
function transform(stockUpdate) {
  return {
    sku: stockUpdate.sku,
    source_code: stockUpdate.source,
    quantity: stockUpdate.quantity,
    status: stockUpdate.outOfStock ? 0 : 1,
  };
}

export { transformData };
