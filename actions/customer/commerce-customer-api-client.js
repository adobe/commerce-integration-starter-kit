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

const { getClient } = require("../http-client");
const { Core } = require("@adobe/aio-sdk");
const logger = Core.Logger("commerce-consumer-api-client", { level: "info" });

/**
 * This function call Adobe commerce rest API to create a customer
 *
 * @returns - API response object
 * @param {string} baseUrl - Adobe commerce rest api base url
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function createCustomer(baseUrl, params, data) {
  const client = await getClient(
    {
      url: baseUrl,
      params,
    },
    logger,
  );

  return await client.post("customers", JSON.stringify(data), {
    "Content-Type": "application/json",
  });
}

/**
 * This function call Adobe commerce rest API to update a customer
 *
 * @returns - API response object
 * @param {string} baseUrl - Adobe commerce rest api base url
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function updateCustomer(baseUrl, params, data) {
  const client = await getClient(
    {
      url: baseUrl,
      params,
    },
    logger,
  );
  return await client.put(
    `customers/${data.customer.id}`,
    JSON.stringify(data),
    { "Content-Type": "application/json" },
  );
}

/**
 * This function call Adobe commerce rest API to delete a customer
 *
 * @returns - API response object
 * @param {string} baseUrl - Adobe commerce rest api base url
 * @param {object} params - Environment params from the IO Runtime request
 * @param {number} id - Id
 */
async function deleteCustomer(baseUrl, params, id) {
  const client = await getClient(
    {
      url: baseUrl,
      params,
    },
    logger,
  );
  return await client.delete(`customers/${id}`);
}

module.exports = {
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
