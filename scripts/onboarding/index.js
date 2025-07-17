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

const ansis = require('ansis')
const { getAdobeAccessToken } = require('../../utils/adobe-auth')
const { makeError, formatError } = require('../lib/helpers/errors')
const { CommerceSdkValidationError } = require('@adobe/aio-commerce-lib-core/validation')

require('dotenv').config()

/**
 * Logs an error occurred during the onboarding process.
 * @param {'providers' | 'metadata' | 'registrations'} phase - The phase of the onboarding process where the error occurred.
 * @param {object} errorInfo - General information about the error.
 */
function logOnboardingError (phase, errorInfo) {
  const { label, reason, payload } = errorInfo
  const phaseLabels = {
    getAccessToken: 'GET_ACCESS_TOKEN',
    providers: 'PROVIDER_ONBOARDING',
    metadata: 'METADATA_ONBOARDING',
    registrations: 'REGISTRATIONS_ONBOARDING'
  }

  const additionalDetails = CommerceSdkValidationError.is(payload) && typeof payload?.display === 'function' ? `\n${payload.display()}` : payload
    ? formatError(payload)
    : 'No additional details'

  console.error(
    ansis.red('\nAn error occurred:\n'),
    ansis.bgRed(`\n ${phaseLabels[phase]} → ${label} \n`),
    ansis.red(`\nProcess of on-boarding (${phase}) failed:\n`),
    ansis.red(reason),
    ansis.red(`\nAdditional error details: ${additionalDetails}\n`)
  )
}

/**
 * Logs an error ocurred during the configure eventing process.
 * @param {object} errorInfo - General information about the error.
 */
function logConfigureEventingError (errorInfo) {
  const { label, reason, payload } = errorInfo
  const additionalDetails = payload
    ? formatError(payload)
    : 'No additional details'

  console.error(
    ansis.red('\nAn error occurred:\n'),
    ansis.bgRed(`\n CONFIGURE_EVENTING → ${label} \n`),
    ansis.red('\nProcess of configuring Adobe I/O Events module in Commerce failed:\n'),
    ansis.red(reason),
    ansis.red(`\nAdditional error details: ${additionalDetails}\n`)
  )
}

/**
 * This method handles the onboarding script, it creates the events providers, adds metadata to them, creates the registrations
 * and configures the Adobe I/O Events module in Commerce
 */
async function main () {
  console.log('Starting the process of on-boarding based on your registration choices')

  const registrations = require('./config/starter-kit-registrations.json')
  let accessToken;

  try {
    // resolve params
    const imsAuthParams = {
      clientId: process.env.AIO_COMMERCE_IMS_CLIENT_ID,
      clientSecrets: JSON.parse(process.env.AIO_COMMERCE_IMS_CLIENT_SECRETS),
      technicalAccountId: process.env.AIO_COMMERCE_IMS_TECHNICAL_ACCOUNT_ID,
      technicalAccountEmail: process.env.AIO_COMMERCE_IMS_TECHNICAL_ACCOUNT_EMAIL,
      imsOrgId: process.env.AIO_COMMERCE_IMS_IMS_ORG_ID,
      imsEnv: process.env.AIO_COMMERCE_IMS_ENV,
      ctx: process.env.AIO_COMMERCE_IMS_CTX,
      scopes: JSON.parse(process.env.AIO_COMMERCE_IMS_SCOPES)
    }

    accessToken = await getAdobeAccessToken(imsAuthParams);

  } catch (error) {
    if (error instanceof CommerceSdkValidationError) {
      logOnboardingError('getAccessToken', makeError(
          'INVALID_IMS_AUTH_PARAMS',
          'Missing or invalid environment variables for Adobe IMS authentication.',
          error
      ).error);
      return;
    }

    console.error(error);
    return;
  }

  console.log('Access token successfully generated:', accessToken)
  const createProvidersResult = await require('../lib/providers').main(registrations, process.env, accessToken);

  if (!createProvidersResult.success) {
    logOnboardingError('providers', createProvidersResult.error)
    return
  }

  const providers = createProvidersResult.result
  const createProvidersMetadataResult = await require('../lib/metadata').main(registrations, providers, process.env, result)

  if (!createProvidersMetadataResult.success) {
    logOnboardingError('metadata', createProvidersMetadataResult.error)
    return
  }

  const registerEntityEventsResult = await require('../lib/registrations').main(registrations, providers, process.env, result)
  if (!registerEntityEventsResult.success) {
    logOnboardingError('registrations', registerEntityEventsResult.error)
    return
  }

  console.log('Onboarding completed successfully:', providers)
  console.log('Starting the process of configuring Adobe I/O Events module in Commerce...')

  try {
    // eslint-disable-next-line node/no-missing-require,node/no-unpublished-require
    const workspaceConfiguration = require('./config/workspace.json')
    const commerceProvider = providers.find(provider => provider.key === 'commerce')
    const configureEventingResult = await require('../lib/configure-eventing').main(
      commerceProvider.id,
      commerceProvider.instanceId,
      workspaceConfiguration,
      process.env
    )

    if (!configureEventingResult.success) {
      logConfigureEventingError(configureEventingResult.error)
      return
    }
  } catch (error) {
    if (error?.code === 'MODULE_NOT_FOUND') {
      logConfigureEventingError(makeError(
        'MISSING_WORKSPACE_FILE',
        'The "workspace.json" file was not found.',
        {
          error,
          hints: [
            'Make sure the file exists in the "scripts/onboarding/config/workspace.json" directory',
            'See https://developer.adobe.com/commerce/extensibility/events/project-setup/#download-the-workspace-configuration-file for instructions on how to download the file.',
            'Also, make sure the file is named "workspace.json".'
          ]
        }
      ))

      return
    }

    logConfigureEventingError(makeError(
      'UNEXPECTED_ERROR',
      'An unexpected error occurred',
      { error }
    ))

    return
  }

  console.log('Process of configuring Adobe I/O Events module in Commerce completed successfully')
  return {
    providers,
    registrations: registerEntityEventsResult.registrations
  }
}

exports.main = main
