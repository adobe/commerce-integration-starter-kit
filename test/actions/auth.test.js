const { validateParams, fromParams } = require("../..//actions/auth");

describe("validateParams", () => {
  it("should throw error if missing params", () => {
    const params = {
      AIO_COMMERCE_AUTH_IMS_CLIENT_ID: "client-id",
    };

    expect(() => {
      validateParams(params, [
        "AIO_COMMERCE_AUTH_IMS_CLIENT_ID",
        "AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS",
      ]);
    }).toThrow(
      "Expected parameters are missing AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS",
    );
  });

  it("should not throw error if params are not missing", () => {
    const params = {
      AIO_COMMERCE_AUTH_IMS_CLIENT_ID: "client-id",
      AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS: ["client-secret"],
      AIO_COMMERCE_AUTH_IMS_SCOPES: ["scope1", "scope2"],
    };

    expect(() => {
      validateParams(params, [
        "AIO_COMMERCE_AUTH_IMS_CLIENT_ID",
        "AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS",
        "AIO_COMMERCE_AUTH_IMS_SCOPES",
      ]);
    }).not.toThrow();
  });
});

describe("fromParams", () => {
  it("can extract IMS params", () => {
    const params = {
      AIO_COMMERCE_AUTH_IMS_CLIENT_ID: "client-id",
      AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS: ["client-secret"],
      AIO_COMMERCE_AUTH_IMS_SCOPES: ["scope1", "scope2"],
    };

    expect(fromParams(params)).toEqual({
      ims: {
        clientId: "client-id",
        clientSecret: "client-secret",
        scopes: ["scope1", "scope2"],
      },
    });
  });

  it("can extract Commerce OAuth1a params", () => {
    const params = {
      AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_KEY: "commerce-consumer-key",
      AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_SECRET: "commerce-consumer-secret",
      AIO_COMMERCE_AUTH_INTEGRATION_ACCESS_TOKEN: "commerce-access-token",
      AIO_COMMERCE_AUTH_INTEGRATION_ACCESS_TOKEN_SECRET:
        "commerce-access-token-secret",
    };

    expect(fromParams(params)).toEqual({
      commerceOAuth1: {
        consumerKey: "commerce-consumer-key",
        consumerSecret: "commerce-consumer-secret",
        accessToken: "commerce-access-token",
        accessTokenSecret: "commerce-access-token-secret",
      },
    });
  });
});
