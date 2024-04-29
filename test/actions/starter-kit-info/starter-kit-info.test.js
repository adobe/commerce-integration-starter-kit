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

const action = require('../../../actions/starter-kit-info/index.js')
describe('Given the starter kit info action', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When invoked', () => {
    test('The starter kit version is included in the response', async () => {
      const params = {}
      const response = await action.main(params)

      expect(response).toHaveProperty('body.message.starter_kit_version')
    })
    test('The registrations are included in the response', async () => {
      const params = {}
      const response = await action.main(params)

      expect(response).toHaveProperty('body.message.registrations')
    })
  })
})
