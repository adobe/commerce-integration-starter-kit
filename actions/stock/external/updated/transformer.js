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
 * This function transform the received stock data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  const sourceItems = [];
  for (const stockUpdate of params.data) {
    sourceItems.push(transform(stockUpdate));
  }
  return {
    sourceItems,
  };
}

/**
 *
 * @param {object} stockUpdate - stock update for an sku in a source
 * @returns - transformed stock update
 */
function transform(stockUpdate) {
  return {
    sku: stockUpdate.sku,
    source_code: stockUpdate.source,
    quantity: stockUpdate.quantity,
    status: stockUpdate.outOfStock ? 0 : 1,
  };
}

module.exports = {
  transformData,
};
