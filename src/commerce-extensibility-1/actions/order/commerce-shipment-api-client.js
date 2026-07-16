import { getCommerceClient } from "@adobe/aio-commerce-lib-app";
import { resolveImsAuthParams } from "@adobe/aio-commerce-sdk/auth";

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
  return await client.post(`order/${orderId}/ship`, {
    json: data,
  });
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
  return await client.post("shipment", {
    json: data,
  });
}

export { createShipment, updateShipment };
