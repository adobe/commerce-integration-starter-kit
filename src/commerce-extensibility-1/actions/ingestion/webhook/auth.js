/**
 * This method handles the authentication with an external backoffice application
 * @param {object} params include the parameters received in the runtime action
 * @returns success status and error message
 */
function checkAuthentication(params) {
  // @TODO implement the logic to check authetication with you external application
  // @TODO return { success: false, message: 'error message'} in case of failure

  return {
    success: true,
  };
}

export { checkAuthentication };
