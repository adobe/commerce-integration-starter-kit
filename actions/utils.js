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

/* This file exposes some common utilities for your actions */

const hidden = [
  'secret',
  'token'
]

/**
 * Returns a log ready string of the action input parameters.
 * The `Authorization` header content will be replaced by '<hidden>'.
 * Any parameter containing in the name a term in the 'hidden' array will be replaced by '<hidden>'.
 *
 * @param {object} params action input parameters.
 */
function stringParameters (params) {
  // hide authorization token without overriding params
  let headers = params.__ow_headers || {}
  if (headers.authorization) {
    headers = { ...headers, authorization: '<hidden>' }
  }

  // hide parameters including terms in the 'hidden' array
  let sanitizedParams = { ...params }
  for (const key of Object.keys(sanitizedParams)) {
    if (!hidden.every(v => { return key.toLowerCase().indexOf(v) === -1 })) {
      sanitizedParams = { ...sanitizedParams, [key]: '<hidden>' }
    }
  }

  // loop over params keys and replace if needed
  return JSON.stringify({ ...sanitizedParams, __ow_headers: headers })
}

/**
 * Returns a list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or `''`. Values of `0` or `null` are not considered as missing.
 *
 * @param {object} obj - The object to check.
 * @param {string[]} required The list of required keys. Supports nested keys using a `.` separator.
 * @example
 * ```js
 * getMissingKeys({ a: 1, b: 2 }, ['a', 'b.c']) // ['b.c']
 * ```
 */
function getMissingKeys (obj, required) {
  return required.filter(r => {
    const splits = r.split('.')
    const last = splits[splits.length - 1]

    const traverse = splits.slice(0, -1)
      .reduce((tObj, split) => (tObj[split] || {}), obj)

    return traverse[last] === undefined || traverse[last] === '' // missing default params are empty string
  })
}

/**
 * Ensures that the required parameters and headers are present in the request.
 * A parameter is missing if its value is undefined or `''`. Values of `0` or `null` are not considered as missing.
 *
 * It returns an error message if any of the required parameters or headers are missing.
 *
 * @param {object} params action input parameters.
 * @param {string[]} [requiredParams] list of required input parameters. Defaults to `[]`.
 * @param {string[]} [requiredHeaders] list of required input headers. Supports nested keys using a `.` separator. Defaults to `[]`.
 * @example
 * ```js
 * checkMissingRequestInputs({ a: 1, b: 2 }, ['a', 'b.c']) // 'missing parameter(s) 'b.c''
 * checkMissingRequestInputs({ a: 1, b: 2 }, ['a', 'b.c'], ['x-api-key']) // 'missing header(s) 'x-api-key''
 * checkMissingRequestInputs({ a: 1, b: 2 }, ['a', 'b.c'], ['x-api-key']) // 'missing header(s) 'x-api-key'' and 'missing parameter(s) 'b.c''
 * ```
 */
function checkMissingRequestInputs (
  params,
  requiredParams = [],
  requiredHeaders = []
) {
  let errorMessage = null

  // Convert to lowercase for case-insensitive comparison.
  const normalizedRequiredHeaders = requiredHeaders.map(h => h.toLowerCase())
  const missingHeaders = getMissingKeys(
    params.__ow_headers || {},
    normalizedRequiredHeaders
  )

  if (missingHeaders.length > 0) {
    errorMessage = `Missing header(s): [${missingHeaders.join(', ')}]`
  }

  // check for missing parameters
  const missingParams = getMissingKeys(params, requiredParams)
  if (missingParams.length > 0) {
    if (errorMessage) {
      errorMessage += ' and '
    } else {
      errorMessage = ''
    }
    errorMessage += `Missing parameter(s): [${missingParams.join(', ')}]`
  }

  return errorMessage
}

module.exports = {
  stringParameters,
  getMissingKeys,
  checkMissingRequestInputs
}
