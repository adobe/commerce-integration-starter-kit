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

jest.mock('../../../../../actions/order/commerce-order-api-client')
const { addComment } = require('../../../../../actions/order/commerce-order-api-client')

const sender = require('../../../../../actions/order/external/updated/sender')

describe('Order external updated sender', () => {
  test('sendData should be defined', () => {
    expect(sender.sendData).toBeInstanceOf(Function)
  })
  test('calls add comment', async () => {
    const params = { data: { id: 99 } }
    const transformed = {}
    const preprocess = {}
    await sender.sendData(params, transformed, preprocess)
    expect(addComment).toHaveBeenCalled()
  })
})
