import {
  getInstrumentationHelpers,
  instrument,
} from "@adobe/aio-lib-telemetry";

import { isOperationSuccessful } from "#src/telemetry";

const __esm_sendData = instrument(sendData, {
  isSuccessful: isOperationSuccessful,
});
/**
 * This function send the customer created dara to the external back-office application
 *
 * @param {object} params - include the env params
 * @param {object} data - Customer data
 * @param {object} preProcessed - result of the pre-process logic if any
 * @returns the sending result if needed for post process
 */
async function sendData(params, data, preProcessed) {
  // @TODO Here add the logic to send the information to 3rd party
  // @TODO Use params to retrieve needed parameters from the environment
  // @TODO in case of error return { success: false, statusCode: <error status code>, message: '<error message>' }
  const { currentSpan } = getInstrumentationHelpers();
  currentSpan.addEvent("created.phase", {
    value: "sendData",
  });
  return {
    success: true,
  };
}

export { __esm_sendData as sendData };
