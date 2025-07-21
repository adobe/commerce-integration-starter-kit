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
const { getAdobeAccessHeaders } = require('../../utils/adobe-auth')
const { makeError, formatError } = require('../lib/helpers/errors')
const { CommerceSdkValidationError } = require('@adobe/aio-commerce-lib-core/error')
const v = require('valibot');

require('dotenv').config()

/**
 * Logs an error occurred during the onboarding process
 * @param {'getAccessToken' | 'providers' | 'metadata' | 'registrations'} phase - The phase of the onboarding process where the error occurred
 * @param {{label: string, reason: string, payload?: any}} errorInfo - Error information object with label, reason, and optional payload
 * @returns {void}
 */
function logOnboardingError (phase, errorInfo) {
  const { label, reason, payload } = errorInfo
  const phaseLabels = {
    environment: 'ENVIRONMENT_ONBOARDING',
    getAccessToken: 'GET_ACCESS_TOKEN',
    providers: 'PROVIDER_ONBOARDING',
    metadata: 'METADATA_ONBOARDING',
    registrations: 'REGISTRATIONS_ONBOARDING'
  }

  const additionalDetails = CommerceSdkValidationError.isSdkError(payload) && typeof payload?.display === 'function'
    ? `\n${payload.display()}`
    : payload
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
 * Logs an error occurred during the configure eventing process
 * @param {{label: string, reason: string, payload?: any}} errorInfo - Error information object with label, reason, and optional payload
 * @returns {void}
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

const StringSchema = v.pipe(
    v.string(),
    v.nonEmpty('The string should contain at least one character.')
);

const ProcessEnvSchema = v.object({
  IO_CONSUMER_ID: StringSchema,
  IO_PROJECT_ID: StringSchema,
  IO_WORKSPACE_ID: StringSchema,
})

/**
 * Main onboarding function that creates events providers, adds metadata, creates registrations, and configures Adobe I/O Events module in Commerce
 * @returns {Promise<{providers: Array<{key: string, id: string, instanceId: string, label: string}>, registrations: Array} | void>} Object with providers and registrations on success, or void on error
 */
async function main () {

  const environmentResult = v.safeParse(ProcessEnvSchema, process.env);

  if (!environmentResult.success) {
    const error = new CommerceSdkValidationError(
        "Invalid environment variables", {
          issues: environmentResult.issues
        });
    logOnboardingError('environment', makeError(
        'INVALID_ENV_VARS',
        'Missing or invalid environment variables for Onboarding script.',
        error
    ).error)
    return
  }

  console.log('Starting the process of on-boarding based on your registration choices')

  const registrations = require('./config/starter-kit-registrations.json')
  let authHeaders

  try {
    // resolve params
    authHeaders = await getAdobeAccessHeaders({
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecrets: [process.env.OAUTH_CLIENT_SECRET],
      technicalAccountId: process.env.OAUTH_TECHNICAL_ACCOUNT_ID,
      technicalAccountEmail: process.env.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
      imsOrgId: process.env.OAUTH_ORG_ID
    })
  } catch (error) {
    if (error instanceof CommerceSdkValidationError) {
      logOnboardingError('getAccessToken', makeError(
        'INVALID_IMS_AUTH_PARAMS',
        'Missing or invalid environment variables for Adobe IMS authentication.',
        error
      ).error)
      return
    }

    console.error(error)
    return
  }

  const createProvidersResult = await require('../lib/providers').main(registrations, process.env, authHeaders)

  if (!createProvidersResult.success) {
    logOnboardingError('providers', createProvidersResult.error)
    return
  }

  const providers = createProvidersResult.result
  const createProvidersMetadataResult = await require('../lib/metadata').main(registrations, providers, process.env, authHeaders)

  if (!createProvidersMetadataResult.success) {
    logOnboardingError('metadata', createProvidersMetadataResult.error)
    return
  }

  const registerEntityEventsResult = await require('../lib/registrations').main(registrations, providers, process.env, authHeaders)
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
