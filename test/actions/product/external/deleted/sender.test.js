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

jest.mock('../../../../../actions/product/commerce-product-api-client')
const { deleteProduct } = require('../../../../../actions/product/commerce-product-api-client')

const sender = require('../../../../../actions/product/external/deleted/sender')

describe('Given product external deleted sender', () => {
  describe('When method sendData is defined', () => {
    test('Then is an instance of Function', () => {
      expect(sender.sendData).toBeInstanceOf(Function)
    })
  })
  describe('When method sendData is called', () => {
    test('Then delete product is called', async () => {
      const params = {}
      const transformed = {}
      const preprocess = {}
      await sender.sendData(params, transformed, preprocess)
      expect(deleteProduct).toHaveBeenCalled()
    })
  })
})
