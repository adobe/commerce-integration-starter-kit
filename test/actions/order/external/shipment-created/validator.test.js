/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */

const validator = require('../../../../../actions/order/external/shipment-created/validator')

describe('Order Shipment external created validator', () => {
  test('validateData should be defined', () => {
    expect(validator.validateData).toBeInstanceOf(Function)
  })
  it.each([
    [{
      data: {
        orderId: 6,
        items: [{ orderItemId: 7, qty: 1 }],
        tracks: [{ trackNumber: 'Custom Value', title: 'Custom Title', carrierCode: 'custom' }],
        comments: [{ notifyCustomer: false, comment: 'Order Shipped from API', visibleOnFront: true }],
        stockSourceCode: 'default'
      }
    }] // required properties
  ])('When data is valid e.g. %o, Then returns successful response', (params) => {
    const SUCCESSFUL_RESPONSE = { success: true }
    expect(validator.validateData(params)).toMatchObject(SUCCESSFUL_RESPONSE)
  })
  it.each([
    [{ data: { orderId: 7 } }], // missing required properties
    [{
      data: {
        orderId: '6',
        items: [{ orderItemId: '7', qty: '1' }],
        tracks: [{ trackNumber: 'Custom Value', title: 'Custom Title', carrierCode: 'custom' }],
        comments: [{ notifyCustomer: 0, comment: 'Order Shipped from API', visibleOnFront: 1 }],
        stockSourceCode: 'default'
      }
    }] // wrong type property
  ])('When data is invalid e.g. %o, Then returns not successful response', (params) => {
    const UNSUCCESSFUL_RESPONSE = { success: false }
    expect(validator.validateData(params)).toMatchObject(UNSUCCESSFUL_RESPONSE)
  })
})
