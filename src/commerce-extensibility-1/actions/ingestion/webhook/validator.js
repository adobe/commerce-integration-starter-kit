import { checkMissingRequestInputs } from "#lib/utils";

/**
 * Validate the event information
 *
 * @param {object} params input parameters
 * @returns the success status and error message
 */
function validateData(params) {
  const requiredParams = ["data.uid", "data.event", "data.value"];
  const errorMessage = checkMissingRequestInputs(params, requiredParams, []);
  if (errorMessage) {
    return {
      message: errorMessage,
      success: false,
    };
  }

  // @TODO Add any other validation you consider necessary here

  return {
    success: true,
  };
}

export { validateData };
