const { getClient } = require('../../actions/oauth1a')
const nock = require('nock')

describe('getClient', () => {
  it('should return a client', () => {
    const client = getClient({
      url: 'http://localhost:9000',
      params: {
        COMMERCE_CONSUMER_KEY: 'key',
        COMMERCE_CONSUMER_SECRET: 'secret',
        COMMERCE_ACCESS_TOKEN: 'secret',
        COMMERCE_ACCESS_TOKEN_SECRET: 'secret'
      }
    }, console)

    expect(client).toBeDefined()
  })

  it('throw an error when authOptions are not declared', async () => {
    return expect(async () => {
      getClient({
        url: 'http://localhost:9000/',
        params: {}
      }, console)
    }).rejects.toThrow('Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types')
  })

  it('should add a OAuth header when using Commerce OAuth1a credentials', async () => {
    const client = getClient({
      url: 'http://commerce.adobe.io/',
      params: {
        COMMERCE_CONSUMER_KEY: 'key',
        COMMERCE_CONSUMER_SECRET: 'secret',
        COMMERCE_ACCESS_TOKEN: 'secret',
        COMMERCE_ACCESS_TOKEN_SECRET: 'secret'
      }
    }, console)

    const scope = nock('http://commerce.adobe.io', {
      reqheaders: {
        Authorization: (value) => {
          return value.includes('OAuth')
        }
      }
    })
      .matchHeader('accept', 'application/json')
      .get('/V1/foo')
      .reply(200, { success: true })
    expect(await client.get('foo', '')).toStrictEqual({
      success: true
    })
    scope.done()
  })

  it('should add a Authorization with Bearer <TOKEN> when receiving a success response from IMS', async () => {
    const client = getClient({
      url: 'http://commerce.adobe.io/',
      params: {
        OAUTH_CLIENT_ID: 'client-id',
        OAUTH_CLIENT_SECRET: 'client-secret',
        OAUTH_SCOPES: ['scope1', 'scope2']
      }
    }, console)

    const imsScope = nock('https://ims-na1.adobelogin.com', {})
      .post('/ims/token/v3')
      .reply(200, {
        access_token: 'TOKEN',
        token_type: 'Bearer',
        expires_in: 86000,
        expires_at: 999999999
      })

    const scope = nock('http://commerce.adobe.io', {
      reqheaders: {
        Authorization: (value) => {
          return value.includes('Bearer TOKEN')
        }
      }
    })
      .matchHeader('accept', 'application/json')
      .get('/V1/foo')
      .reply(200, { success: true })

    const result = await client.get('foo', '')
    expect(result).toStrictEqual({
      success: true
    })

    imsScope.done()
    scope.done()
  })
})
