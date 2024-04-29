/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
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

  const registrations = require('./custom/starter-kit-registrations.json')

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
