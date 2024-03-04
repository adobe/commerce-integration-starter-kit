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

jest.mock('../../../../../actions/customer/commerce-customer-group-api-client')
const { createCustomerGroup } = require('../../../../../actions/customer/commerce-customer-group-api-client')

const sender = require('../../../../../actions/customer/external/group-created/sender')

describe('Given customer group external created sender', () => {
  describe('When method sendData is defined', () => {
    test('Then is an instance of Function', () => {
      expect(sender.sendData).toBeInstanceOf(Function)
    })
  })
  describe('When method sendData is called', () => {
    test('Then create customer group is called', async () => {
      const params = {}
      const transformed = {}
      const preprocess = {}
      await sender.sendData(params, transformed, preprocess)
      expect(createCustomerGroup).toHaveBeenCalled()
    })
  })
})
