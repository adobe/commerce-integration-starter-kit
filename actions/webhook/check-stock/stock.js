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
 * This method check the stock of received items in an external backoffice application
 * @param {object} params include the parameters received in the runtime action
 * @returns {object} success status and error message
 */
async function checkAvailableStock (params) {
  // @TODO implement the logic to check authetication with you external application
  // @TODO return { success: false, message: 'error message'} in case of failure

  return {
    success: true
  }
}

module.exports = {
  checkAvailableStock
}
