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

const { Core } = require('@adobe/aio-sdk')
const {stringParameters} = require('../../../utils');
const {transformData} = require('./transformer')
const {sendData} = require("./sender");
const {HTTP_OK, HTTP_INTERNAL_ERROR} = require("../../../constants");
const {validateData} = require("./validator");

async function main(params) {
    // create a Logger
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    logger.info('[Product][Commerce][Updated] Start processing request');
    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(`[Product][Commerce][Updated] Consumer main params: ${stringParameters(params)}`);

    try {
        // validate received data from commerce
        logger.debug(`[Product][Commerce][Updated] Validate data: ${JSON.stringify(params.data)}`)
        validateData(params.data);

        // transform received data from commerce
        logger.debug(`[Product][Commerce][Updated] Transform data: ${JSON.stringify(params.data)}`)

        const data = transformData(params.data);

        // Send data to 3rd party
        logger.debug(`[Product][Commerce][Updated] Start sending data: ${JSON.stringify(data)}`)
        sendData(params, data);

        logger.debug('[Product][Commerce][Updated] Process finished successfully');
        return {
            statusCode: HTTP_OK,
            body: {
                action: 'updated',
                success: true
            }
        }
    } catch (error) {
        logger.error(`[Product][Commerce][Updated] Error processing the request: ${error.message}`)
        return {
            statusCode: HTTP_INTERNAL_ERROR,
            body: {
                success: false,
                error: [error.message]
            }
        }
    }
}

exports.main = main
