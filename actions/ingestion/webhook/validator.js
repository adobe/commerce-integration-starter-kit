const { checkMissingRequestInputs } = require('../../../actions/utils')

/**
 * Validate the event information
 *
 * @param {object} data event information
 * @returns {object} returns the success status and error message
 */
function validateData (data) {
  const requiredParams = ['uid', 'event', 'value']
  const errorMessage = checkMissingRequestInputs(data, requiredParams, [])

  if (errorMessage) {
    return {
      success: false,
      message: errorMessage
    }
  }

  return {
    success: true
  }
}

module.exports = {
  validateData
}
