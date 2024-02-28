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

const action = require('../../../../../actions/customer/commerce/group-deleted')

describe('Customer group commerce deleted', () => {
  test('main should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  describe('When process customer group commerce request missing customer group code parameter', () => {
    test('Then an error 400 is returned',
      async () => {
        const params = {
          data: {}
        }
        const response = await action.main(params)

        expect(response).toEqual({
          statusCode: 400,
          body: {
            success: false,
            error: "missing parameter(s) 'data.customer_group_code'"
          }
        })
      })
  })
  // @TODO Here you can add unit tests to cover the cases implemented in the customer deleted runtime action
})
