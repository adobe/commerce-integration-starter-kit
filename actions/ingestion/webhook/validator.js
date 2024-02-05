const { checkMissingRequestInputs } = require('../../../actions/utils')

/**
 * Validate the event information
 *
 * @param {object} data event information
 * @param params
 * @returns {object} returns the success status and error message
 */
function validateData (params) {
  const requiredParams = ['data.uid', 'data.event', 'data.value']
  const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

  if (errorMessage) {
    return {
      success: false,
      message: errorMessage
    }
  }

  // @TODO Add any other validation you consider necessary here

  return {
    success: true
  }
}

module.exports = {
  validateData
}
