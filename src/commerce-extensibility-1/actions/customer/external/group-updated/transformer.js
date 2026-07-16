/**
 * This function transform the received customer group data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // This is a sample implementation. Please adapt based on your needs
  // Notice that the attribute_set_id may need to be changed
  return {
    group: {
      id: params.data.id,
      code: params.data.name,
      tax_class_id: params.data.taxClassId,
    },
  };
}

export { transformData };
