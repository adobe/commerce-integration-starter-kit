import { getCommerceClient } from "@adobe/aio-commerce-lib-app";
import { resolveImsAuthParams } from "@adobe/aio-commerce-sdk/auth";

/**
 * This function call Adobe commerce rest API to add a comment to an order
 *
 * @param {object} params - Environment params from the IO Runtime request
 * @param {number} orderId - order id
 * @param {object} data - Adobe commerce api payload
 */
async function addComment(params, orderId, data) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);
  return await client.post(`orders/${orderId}/comments`, {
    json: data,
  });
}

export { addComment };
