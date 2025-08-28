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

const {
  assertImsAuthParams,
  getImsAuthProvider,
} = require("@adobe/aio-commerce-lib-auth");

const {
  CommerceSdkValidationError,
} = require("@adobe/aio-commerce-lib-core/error");

const v = require("valibot");

const JsonArray = v.message(
  v.pipe(
    v.string("Expected a JSON string"),
    v.nonEmpty(),
    v.parseJson(),
    v.array(v.string()),
  ),
  "Oopsie",
);

const SIMPLE_STRING_REGEX = /^[\w-]+(,\s*[\w-]+)*$/;
const ValidSimpleString = v.regex(
  SIMPLE_STRING_REGEX,
  "Scopes must be comma-separated values containing only letters, numbers, underscores, and hyphens",
);

const SimpleStringArray = v.pipe(
  v.string(),
  ValidSimpleString,
  v.transform((value) => {
    if (value.includes(",")) {
      return value.split(",").map((s) => s.trim());
    }

    return [value.trim()];
  }),
  v.array(v.string()),
);

const ScopesSchema = v.message(
  v.union([JsonArray, SimpleStringArray, v.array(v.string())]),
  "scopes only valid Array, Json or comma-separated string are supported",
);

function resolveScopes(scopes) {
  const result = v.safeParse(ScopesSchema, scopes);

  if (result.success) {
    return result.output;
  }

  throw new CommerceSdkValidationError("Invalid scopes format", {
    issues: result.issues,
  });
}

/**
 * Resolve IMS configuration from environment parameters
 * @param {object} params - Environment parameters containing ImsAuth configuration
 * @returns IMS authentication configuration object
 */
function resolveImsConfig(params) {
  // scopes will be defaulted to empty array if not provided
  // this will lead to the CommerceSdkValidationError error
  const scopes = params.OAUTH_SCOPES
    ? (resolveScopes(params.OAUTH_SCOPES) ?? [])
    : [];

  return {
    clientId: params.OAUTH_CLIENT_ID,
    clientSecrets: params.OAUTH_CLIENT_SECRET
      ? [params.OAUTH_CLIENT_SECRET]
      : [],
    technicalAccountId: params.OAUTH_TECHNICAL_ACCOUNT_ID,
    technicalAccountEmail: params.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
    imsOrgId: params.OAUTH_ORG_ID,
    scopes,
    environment: params.AIO_CLI_ENV || "prod",
  };
}

/**
 * Generate access token to connect with Adobe tools (e.g. IO Events)
 * @param {object} params includes env parameters
 * @returns the access token
 */
function getAdobeAccessToken(params) {
  const config = resolveImsConfig(params);

  assertImsAuthParams(config);
  const imsAuthProvider = getImsAuthProvider(config);

  return imsAuthProvider.getAccessToken();
}

/**
 * Get the access token headers for Adobe tools (e.g. IO Events)
 * @param {object} params - IMS authentication parameters
 * @returns the headers with access token
 */
function getAdobeAccessHeaders(params) {
  const config = resolveImsConfig(params);
  assertImsAuthParams(config);
  const imsAuthProvider = getImsAuthProvider(config);

  return imsAuthProvider.getHeaders();
}

module.exports = {
  getAdobeAccessToken,
  getAdobeAccessHeaders,
  resolveScopes,
};
