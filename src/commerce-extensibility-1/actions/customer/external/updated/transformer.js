/**
 * This function transform the received customer data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // This is a sample implementation. Please adapt based on your needs
  // Notice that the attribute_set_id may need to be changed
  return {
    customer: {
      id: params.data.id,
      firstname: params.data.name,
      lastname: params.data.lastname,
      email: params.data.email,
    },
  };
}

export { transformData };
