const { fromParams } = require("../..//actions/auth");

describe("fromParams", () => {
  it("can extract IMS params", () => {
    const params = {
      OAUTH_CLIENT_ID: "client-id",
      OAUTH_CLIENT_SECRET: "client-secret",
      OAUTH_SCOPES: ["scope1", "scope2"],
      OAUTH_TECHNICAL_ACCOUNT_EMAIL: "test@example.com",
      OAUTH_TECHNICAL_ACCOUNT_ID: "tech-account-id",
      OAUTH_ORG_ID: "org-id",
    };

    expect(fromParams(params)).toEqual({
      ims: {
        clientId: "client-id",
        clientSecrets: ["client-secret"],
        imsOrgId: "org-id",
        scopes: ["scope1", "scope2"],
        environment: "prod",
        technicalAccountEmail: "test@example.com",
        technicalAccountId: "tech-account-id",
      },
    });
  });

  it("can extract Commerce OAuth1a params", () => {
    const params = {
      COMMERCE_CONSUMER_KEY: "commerce-consumer-key",
      COMMERCE_CONSUMER_SECRET: "commerce-consumer-secret",
      COMMERCE_ACCESS_TOKEN: "commerce-access-token",
      COMMERCE_ACCESS_TOKEN_SECRET: "commerce-access-token-secret",
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
