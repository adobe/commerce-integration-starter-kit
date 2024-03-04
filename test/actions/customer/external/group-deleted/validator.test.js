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

const validator = require('../../../../../actions/customer/external/group-deleted/validator')

describe('Given customer group external deleted validator', () => {
  describe('When method validateData is defined', () => {
    test('Then is an instance of Function', () => {
      expect(validator.validateData).toBeInstanceOf(Function)
    })
  })
  describe('When data to validate is valid', () => {
    it.each([
      [{ data: { id: 99 } }] // required properties
    ])('Then returns successful response', (params) => {
      const SUCCESSFUL_RESPONSE = { success: true }
      expect(validator.validateData(params)).toMatchObject(SUCCESSFUL_RESPONSE)
    })
  })
  describe('When data to validate is not valid', () => {
    it.each([
      [{ data: { id: 99, name: 'NAME' } }], // additional properties
      [{ data: { id: '99' } }] // wrong type property
    ])('When data is invalid e.g. %o, Then returns not successful response', (params) => {
      const UNSUCCESSFUL_RESPONSE = { success: false }
      expect(validator.validateData(params)).toMatchObject(UNSUCCESSFUL_RESPONSE)
    })
  })
})
