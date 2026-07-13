import {
  getInstrumentationHelpers,
  instrument,
} from "@adobe/aio-lib-telemetry";

const __esm_postProcess = instrument(postProcess);
/**
 * This function hold any logic needed post sending information to external backoffice application
 *
 * @param {object} data - data received before transformation
 * @param {object} transformed - transformed received data
 * @param {object} preProcessed - preprocessed result data
 * @param {object} result - result data from the sender
 */
function postProcess(data, transformed, preProcessed, result) {
  // @TODO Here implement any preprocessing needed
  const { currentSpan } = getInstrumentationHelpers();
  currentSpan.addEvent("created.phase", {
    value: "postProcess",
  });
}

export { __esm_postProcess as postProcess };
