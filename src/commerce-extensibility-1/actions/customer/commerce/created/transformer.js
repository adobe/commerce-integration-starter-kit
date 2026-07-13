import {
  getInstrumentationHelpers,
  instrument,
} from "@adobe/aio-lib-telemetry";

const __esm_transformData = instrument(transformData);
/**
 * This function transform the received customer data from Adobe commerce to external back-office application
 *
 * @param {object} data - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(data) {
  // @Todo Here transform the data as needed for external back-office application API
  const { currentSpan } = getInstrumentationHelpers();
  currentSpan.addEvent("created.phase", {
    value: "transformData",
  });
  const transformedData = data;
  return transformedData;
}

export { __esm_transformData as transformData };
