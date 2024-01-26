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
