import { getCommerceClient } from "@adobe/aio-commerce-lib-app";
import { resolveImsAuthParams } from "@adobe/aio-commerce-sdk/auth";

/**
 * This function call Adobe commerce rest API to create a customer group
 *
 * @returns - API response object
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function createCustomerGroup(params, data) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);
  return await client.post("customerGroups", {
    json: data,
  });
}

/**
 * This function call Adobe commerce rest API to update a customer group
 *
 * @returns - API response object
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function updateCustomerGroup(params, data) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);
  return await client.put(`customerGroups/${data.group.id}`, {
    json: data,
  });
}

/**
 * This function call Adobe commerce rest API to delete a customer group
 *
 * @returns - API response object
 * @param {object} params - Environment params from the IO Runtime request
 * @param {number} id - Id
 */
async function deleteCustomerGroup(params, id) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);
  return await client.delete(`customerGroups/${id}`);
}

export { createCustomerGroup, deleteCustomerGroup, updateCustomerGroup };
