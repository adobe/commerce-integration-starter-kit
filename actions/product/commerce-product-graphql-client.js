/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { GraphQLClient } = require("graphql-request");

const PRODUCTS_QUERY = `
  query GetProducts($pageSize: Int!, $currentPage: Int!) {
    products(search: "", pageSize: $pageSize, currentPage: $currentPage) {
      items {
        name
        sku
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        stock_status
      }
      total_count
    }
  }
`;
/**
 * Creates a GraphQL client
 *
 * @param {string} baseUrl - The GraphQL server endpoint
 * @param {object} headers - Headers for the client
 * @returns {object} - GraphQL client instance
 */
function createGraphqlClient(baseUrl, headers = {}) {
  if (typeof baseUrl !== "string") {
    throw new TypeError(
      `The "baseUrl" argument must be of type string. Received ${typeof baseUrl}`,
    );
  }

  return new GraphQLClient(baseUrl, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

/**
 * This function call Adobe commerce graphql to obtain products
 *
 * @returns {object} - Response object
 * @param {string} baseUrl - Adobe commerce graphql base url
 * @param {number} pageSize - Number of products to fetch per page
 * @param {number} currentPage - Current page number
 */
async function queryProducts(baseUrl, pageSize, currentPage) {
  const client = createGraphqlClient(baseUrl);

  return await client.request(PRODUCTS_QUERY, {
    pageSize,
    currentPage,
  });
}

module.exports = {
  queryProducts,
};
