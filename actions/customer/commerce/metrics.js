const { defineMetrics } = require('@adobe/aio-lib-telemetry')
const { ValueType } = require('@adobe/aio-lib-telemetry/otel-api')

/** Metrics used across all actions. */
const commerceCustomerMetrics = defineMetrics((meter) => {
  return {
    consumerSuccessCounter: meter.createCounter(
      'customer.commerce.consumer.success_count', {
        description: 'A counter for the number of successful Commerce Customer Consumer actions.',
        valueType: ValueType.INT
      }),

    consumerTotalCounter: meter.createCounter(
      'customer.commerce.consumer.total_count', {
        description: 'A counter for the number of total Commerce Customer Consumer actions.',
        valueType: ValueType.INT
      })
  }
})

module.exports = {
  commerceCustomerMetrics
}
