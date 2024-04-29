/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { validateData } = require('../../../../../actions/customer/commerce/group-updated/validator')

describe('Validator of Customer group commerce updated action', () => {
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
