/**
 * This function send the product created dara to the external back-office application
 *
 * @param {object} params - include the env params
 * @param {object} data - Product data
 * @param {object} preProcessed - result of the pre-process logic if any
 * @returns {Promise<
 *   | { success: true }
 *   | { success: false, statusCode: number, message: string }
 * >} Result consumed by the action's `main`: `success` gates the flow, and on
 *   failure `statusCode`/`message` are forwarded to the error response. This stub
 *   only returns the success variant; return the failure variant (see the @TODO
 *   below) once real send logic is added.
 */
async function sendData(params, data, preProcessed) {
  // @TODO Here add the logic to send the information to 3rd party
  // @TODO Use params to retrieve need parameters from the environment
  // @TODO in case of error return { success: false, statusCode: <error status code>, message: '<error message>' }

  return {
    success: true,
  };
}

export { sendData };
