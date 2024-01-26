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
 
jest.mock('openwhisk')
const openwhisk = require('openwhisk');
const Openwhisk = require("../../actions/openwhisk");
const fetch = require("node-fetch");

afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
})

describe('Openwhisk class', () => {
    test('When action is invoked then return action success', async () => {
        const expectedResponse = {
            response: {
                result: {
                    statusCode: 200,
                        body: {
                        action: 'test',
                            success: true
                    }
                }
            }
        }

        openwhisk.mockReturnValue({
            actions: {
                invoke: jest.fn().mockResolvedValue(expectedResponse)
            }
        });

        const client = new Openwhisk('API_HOST', 'API_AUTH')
        const response = await client.invokeAction('test', {})

        expect(response).toEqual(expectedResponse)
    })
});
