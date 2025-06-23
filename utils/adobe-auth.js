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

const chalk = require('chalk');
const { context, getToken } = require('@adobe/aio-lib-ims')

const isValidStringEnv = (arg) => typeof arg === 'string' && arg.trim().length > 0;

function logMissingParams(missingParams) {
    if (missingParams.length > 0) {
        const formattedParams = missingParams.map(param => `- ${param}`).join('\n');
        console.error(
            chalk.bgGray.whiteBright.bold('Missing or invalid environment variables:') +
            '\n' +
            chalk.bgRedBright.whiteBright(formattedParams)
        );
    }
}

function validateAdobeAuthParams(params) {
  const requiredParams = [
    { key: 'OAUTH_CLIENT_ID', value: params.OAUTH_CLIENT_ID },
    { key: 'OAUTH_CLIENT_SECRET', value: params.OAUTH_CLIENT_SECRET },
    { key: 'OAUTH_TECHNICAL_ACCOUNT_ID', value: params.OAUTH_TECHNICAL_ACCOUNT_ID },
    { key: 'OAUTH_TECHNICAL_ACCOUNT_EMAIL', value: params.OAUTH_TECHNICAL_ACCOUNT_EMAIL },
    { key: 'OAUTH_ORG_ID', value: params.OAUTH_ORG_ID }
  ];

  const missingParams = requiredParams
      .filter(param => !isValidStringEnv(param.value))
      .map(param => param.key);

  logMissingParams(missingParams);

  if (missingParams.length > 0) {
    throw new Error(`Adobe Auth validation failed. Missing params: ${missingParams.join(', ')}`);
  }
}

/**
 * Generate access token to connect with Adobe tools (e.g. IO Events)
 *
 * @param {object} params includes env parameters
 * @returns {string} returns the access token
 * @throws {Error} in case of any failure
 */
async function getAdobeAccessToken (params) {
  validateAdobeAuthParams(params);

  const ioManagementAPIScopes = ['AdobeID', 'openid', 'read_organizations', 'additional_info.projectedProductContext', 'additional_info.roles', 'adobeio_api', 'read_client_secret', 'manage_client_secrets']

  const config = {
    client_id: params.OAUTH_CLIENT_ID,
    client_secrets: [params.OAUTH_CLIENT_SECRET],
    technical_account_id: params.OAUTH_TECHNICAL_ACCOUNT_ID,
    technical_account_email: params.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
    ims_org_id: params.OAUTH_ORG_ID,
    scopes: ioManagementAPIScopes
  }

  await context.setCurrent('onboarding-config')
  await context.set('onboarding-config', config)

  return await getToken()
}

module.exports = {
  getAdobeAccessToken
}
