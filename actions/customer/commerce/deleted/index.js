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
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    logger.info('[Customer][Commerce][Deleted] Start processing request');
    logger.debug(`[Customer][Commerce][Deleted] Consumer main params: ${stringParameters(params)}`);

    try {
        logger.debug(`[Customer][Commerce][Deleted] Validate data: ${JSON.stringify(params.data)}`)
        validateData(params.data);

        logger.debug(`[Customer][Commerce][Deleted] Transform data: ${JSON.stringify(params.data)}`)
        const data = transformData(params.data);

        logger.debug(`[Customer][Commerce][Deleted] Start sending data: ${JSON.stringify(data)}`)
        await sendData(params, data);

        logger.debug('[Customer][Commerce][Deleted] Process finished successfully');
        return {
            statusCode: HTTP_OK,
            body: {
                action: 'deleted',
                success: true
            }
        }
    } catch (error) {
        logger.error(`[Customer][Commerce][Deleted] Error processing the request: ${error.message}`)
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
