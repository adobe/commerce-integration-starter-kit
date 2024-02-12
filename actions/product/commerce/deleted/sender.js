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
 * This function send the product deleted dara to the external back-office application
 *
 * @param {object} params - include the env params
 * @param {object} data - Product data
 * @param {*} preProcessed - result of the pre-process logic if any
 * @returns {object} returns the sending result if needed for post process
 * @throws {Error} - throws exception in case the process fail.
 */
async function sendData (params, data, preProcessed) {
  // @TODO Here add the logic to send the information to 3rd party
  // @TODO Use params to retrieve needed parameters from the environment
  // @TODO throw exception in case of error

  return {}
}

module.exports = {
  sendData
}
