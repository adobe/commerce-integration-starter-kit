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

jest.mock('../../../../../actions/product/commerce-product-api-client')
const { updateProduct } = require('../../../../../actions/product/commerce-product-api-client')

const sender = require('../../../../../actions/product/external/updated/sender')

describe('Given product external updated sender', () => {
  describe('When method sendData is defined', () => {
    test('Then is an instance of Function', () => {
      expect(sender.sendData).toBeInstanceOf(Function)
    })
  })
  describe('When method sendData is called', () => {
    test('Then update product is called', async () => {
      const params = {}
      const transformed = {}
      const preprocess = {}
      await sender.sendData(params, transformed, preprocess)
      expect(updateProduct).toHaveBeenCalled()
    })
  })
})
