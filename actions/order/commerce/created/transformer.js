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

/**
 * This function transform the received order data from Adobe commerce to external back-office application
 *
 * @param {object} data - Data received from Adobe commerce
 * @returns {object} - Returns transformed data object
 */
function transformData (data) {
  // @TODO Here transform the data as needed for 3rd party API
  const transformedData = data

  return transformedData
}

module.exports = {
  transformData
}
