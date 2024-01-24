const {checkMissingRequestInputs, stringParameters, errorResponse} = require("../actions/utils");
const eventsMap = require("./events-mapping.json");
const {getRegistrationName} = require("../utils/naming");

function validateData(data, eventsMap, registrationName) {
    const requiredParams = ['entity', 'event', 'value']
    const errorMessage = checkMissingRequestInputs(data, requiredParams, []);

    if (errorMessage) {
        return {
            success: false,
            message: `Invalid payload parameters: ${stringParameters(data)}`
        }
    }

    if (!eventsMap.hasOwnProperty(data.event)) {
        return {
            success: false,
            message: `Event not found: ${data.event}`
        }
    }

    if (!eventsMap.hasOwnProperty(registrationName)) {
        return {
            success: false,
            message: `Provider not found entity: ${data.entity}`
        }
    }

    return {
        success: true
    }
}

module.exports = {
    validateData
}