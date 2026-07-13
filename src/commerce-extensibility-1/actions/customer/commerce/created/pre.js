import {
  getInstrumentationHelpers,
  instrument,
} from "@adobe/aio-lib-telemetry";

/**
 * This function hold any logic needed pre sending information to external backoffice application
 *
 * @param {object} data - Data received before transformation
 * @param {object} transformed - Transformed received data
 */
function __preProcess(data, transformed) {
  // @TODO Here implement any preprocessing needed
  const { currentSpan } = getInstrumentationHelpers();
  currentSpan.addEvent("created.phase", {
    value: "preProcess",
  });
}

export const preProcess = instrument(__preProcess);
