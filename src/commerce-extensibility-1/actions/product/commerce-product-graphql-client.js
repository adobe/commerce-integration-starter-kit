import { getCommerceInstance } from "@adobe/aio-commerce-lib-app";
import { GraphQLClient } from "graphql-request";

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
 * @returns - GraphQL client instance
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
 * @returns - Response object
 * @param {number} pageSize - Number of products to fetch per page
 * @param {number} currentPage - Current page number
 */
async function queryProducts(pageSize, currentPage) {
  const commerce = await getCommerceInstance();
  const baseUrl = `${commerce.baseUrl}/graphql`;

  const client = createGraphqlClient(baseUrl);
  return await client.request(PRODUCTS_QUERY, {
    pageSize,
    currentPage,
  });
}

export { queryProducts };
