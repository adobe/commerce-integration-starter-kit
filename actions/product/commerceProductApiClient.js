/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */

const {getCommerceOauthClient} = require("../oauth1a");

async function createProduct(baseUrl, consumerKey, consumerSecret, accessToken, accessTokenSecret, data, logger) {
    const client = getCommerceOauthClient(
        {
            url: baseUrl,
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
        },
        logger
    )

    return await client.post(
        'products',
        JSON.stringify(data),
        '',
        {'Content-Type': 'application/json'}
    )
}

async function updateProduct(baseUrl, consumerKey, consumerSecret, accessToken, accessTokenSecret, data, logger) {
    const client = getCommerceOauthClient(
        {
            url: baseUrl,
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
        },
        logger
    )
    return await client.put(
        `products/${data.product.sku}`,
        JSON.stringify(data),
        '',
        {'Content-Type': 'application/json'}
    )
}

async function deleteProduct(baseUrl, consumerKey, consumerSecret, accessToken, accessTokenSecret, sku, logger) {
    const client = getCommerceOauthClient(
        {
            url: baseUrl,
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
        },
        logger
    )
    return await client.delete(`products/${sku}`)
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct
}
