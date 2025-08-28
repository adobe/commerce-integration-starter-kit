const { getAuthProviderFromParams } = require("../..//actions/auth");

describe("getAuthProviderFromParams", () => {
  it("with ImsAuth params it returns an anonymous function", () => {
    const params = {
      OAUTH_CLIENT_ID: "client-id",
      OAUTH_CLIENT_SECRET: "client-secret",
      OAUTH_SCOPES: ["scope1", "scope2"],
      OAUTH_TECHNICAL_ACCOUNT_EMAIL: "test@example.com",
      OAUTH_TECHNICAL_ACCOUNT_ID: "tech-account-id",
      OAUTH_ORG_ID: "org-id",
    };
    const authProvider = getAuthProviderFromParams(params);

    expect(authProvider).toBeDefined();
    expect(typeof authProvider).toBe("function");
  });

  it("with Commerce OAuth1a params it returns an anonymous function", () => {
    const params = {
      COMMERCE_CONSUMER_KEY: "commerce-consumer-key",
      COMMERCE_CONSUMER_SECRET: "commerce-consumer-secret",
      COMMERCE_ACCESS_TOKEN: "commerce-access-token",
      COMMERCE_ACCESS_TOKEN_SECRET: "commerce-access-token-secret",
    };

    const authProvider = getAuthProviderFromParams(params);

    expect(authProvider).toBeDefined();
    expect(typeof authProvider).toBe("function");
  });

  it("throws if no valid params for either ImsAuth or Commerce OAuth1a", () => {
    const params = {};
    expect(() => getAuthProviderFromParams(params)).toThrow(
      "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
    );
  });

  it("throws if no valid params for are supplied to ImsAuth", () => {
    const params = {
      OAUTH_CLIENT_ID: "client-id",
    };
    expect(() => getAuthProviderFromParams(params)).toThrow();
  });

  it("throws if no valid params for are supplied to Commerce OAuth1a", () => {
    const params = {
      COMMERCE_CONSUMER_KEY: "consumer-key",
    };
    expect(() => getAuthProviderFromParams(params)).toThrow();
  });
});
