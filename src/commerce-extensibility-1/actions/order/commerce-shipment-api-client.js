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

const { getCommerceClient } = require("@adobe/aio-commerce-lib-app");
const { resolveImsAuthParams } = require("@adobe/aio-commerce-sdk/auth");

/**
 * This function call Adobe commerce rest API to create a shipment
 *
 * @param {object} params - Environment params from the IO Runtime request
 * @param {string} orderId - Adobe commerce order id
 * @param {object} data - Adobe commerce api payload
 */
async function createShipment(params, orderId, data) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);

  return await client.post(`order/${orderId}/ship`, { json: data });
}

/**
 * This function call Adobe commerce rest API to update a shipment
 *
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function updateShipment(params, data) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);

  return await client.post("shipment", { json: data });
}

module.exports = {
  createShipment,
  updateShipment,
};
