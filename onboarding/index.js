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

const { getAdobeAccessToken } = require('../utils/adobe-auth')
require('dotenv').config()

/**
 * This method handle the onboarding script, it creates the events providers, add metadata to them and create the registrations
 *
 * @returns {object} - returns a response with provider and registrations info
 */
async function main () {
  console.log('Starting the process of on-boarding based on you registration choice')

  const registrations = require('./custom/registrations.json')

  const accessToken = await getAdobeAccessToken(process.env)

  const createProvidersResult = await require('./providers').main(registrations, process.env, accessToken)

  if (!createProvidersResult.success) {
    const errorMessage = `Process of on-boarding (providers) failed with error: ${createProvidersResult.error}`
    console.log(errorMessage)
    return {
      code: createProvidersResult.code,
      success: false,
      error: errorMessage
    }
  }

  const providers = createProvidersResult.result
  const createProvidersMetadataResult = await require('./metadata').main(registrations, providers, process.env, accessToken)

  if (!createProvidersMetadataResult.success) {
    const errorMessage = `Process of on-boarding (metadata) failed with error: ${createProvidersResult.error}`
    console.log(errorMessage)
    return {
      code: createProvidersResult.code,
      success: false,
      error: errorMessage
    }
  }

  const registerEntityEventsResult = await require('./registrations').main(registrations, providers, process.env, accessToken)
  if (!registerEntityEventsResult.success) {
    const errorMessage = `Process of on-boarding (registrations) failed with error: ${createProvidersResult.error}`
    console.log(errorMessage)
    return {
      code: createProvidersResult.code,
      success: false,
      error: errorMessage
    }
  }

  console.log('Process of On-Boarding done successfully:', providers)

  return {
    code: 200,
    success: true,
    providers,
    registrations: registerEntityEventsResult.registrations
  }
}

exports.main = main
