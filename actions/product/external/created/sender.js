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

const { createProduct } = require('../../commerce-product-api-client')
const { HTTP_INTERNAL_ERROR } = require('../../../constants')

/**
 * This function send the product created data to the Adobe commerce REST API
 *
 * @returns {object} - returns the result data of sending information to Adobe commerce
 * @param {object} params - include the env params
 * @param {object} transformed - transformed received data
 * @param {object} preProcessed - preprocessed result data
 */
async function sendData (params, transformed, preProcessed) {
  try {
    const response = await createProduct(
      params.COMMERCE_BASE_URL,
      params.COMMERCE_CONSUMER_KEY,
      params.COMMERCE_CONSUMER_SECRET,
      params.COMMERCE_ACCESS_TOKEN,
      params.COMMERCE_ACCESS_TOKEN_SECRET,
      transformed)

    return {
      success: true,
      message: response
    }
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.statusCode || HTTP_INTERNAL_ERROR,
      message: error.message

    }
  }
}

module.exports = {
  sendData
}
