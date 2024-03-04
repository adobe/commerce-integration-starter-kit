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

const { validateData } = require('../../../../../actions/customer/commerce/group-deleted/validator')

describe('Given the Validator of customer group commerce deleted action', () => {
  describe('When data received is valid', () => {
    test('Then returns success response', async () => {
      const response = await validateData({
        customer_group_code: 'CODE'
      })

      expect(response).toEqual({
        success: true
      })
    })
  })
  describe('When data received is invalid', () => {
    test('Then returns error response', async () => {
      const response = await validateData({})

      expect(response).toEqual({
        success: false,
        message: "missing parameter(s) 'customer_group_code'"
      })
    })
  })
  // @TODO Here you can add unit tests to cover the validation cases implemented in the customer updated validator file
})
