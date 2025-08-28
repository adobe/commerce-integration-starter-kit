const { getAuthProviderFromParams } = require("../..//actions/auth");

describe("getAuthProviderFromParams", () => {
  it("with ImsAuth params it returns an anonymous function", async () => {
    const params = {
      OAUTH_CLIENT_ID: "client-id",
      OAUTH_CLIENT_SECRET: "client-secret",
      OAUTH_SCOPES: ["scope1", "scope2"],
      OAUTH_TECHNICAL_ACCOUNT_EMAIL: "test@example.com",
      OAUTH_TECHNICAL_ACCOUNT_ID: "tech-account-id",
      OAUTH_ORG_ID: "org-id",
    };
    const authProvider = await getAuthProviderFromParams(params);

    expect(authProvider).toBeDefined();
    expect(typeof authProvider).toBe("function");
  });

  it("with Commerce OAuth1a params it returns an anonymous function", async () => {
    const params = {
      COMMERCE_CONSUMER_KEY: "commerce-consumer-key",
      COMMERCE_CONSUMER_SECRET: "commerce-consumer-secret",
      COMMERCE_ACCESS_TOKEN: "commerce-access-token",
      COMMERCE_ACCESS_TOKEN_SECRET: "commerce-access-token-secret",
    };

    const authProvider = await getAuthProviderFromParams(params);

    expect(authProvider).toBeDefined();
    expect(typeof authProvider).toBe("function");
  });

  it("throws if no valid params for either ImsAuth or Commerce OAuth1a", async () => {
    await expect(getAuthProviderFromParams({})).rejects.toThrow(
      "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
    );
  });

  it("throws if no valid params for are supplied to ImsAuth", async () => {
    const params = {
      OAUTH_CLIENT_ID: "client-id",
    };
    await expect(getAuthProviderFromParams(params)).rejects.toThrow();
  });

  it("throws if no valid params for are supplied to Commerce OAuth1a", async () => {
    const params = {
      COMMERCE_CONSUMER_KEY: "consumer-key",
    };
    await expect(getAuthProviderFromParams(params)).rejects.toThrow();
  });
});
