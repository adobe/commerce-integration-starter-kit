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
 *
 * Returns a log ready string of the action input parameters.
 * The `Authorization` header content will be replaced by '<hidden>'.
 * Any parameter containing in the name a term in the 'hidden' array will be replaced by '<hidden>'.
 *
 * @param {object} params action input parameters.
 * @returns {string} - returns a json string
 */
function stringParameters (params) {
  // hide authorization token without overriding params
  let headers = params.__ow_headers || {}
  if (headers.authorization) {
    headers = { ...headers, authorization: '<hidden>' }
  }
  // hide parameters including terms in the 'hidden' array
  for (const key of Object.keys(params)) {
    if (!hidden.every(v => { return key.toLowerCase().indexOf(v) === -1 })) {
      params = { ...params, [key]: '<hidden>' }
    }
  }

  // loop over params keys and replace if needed
  return JSON.stringify({ ...params, __ow_headers: headers })
}

/**
 *
 * Returns the list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {object} obj object to check.
 * @param {array} required list of required keys.
 *        Each element can be multi level deep using a '.' separator e.g. 'myRequiredObj.myRequiredKey'
 *
 * @returns {array}
 * @private
 */
function getMissingKeys (obj, required) {
  return required.filter(r => {
    const splits = r.split('.')
    const last = splits[splits.length - 1]
    const traverse = splits.slice(0, -1)
      .reduce((tObj, split) => {
        tObj = (tObj[split] || {})
        return tObj
      }, obj)
    return traverse[last] === undefined || traverse[last] === '' // missing default params are empty string
  })
}

/**
 *
 * Returns the list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {object} params action input parameters.
 * @param {Array} requiredParams list of required input parameters.
 * @param {Array} requiredHeaders list of required input headers.
 * Each element can be multi level deep using a '.' separator e.g. 'myRequiredObj.myRequiredKey'.
 * @returns {string|null} if the return value is not null, then it holds an error message describing the missing inputs.
 */
function checkMissingRequestInputs (
  params, requiredParams = [], requiredHeaders = []) {
  let errorMessage = null

  // input headers are always lowercase
  requiredHeaders = requiredHeaders.map(h => h.toLowerCase())
  // check for missing headers
  const missingHeaders = getMissingKeys(params.__ow_headers || {},
    requiredHeaders)
  if (missingHeaders.length > 0) {
    errorMessage = `missing header(s) '${missingHeaders}'`
  }

  // check for missing parameters
  const missingParams = getMissingKeys(params, requiredParams)
  if (missingParams.length > 0) {
    if (errorMessage) {
      errorMessage += ' and '
    } else {
      errorMessage = ''
    }
    errorMessage += `missing parameter(s) '${missingParams}'`
  }

  return errorMessage
}

module.exports = {
  stringParameters,
  checkMissingRequestInputs
}
