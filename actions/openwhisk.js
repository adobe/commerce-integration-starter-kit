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
 
const openwhisk = require('openwhisk');
const {HTTP_INTERNAL_ERROR} = require("./constants");

class Openwhisk {
    #openwhiskClient;

    constructor(host, apiKey) {
        this.#openwhiskClient = openwhisk({apihost: host, api_key: apiKey});
    }

    async invokeAction(action, data) {
        return await this.#openwhiskClient.actions.invoke({
            name: action,
            blocking: true,
            params: {
                data
            }
        });
    }
}

module.exports = Openwhisk