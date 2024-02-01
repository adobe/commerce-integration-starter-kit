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

jest.mock('../../../../../actions/customer-group/commerceCustomerGroupApiClient')
const { deleteCustomerGroup } = require('../../../../../actions/customer-group/commerceCustomerGroupApiClient')

const sender = require('../../../../../actions/customer-group/external/deleted/sender')

describe('Customer Group external deleted sender', () => {
  test('sendData should be defined', () => {
    expect(sender.sendData).toBeInstanceOf(Function)
  })
  test('calls delete customer group', async () => {
    const params = {}
    const transformed = {}
    const preprocess = {}
    await sender.sendData(params, transformed, preprocess)
    expect(deleteCustomerGroup).toHaveBeenCalled()
  })
})
