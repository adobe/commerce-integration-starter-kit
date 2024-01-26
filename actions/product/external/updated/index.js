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
const {stringParameters} = require("../../../utils");
const {transformData} = require("./transformer");
const {sendData} = require("./sender");
const {HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST} = require("../../../constants");
const {validateData} = require("./validator");
const {preProcess} = require("./pre");
const {postProcess} = require("./post");

async function main (params) {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    logger.info('[Product][External][Updated] Start processing request');
    logger.debug(`[Product][External][Updated] Action main params: ${stringParameters(params)}`);

    try {
        logger.debug(`[Product][External][Updated] Validate data: ${JSON.stringify(params.data)}`)
        const validation = validateData(params);
        if (!validation.success) {
            return {
                statusCode: HTTP_BAD_REQUEST,
                body: {
                    success: false,
                    error: validation.message
                }
            }
        }

        logger.debug(`[Product][External][Updated] Transform data: ${JSON.stringify(params)}`)
        const transformed = transformData(params);

        logger.debug(`[Product][External][Updated] Preprocess data: ${JSON.stringify(params)}`)
        const preProcessed = preProcess(params, transformed);

        logger.debug(`[Product][External][Updated] Start sending data: ${JSON.stringify(transformed)}`)
        const result = await sendData(params, transformed, preProcessed);

        logger.debug(`[Product][External][Updated] Postprocess data: ${JSON.stringify(params)}`)
        const postProcessed = postProcess(params, transformed, preProcessed, result)

        logger.debug('[Product][External][Updated] Process finished successfully');
        return {
            statusCode: HTTP_OK,
            body: {
                success: true
            }
        }
    } catch (error) {
        logger.error(`[Product][External][Updated] Error processing the request: ${error}`)
        return {
            statusCode: error.response?.statusCode || HTTP_INTERNAL_ERROR,
            body: {
                success: false,
                error: error.message
            }
        }
    }
}

exports.main = main
