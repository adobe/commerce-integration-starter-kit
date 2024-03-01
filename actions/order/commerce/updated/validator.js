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
 * This function validate the order data received
 *
 * @param {object} data - Received data from adobe commerce
 * @returns {object} - returns the result of validation object
 */
function validateData (data) {
  // @TODO Here add the logic to validate the received data
  // @TODO in case of error return { success: false, message: '<error message>' }

  return {
    success: true
  }
}

module.exports = {
  validateData
}
