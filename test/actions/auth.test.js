const { validateParams, fromParams } = require('../..//actions/auth')

describe('validateParams', () => {
  it('should throw error if missing params', () => {
    const params = {
      OAUTH_CLIENT_ID: 'client-id'
    }

    expect(() => {
      validateParams(params, ['OAUTH_CLIENT_ID', 'OAUTH_CLIENT_SECRET'])
    }).toThrow('Expected parameters are missing OAUTH_CLIENT_SECRET')
  })

  it('should not throw error if params are not missing', () => {
    const params = {
      OAUTH_CLIENT_ID: 'client-id',
      OAUTH_CLIENT_SECRET: 'client-secret',
      OAUTH_SCOPES: ['scope1', 'scope2']
    }

    expect(() => {
      validateParams(params, ['OAUTH_CLIENT_ID', 'OAUTH_CLIENT_SECRET', 'OAUTH_SCOPES'])
    }).not.toThrow()
  })
})

describe('fromParams', () => {
  it('can extract IMS params', () => {
    const params = {
      OAUTH_CLIENT_ID: 'client-id',
      OAUTH_CLIENT_SECRET: 'client-secret',
      OAUTH_SCOPES: ['scope1', 'scope2']
    }

    expect(fromParams(params)).toEqual({
      ims: {
        clientId: 'client-id',
        clientSecret: 'client-secret',
        scopes: ['scope1', 'scope2']
      }
    })
  })

  it('can extract Commerce OAuth1a params', () => {
    const params = {
      COMMERCE_CONSUMER_KEY: 'commerce-consumer-key',
      COMMERCE_CONSUMER_SECRET: 'commerce-consumer-secret',
      COMMERCE_ACCESS_TOKEN: 'commerce-access-token',
      COMMERCE_ACCESS_TOKEN_SECRET: 'commerce-access-token-secret'
    }

    expect(fromParams(params)).toEqual({
      commerceOAuth1: {
        consumerKey: 'commerce-consumer-key',
        consumerSecret: 'commerce-consumer-secret',
        accessToken: 'commerce-access-token',
        accessTokenSecret: 'commerce-access-token-secret'
      }
    })
  })
})
