/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */

/**
 * This function transform the received stock data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns {object} - Returns transformed data object
 */
function transformData (params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  const sourceItems = []
  for (const stockUpdate of params.data) {
    sourceItems.push(transform(stockUpdate))
  }
  return {
    sourceItems
  }
}

/**
 *
 * @param {object} stockUpdate - stock update for an sku in a source
 * @returns {object} - transformed stock update
 */
function transform (stockUpdate) {
  return {
    sku: stockUpdate.sku,
    source_code: stockUpdate.source,
    quantity: stockUpdate.quantity,
    status: (stockUpdate.outOfStock ? 0 : 1)
  }
}

module.exports = {
  transformData
}
