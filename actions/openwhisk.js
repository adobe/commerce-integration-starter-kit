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