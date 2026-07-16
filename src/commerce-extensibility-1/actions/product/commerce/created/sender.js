/**
 * This function send the product created dara to the external back-office application
 *
 * @param {object} params - include the env params
 * @param {object} data - Product data
 * @param {object} preProcessed - result of the pre-process logic if any
 * @returns the sending result if needed for post process
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
