import {
  getInstrumentationHelpers,
  instrument,
} from "@adobe/aio-lib-telemetry";

import { isOperationSuccessful } from "#src/telemetry";

/**
 * This function validate the customer data received
 *
 * @param {object} data - Received data from adobe commerce
 * @returns the result of validation object
 */
function __validateData(data) {
  // @TODO Here add the logic to validate the received data
  // @TODO in case of error return { success: false, message: '<error message>' }
  const { currentSpan } = getInstrumentationHelpers();
  currentSpan.addEvent("created.phase", {
    value: "validateData",
  });
  return {
    success: true,
  };
}

export const validateData = instrument(__validateData, {
  isSuccessful: isOperationSuccessful,
});
