/**
 * This method check the stock of received items in an external backoffice application
 * @param {object} params include the parameters received in the runtime action
 * @returns success status and error message
 */
async function checkAvailableStock(params) {
  // @TODO implement the logic to check authentication with you external application
  // @TODO return { success: false, message: 'error message'} in case of failure

  return {
    success: true,
  };
}

export { checkAvailableStock };
