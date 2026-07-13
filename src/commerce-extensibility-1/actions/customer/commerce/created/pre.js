import {
  getInstrumentationHelpers,
  instrument,
} from "@adobe/aio-lib-telemetry";

const __esm_preProcess = instrument(preProcess);
/**
 * This function hold any logic needed pre sending information to external backoffice application
 *
 * @param {object} data - Data received before transformation
 * @param {object} transformed - Transformed received data
 */
function preProcess(data, transformed) {
  // @TODO Here implement any preprocessing needed
  const { currentSpan } = getInstrumentationHelpers();
  currentSpan.addEvent("created.phase", {
    value: "preProcess",
  });
}

export { __esm_preProcess as preProcess };
