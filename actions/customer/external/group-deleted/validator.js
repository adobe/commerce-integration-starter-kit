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

/**
 * This function validate the customer group data received from external back-office application
 *
 * @returns {object} - returns the result of validation object
 * @param {object} params - Received data from adobe commerce
 */
function validateData (params) {
  const data = params.data
  const ajv = new Ajv()
  const schema = require('./schema.json')

  const validate = ajv.compile(schema)
  const isValid = validate(data)
  if (!isValid) {
    return {
      success: false,
      message: `Data provided does not validate with the schema: ${(JSON.stringify(data))}`
    }
  }
  return {
    success: true
  }
}

module.exports = {
  validateData
}
