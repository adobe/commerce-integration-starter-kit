/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { Core } = require('@adobe/aio-sdk')
const { stringParameters } = require('../../../utils')
const { HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST } = require('../../../constants')
const { actionErrorResponse, actionSuccessResponse } = require('../../../responses')
const { queryProducts } = require('../../commerce-product-graphql-client')
const { validateData } = require('./validator')
const { transformData } = require('./transformer')
const { preProcess } = require('./pre')
const { sendData } = require('./sender')
const { postProcess } = require('./post')

/**
 * This action is on charge of obtaining product information from Adobe Commerce and send it to external back-office application
 *
 * @param {object} params - includes the env params and configuration
 * @returns {object} returns response object with status code and result
 */
async function main (params) {
  const logger = Core.Logger('product-commerce-full-sync', { level: params.LOG_LEVEL || 'info' })

  logger.info('Start processing product full sync')

  try {
    logger.debug(`Received params: ${stringParameters(params)}`)

    const pageSize = params.pageSize ?? 20
    let currentPage = 1
    let totalPages = 1
    const results = []
    let hasErrors = false

    while (currentPage <= totalPages) {
      logger.info(`Fetching products page ${currentPage}`)

      const pageResult = await processPage(params, pageSize, currentPage, logger)
      results.push(pageResult)

      if (!pageResult.success) {
        hasErrors = true
      }

      if (currentPage === 1 && pageResult.totalCount) {
        totalPages = Math.ceil(pageResult.totalCount / pageSize)
        logger.info(`Total products: ${pageResult.totalCount}, Total pages: ${totalPages}`)
      }

      currentPage++
    }

    const message = `Sync process ${hasErrors ? 'completed with some errors' : 'completed successfully'}. ` +
        `Processed ${results.length} pages: ${results.filter(item => item.success).length} succeeded, ` +
        `${results.filter(item => !item.success).length} failed. ` +
        `Results: ${JSON.stringify(results.map(({ totalCount, ...rest }) => rest))}`

    logger.info('Product sync completed successfully')
    return actionSuccessResponse(message)
  } catch (error) {
    logger.error(`Error processing the request: ${error.message}`)
    return actionErrorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

/**
 * Processes a single page of products
 *
 * @param {object} params - Environment parameters
 * @param {number} pageSize - Number of items per page
 * @param {number} currentPage - Current page number
 * @param {object} logger - Logger instance for logging operations
 * @returns {object} Result of the page processing
 */
async function processPage (params, pageSize, currentPage, logger) {
  try {
    const response = await queryProducts(params.COMMERCE_GRAPHQL_ENDPOINT, pageSize, currentPage)
    logger.debug(`Raw GraphQL response: ${JSON.stringify(response)}`)

    if (response.errors) {
      throw new Error(`GraphQL query failed: ${JSON.stringify(response.errors[0].message)}`)
    }

    logger.debug(`Validate data: ${JSON.stringify(response)}`)
    const validation = validateData(response)
    if (!validation.success) {
      return createResult(currentPage, false, validation.message, HTTP_BAD_REQUEST)
    }

    const { items, total_count: totalCount } = response.products

    logger.info(`Successfully fetched products for page ${currentPage}. Found ${items.length} products.`)

    logger.debug(`Transform data: ${JSON.stringify(items)}`)
    const transformedData = transformData(items)

    logger.debug(`Preprocess data: ${JSON.stringify(items)}`)
    const preProcessed = preProcess(items, transformedData)

    logger.debug(`Start sending data: ${JSON.stringify(items)}`)
    const result = await sendData(params, transformedData, preProcessed)
    if (!result.success) {
      return createResult(currentPage, false, result.message, result.statusCode)
    }

    logger.debug(`Postprocess data: ${JSON.stringify(items)}`)
    postProcess(items, transformedData, preProcessed, result)

    return createResult(currentPage, true, null, null, totalCount)
  } catch (error) {
    logger.error(`Error processing page ${currentPage}: ${error.message}`)
    return createResult(currentPage, false, error.message, HTTP_INTERNAL_ERROR)
  }
}

/**
 * Creates a result object for a page
 *
 * @param {number} page - Page number
 * @param {boolean} success - Whether the page processing was successful
 * @param {string} [message] - Error message if any
 * @param {number} [statusCode] - HTTP status code if any
 * @param {number} [totalCount] - Total count of products (only for the first page)
 * @returns {object} Result object
 */
function createResult (page, success, message, statusCode, totalCount) {
  const result = { page, success }
  if (message) result.message = message
  if (statusCode) result.statusCode = statusCode
  if (totalCount) result.totalCount = totalCount
  return result
}

exports.main = main
