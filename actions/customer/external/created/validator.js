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
const Ajv = require('ajv')
const { Core } = require('@adobe/aio-sdk')

/**
 * This function validate the customer data received from external back-office application
 *
 * @returns {object} - returns the result of validation object
 * @param {object} params - Received data from adobe commerce
 */
function validateData (params) {
  const logger = Core.Logger('validateData', { level: params.LOG_LEVEL || 'info' })
  const data = params.data
  const dataJson = JSON.stringify(data)

  logger.info(`Starting schema validation for data: ${dataJson}`)
  const ajv = new Ajv()
  const schema = require('./schema.json')
  const schemaJson = JSON.stringify(schema)

  logger.debug(`Compiling schema: ${schemaJson}`)
  const validate = ajv.compile(schema)

  logger.debug(`Validating schema: ${schemaJson}`)
  const isValid = validate(data)
  if (!isValid) {
    logger.error(`Data provided ${dataJson} does not validate with the schema`)
    return {
      success: false,
      message: `Data provided ${dataJson} does not validate with the schema`
    }
  }
  return {
    success: true
  }
}

module.exports = {
  validateData
}
