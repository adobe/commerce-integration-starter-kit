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

const { getAdobeAccessToken } = require('../../utils/adobe-auth')
require('dotenv').config()

/**
 * This method handle the onboarding script, it creates the events providers, add metadata to them, create the registrations
 * and configures the Adobe I/O Events module in Commerce
 *
 * @returns {object} - returns a response with provider and registrations info
 */
async function main () {
  console.log('Starting the process of on-boarding based on you registration choice')

  const registrations = require('./config/starter-kit-registrations.json')

  const accessToken = await getAdobeAccessToken(process.env)

  const createProvidersResult = await require('../lib/providers').main(registrations, process.env, accessToken)

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
  const createProvidersMetadataResult = await require('../lib/metadata').main(registrations, providers, process.env, accessToken)

  if (!createProvidersMetadataResult.success) {
    const errorMessage = `Process of on-boarding (metadata) failed with error: ${createProvidersResult.error}`
    console.log(errorMessage)
    return {
      code: createProvidersResult.code,
      success: false,
      error: errorMessage
    }
  }

  const registerEntityEventsResult = await require('../lib/registrations').main(registrations, providers, process.env, accessToken)
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

  console.log('Starting the process of configuring Adobe I/O Events module in Commerce')
  try {
    // node/no-missing-require
    // eslint-disable-next-line node/no-missing-require,node/no-unpublished-require
    const workspaceConfiguration = require('./config/workspace.json')
    const commerceProvider = providers.find(provider => provider.key === 'commerce')
    const configureEventingResult = await require('../lib/configure-eventing').main(
      commerceProvider.id,
      commerceProvider.instanceId,
      workspaceConfiguration,
      process.env)
    if (!configureEventingResult.success) {
      let errorMessage = `The configuration process of the Adobe I/O Events module failed with error: ${configureEventingResult.error}`
      if (configureEventingResult.error.includes('Response code 404 (Not Found)')) {
        errorMessage += ' - Make sure the latest version of the Adobe I/O Events module (see https://developer.adobe.com/commerce/extensibility/events/release-notes/) is installed and enabled in Commerce (see https://developer.adobe.com/commerce/extensibility/events/installation/). If the module cannot be updated to the latest version, you can manually configure the Adobe I/O Events module in the Commerce Admin console (see https://developer.adobe.com/commerce/extensibility/events/configure-commerce/)'
      }
      console.log(errorMessage)
      return {
        code: configureEventingResult.code,
        success: false,
        error: errorMessage
      }
    }
  } catch (error) {
    if (error?.code === 'MODULE_NOT_FOUND') {
      console.log('The configuration process of the Adobe I/O Events module failed with error: "workspace.json" file not found. Make sure the file exists in the "scripts/onboarding/config/workspace.json" directory (see https://developer.adobe.com/commerce/extensibility/events/project-setup/#download-the-workspace-configuration-file for instructions on how to download the file. Also, make sure the file is named "workspace.json")')
      return {
        code: 500,
        success: false,
        error: error.message
      }
    }

    console.log(`The configuration process of the Adobe I/O Events module failed with error: ${error}`)
    return {
      code: 500,
      success: false,
      error: error.message
    }
  }
  console.log('Process of configuring Adobe I/O Events module in Commerce completed successfully')

  return {
    code: 200,
    success: true,
    providers,
    registrations: registerEntityEventsResult.registrations
  }
}

exports.main = main
