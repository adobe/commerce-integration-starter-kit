import Ajv from "ajv";

import schema from "./schema.json";

/**
 * This function validate the product data received from external back-office application
 *
 * @returns the result of validation object
 * @param {object} params - Received data from adobe commerce
 */
function validateData(params) {
  const data = params.data;
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValid = validate(data);
  if (!isValid) {
    return {
      success: false,
      message: `Data provided does not validate with the schema: ${JSON.stringify(data)}`,
    };
  }
  return {
    success: true,
  };
}

export { validateData };
