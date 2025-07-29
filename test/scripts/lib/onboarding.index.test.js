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

const ansis = require('ansis')

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

    expect(fullErrorMessage).toContain('ENVIRONMENT_VARIABLES')
    expect(fullErrorMessage).toContain('INVALID_ENV_VARS')
    expect(fullErrorMessage).toContain('Missing or invalid environment variables for Onboarding script')
    expect(fullErrorMessage).toContain('Invalid environment variables')
    expect(fullErrorMessage).toContain('IO_PROJECT_ID')
    expect(fullErrorMessage).toContain('IO_CONSUMER_ID')
    expect(fullErrorMessage).toContain('IO_WORKSPACE_ID')
  })

  test('should print an error when IMS Auth Parameters are missing', async () => {
    // Mock process.env to simulate missing environment variables
    const mockEnv = {
      IO_CONSUMER_ID: 'test',
      IO_WORKSPACE_ID: 'test',
      IO_PROJECT_ID: 'test'
    }
    jest.replaceProperty(process, 'env', mockEnv)
    const result = await main()

    expect(result).toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalled()

    const errorCalls = consoleErrorSpy.mock.calls
    const errorMessages = errorCalls.map(call => call.join(' '))
    const fullErrorMessage = ansis.strip(errorMessages.join(' '))

    expect(fullErrorMessage).toContain('IMS_AUTH_PARAMS')
    expect(fullErrorMessage).toContain('INVALID_IMS_AUTH_PARAMS')
    expect(fullErrorMessage).toContain('Missing or invalid environment variables for Adobe IMS authentication.')
    expect(fullErrorMessage).toContain('Invalid ImsAuthProvider configuration')
    expect(fullErrorMessage).toContain('clientId')
    expect(fullErrorMessage).toContain('clientSecrets')
    expect(fullErrorMessage).toContain('technicalAccountId')
    expect(fullErrorMessage).toContain('technicalAccountEmail')
    expect(fullErrorMessage).toContain('imsOrgId')
    expect(fullErrorMessage).not.toContain('scopes')
  })
})
