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

const Ajv = require("ajv");
const {Core} = require("@adobe/aio-sdk");

function validateData(params) {
    const logger = Core.Logger('validateData', { level: params.LOG_LEVEL || 'info' })
    const data = params.data

    logger.info(`Starting schema validation for data: ${JSON.stringify(data)}`)
    const ajv = new Ajv();
    const schema = require('./schema.json')

    logger.debug(`Compiling schema: ${JSON.stringify(schema)}`)
    const validate = ajv.compile(schema);

    logger.debug(`Validating schema: ${JSON.stringify(schema)}`)
    const isValid = validate(data);
    if (!isValid) {
        logger.error(`Data provided ${JSON.stringify(data)} does not validate with the schema`);
        return `Data provided ${JSON.stringify(data)} does not validate with the schema`
    }
    return null;
}

module.exports = {
    validateData
}