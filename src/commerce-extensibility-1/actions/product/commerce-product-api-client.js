import { getCommerceClient } from "@adobe/aio-commerce-lib-app";
import { resolveImsAuthParams } from "@adobe/aio-commerce-sdk/auth";

/**
 * This function call Adobe commerce rest API to create a product
 *
 * @returns - API response object
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function createProduct(params, data) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);
  return await client.post("products", {
    json: data,
  });
}

/**
 * This function call Adobe commerce rest API to update a product
 *
 * @returns - API response object
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function updateProduct(params, data) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);
  return await client.put(`products/${data.product.sku}`, {
    json: data,
  });
}

/**
 * This function call Adobe commerce rest API to delete a product
 *
 * @returns - API response object
 * @param {object} params - Environment params from the IO Runtime request
 * @param {string} sku - Stock keeping unit
 */
async function deleteProduct(params, sku) {
  // App Management requires IMS. It's fine to only resolve IMS authentication.
  const imsAuthParams = resolveImsAuthParams(params);
  const client = await getCommerceClient(imsAuthParams);
  return await client.delete(`products/${sku}`);
}

export { createProduct, deleteProduct, updateProduct };
