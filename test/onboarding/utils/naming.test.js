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

const naming = require('../../../utils/naming.js')

describe('Given naming file', () => {
  describe('When method addSufix is called with label parameter undefined', () => {
    test('Then throws an exception', () => {
      const label = null
      const environment = { AIO_runtime_namespace: '1340225-testProject-testWorkspace' }
      expect(() => {
        naming.addSuffix(label, environment)
      }).toThrow(Error)
    })
  })
  describe('When method addSufix is called with environment parameter undefined', () => {
    test('Then throws an exception', () => {
      const label = 'Label'
      const environment = null
      expect(() => {
        naming.addSuffix(label, environment)
      }).toThrow(Error)
    })
  })
  describe('When runtime namespace is undefined in the environment', () => {
    test('Then throws an exception', () => {
      const label = 'Label'
      const environment = {}
      expect(() => {
        naming.addSuffix(label, environment)
      }).toThrow(Error)
    })
  })
  describe('When method addSufix is called with valid information', () => {
    test('Then returns label with suffix', () => {
      const label = 'Label'
      const environment = { AIO_runtime_namespace: '1340225-testProject-testWorkspace' }
      expect(naming.addSuffix(label, environment)).toEqual('Label - testProject-testWorkspace')
    })
  })
})
