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
 * This function transform the received order status data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns {object} - Returns transformed data object
 */
function transformData (params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  return {
    statusHistory: {
      comment: `Order status changed to ${params.data.status}`,
      is_customer_notified: params.data?.notifyCustomer ? 1 : 0,
      is_visible_on_front: 1
    }
  }
}

module.exports = {
  transformData
}
