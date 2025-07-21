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

const { main } = require('../../../scripts/onboarding/index')

jest.mock('../../../utils/adobe-auth')
jest.mock('../../../scripts/lib/providers')
jest.mock('../../../scripts/lib/metadata')
jest.mock('../../../scripts/lib/registrations')
jest.mock('../../../scripts/lib/configure-eventing')
const ansis = require('ansis');

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
describe('onboarding index', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  test('should print an error when IO_PROJECT_ID, IO_CONSUMER_ID and IO_WORKSPACE_ID are missing', async () => {
    // Mock process.env to simulate missing environment variables
    const mockEnv = {}
    jest.replaceProperty(process, 'env', mockEnv)
    const result = await main()

    expect(result).toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalled()

    const errorCalls = consoleErrorSpy.mock.calls
    const errorMessages = errorCalls.map(call => call.join(' '))
    const fullErrorMessage = ansis.strip(errorMessages.join(' '))

    expect(fullErrorMessage).toContain('ENVIRONMENT_ONBOARDING')
    expect(fullErrorMessage).toContain('INVALID_ENV_VARS')
    expect(fullErrorMessage).toContain('Missing or invalid environment variables for Onboarding script')
    expect(fullErrorMessage).toContain('Invalid environment variables')
    expect(fullErrorMessage).toContain('IO_PROJECT_ID')
    expect(fullErrorMessage).toContain('IO_CONSUMER_ID')
    expect(fullErrorMessage).toContain('IO_WORKSPACE_ID')
  })
})
