/**
 * This function transform the received order status data from external back-office application to Adobe commerce
 *
 * @param {object} params - Data received from Adobe commerce
 * @returns transformed data object
 */
function transformData(params) {
  // @TODO This is a sample implementation. Please adapt based on your needs
  return {
    statusHistory: {
      comment: `Order status changed to ${params.data.status}`,
      is_customer_notified: params.data?.notifyCustomer ? 1 : 0,
      is_visible_on_front: 1,
    },
  };
}

export { transformData };
