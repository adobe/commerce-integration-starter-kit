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

const naming = require('../../utils/naming.js')
const providers = require('../../scripts/onboarding/config/providers.json')
const events = require('../../scripts/onboarding/config/events.json')

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
  describe('When getRegistrationName is called', () => {
    const cases = Object.keys(events).flatMap(entityName =>
      providers.map(({ key: providerKey }) => ({ providerKey, entityName }))
    )

    test.each(cases)('naming.getRegistrationName($providerKey, $entityName) returns strings with 25 or less chars',
      ({ providerKey, entityName }) => {
        const result = naming.getRegistrationName(providerKey, entityName)
        expect(result.length).toBeLessThanOrEqual(25)
      })
  })
})
