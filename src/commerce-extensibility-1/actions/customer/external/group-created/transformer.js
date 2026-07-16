/**
 * This function transform the received customer group data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  // @TODO Notice that the attribute_set_id may need to be changed
  return {
    group: {
      code: params.data.name,
      tax_class_id: params.data.taxClassId,
    },
  };
}

export { transformData };
