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

/**
 * This is the consumer of the events coming from Adobe Commerce related to product entity.
 */
const {Core} = require('@adobe/aio-sdk')
const {errorResponse, stringParameters, checkMissingRequestInputs} = require('../../../utils')
const {HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR} = require("../../../constants");
const Openwhisk = require("../../../openwhisk");

const createProduct = async (client, data) => {

    try {
        return await client.actions.invoke({
            name: "product-commerce/created",
            blocking: true,
            params: {
                data
            }
        });
    } catch (e) {
        return {
            success: false,
            error: e.message
        }
    }
}

const updateProduct = async (client, data) => {

    try {
        return await client.actions.invoke({
            name: "product-commerce/updated",
            blocking: true,
            params: {
                data
            }
        });
    } catch (e) {
        return {
            success: false,
            error: e.message
        }
    }
}

const deleteProduct = async (client, data) => {

    try {
        return await client.actions.invoke({
            name: "product-commerce/deleted",
            blocking: true,
            params: {
                data
            }
        });
    } catch (e) {
        return {
            success: false,
            error: e.message
        }
    }
}

async function main(params) {
    try {
        const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH);
        const logger = Core.Logger('main', {level: params.LOG_LEVEL || 'info'});

        let response = {};
        let statusCode = HTTP_OK;

        logger.info('[Product][Commerce][Consumer] Start processing request');
        logger.debug(`[Product][Commerce][Consumer] Consumer main params: ${stringParameters(params)}`);

        const requiredParams = ['type', 'data.value.created_at', 'data.value.updated_at']
        const errorMessage = checkMissingRequestInputs(params, requiredParams, []);

        if (errorMessage) {
            logger.error(`[Product][Commerce][Consumer] Invalid request parameters: ${stringParameters(params)}`);
            return errorResponse(HTTP_BAD_REQUEST, errorMessage, logger);
        }

        logger.info('[Product][Commerce][Consumer] Params type: ' + params.type);

        switch (params.type) {
            case "com.adobe.commerce.observer.catalog_product_save_commit_after":
                const createdAt = Date.parse(params.data.value.created_at);
                const updatedAt = Date.parse(params.data.value.updated_at);
                if (createdAt === updatedAt) {
                    logger.info('[Product][Commerce][Consumer] Invoking created product');

                    const res = await openwhiskClient.invokeAction("product-commerce/created", params.data.value);
                    response = res?.response?.result?.body;
                    statusCode = res?.response?.result?.statusCode;
                } else {
                    logger.info('[Product][Commerce][Consumer] Invoking update product');
                    const res = await openwhiskClient.invokeAction("product-commerce/updated", params.data.value);
                    response = res?.response?.result?.body;
                    statusCode = res?.response?.result?.statusCode;
                }
                break;
            case "com.adobe.commerce.observer.catalog_product_delete_commit_after":
                logger.info('[Product][Commerce][Consumer] Invoking delete product');
                const res = await openwhiskClient.invokeAction("product-commerce/deleted", params.data.value);
                response = res?.response?.result?.body;
                statusCode = res?.response?.result?.statusCode;
                break;
            default:
                logger.error(`[Product][Commerce][Consumer] type not found: ${params.type}`);
                response = `This case type is not supported: ${params.type}`;
                statusCode = HTTP_BAD_REQUEST;
                break;
        }

        logger.info(`[Product][Commerce][Consumer] ${statusCode}: successful request`)
        return {
            statusCode: statusCode,
            body: {
                type: params.type,
                request: params.data.value,
                response
            }
        }
    } catch (error) {
        return errorResponse(HTTP_INTERNAL_ERROR, `[Product][Commerce][Consumer] Server error: ${error.message}`, logger)
    }
}

exports.main = main
