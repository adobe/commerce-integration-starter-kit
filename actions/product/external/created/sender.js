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

const {Core} = require("@adobe/aio-sdk");
const {createProduct} = require("../../commerceProductApiClient");

async function sendData(params, transformed, preProcessed) {
    const logger = Core.Logger('sendData', {level: params.LOG_LEVEL || 'info'})

    return await createProduct(
        params.COMMERCE_BASE_URL,
        params.COMMERCE_CONSUMER_KEY,
        params.COMMERCE_CONSUMER_SECRET,
        params.COMMERCE_ACCESS_TOKEN,
        params.COMMERCE_ACCESS_TOKEN_SECRET,
        transformed,
        logger)
}

module.exports = {
    sendData
}
