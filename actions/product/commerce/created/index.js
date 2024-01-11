const { Core } = require('@adobe/aio-sdk')
const {stringParameters} = require('../../../utils');
const {transformData} = require('./transformers')
const {sendData} = require("./sender");

async function main(params) {
    // create a Logger
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    logger.info('[Product][Commerce][Created] Start processing request');
    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(`[Product][Commerce][Created] Consumer main params: ${stringParameters(params)}`);

    try {
        // transform received data from commerce
        logger.debug(`[Product][Commerce][Created] Transform data: ${JSON.stringify(params.data)}`)

        const data = transformData(params.data);

        // Send data to 3rd party
        logger.debug(`[Product][Commerce][Created] Start sending data: ${JSON.stringify(data)}`)
        sendData(params, data);

        logger.debug('[Product][Commerce][Created] Process finished successfully');
        return {
            statusCode: 200,
            body: {
                success: true
            }
        }
    } catch (error) {
        logger.error(`[Product][Commerce][Created] Error processing the request: ${error.message}`)
        return {
            statusCode: 500,
            body: {
                success: false,
                error: [error.message]
            }
        }
    }
}

exports.main = main
