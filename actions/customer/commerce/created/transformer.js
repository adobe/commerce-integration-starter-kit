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

const { instrument, getInstrumentationHelpers } = require('@adobe/aio-sk-lib-telemetry')

/**
 * This function transform the received customer data from Adobe commerce to external back-office application
 *
 * @param {object} data - Data received from Adobe commerce
 * @returns {object} - Returns transformed data object
 */
function transformData (data) {
  // @Todo Here transform the data as needed for external back-office application API
  const { currentSpan } = getInstrumentationHelpers()
  currentSpan.addEvent('created.phase', { value: 'transformData' })

  const transformedData = data
  return transformedData
}

module.exports = {
  transformData: instrument(transformData)
}
