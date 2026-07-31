import { checkMissingRequestInputs } from "#lib/utils";

/**
 * This function validate the customer group data received
 *
 * @param {object} data - Received data from adobe commerce
 * @returns the result of validation object
 */
function validateData(data) {
  const requiredParams = ["customer_group_code"];
  const errorMessage = checkMissingRequestInputs(data, requiredParams, []);
  if (errorMessage) {
    return {
      message: errorMessage,
      success: false,
    };
  }

  // @TODO Here add the logic to validate the received data
  // @TODO in case of error return { success: false, message: '<error message>' }

  return {
    success: true,
  };
}

export { validateData };
