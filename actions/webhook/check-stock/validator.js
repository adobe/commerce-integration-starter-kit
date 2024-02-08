const { checkMissingRequestInputs } = require('../../../actions/utils')

/**
 * Validate the received information
 *
 * @param {object} params input parameters
 * @returns {object} returns the success status and error message
 */
function validateData (params) {
  const requiredParams = ['data.cart_id', 'data.items']
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
