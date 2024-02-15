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

const validator = require('../../../../../actions/stock/external/updated/validator')

describe('Stock external updated validator', () => {
  test('validateData should be defined', () => {
    expect(validator.validateData).toBeInstanceOf(Function)
  })
  it.each([
    [{ data: [{ sku: 'SKU1', source: 'SOURCE1', quantity: 99, outOfStock: false }, { sku: 'SKU2', source: 'SOURCE2', quantity: 66, outOfStock: true }] }], // required properties
    [{ data: [{ sku: 'SKU1', source: 'SOURCE1', quantity: 99, outOfStock: false, extra: 'EXTRA' }] }] // additional properties
  ])('When data is valid e.g. %o, Then returns successful response', (params) => {
    const SUCCESSFUL_RESPONSE = { success: true }
    expect(validator.validateData(params)).toMatchObject(SUCCESSFUL_RESPONSE)
  })
  it.each([
    [{ data: { sku: 'SKU', name: 'NAME', description: 'DESC' } }], // missing required properties
    [{ data: { sku: 'SKU', name: 'NAME', price: '99.99', description: 'DESC' } }] // wrong type property
  ])('When data is invalid e.g. %o, Then returns not successful response', (params) => {
    const UNSUCCESSFUL_RESPONSE = { success: false }
    expect(validator.validateData(params)).toMatchObject(UNSUCCESSFUL_RESPONSE)
  })
})