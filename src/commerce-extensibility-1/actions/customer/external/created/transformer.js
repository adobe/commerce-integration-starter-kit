/**
 * This function transform the received customer data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  // @TODO Notice that the attribute_set_id may need to be changed
  return {
    customer: {
      email: params.data.email,
      firstname: params.data.name,
      lastname: params.data.lastname,
    },
  };
}

export { transformData };
