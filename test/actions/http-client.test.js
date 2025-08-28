const { HTTP_OK } = require("../../actions/constants");
const nock = require("nock");

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("getAuthProviderFromParams", () => {
  it("with ImsAuth params it returns an anonymous function", async () => {
    const { getAuthProviderFromParams } = require("../../actions/http-client");
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
    const { getAuthProviderFromParams } = require("../../actions/http-client");
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
    const { getAuthProviderFromParams } = require("../../actions/http-client");
    await expect(getAuthProviderFromParams({})).rejects.toThrow(
      "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
    );
  });

  it("throws if no valid params for are supplied to ImsAuth", async () => {
    const { getAuthProviderFromParams } = require("../../actions/http-client");
    const params = {
      OAUTH_CLIENT_ID: "client-id",
    };
    await expect(getAuthProviderFromParams(params)).rejects.toThrow();
  });

  it("throws if no valid params for are supplied to Commerce OAuth1a", async () => {
    const { getAuthProviderFromParams } = require("../../actions/http-client");
    const params = {
      COMMERCE_CONSUMER_KEY: "consumer-key",
    };
    await expect(getAuthProviderFromParams(params)).rejects.toThrow();
  });
});

describe("getClient", () => {
  it("throw an error when authOptions are not declared", async () => {
    const { getClient } = require("../../actions/http-client");
    await expect(
      getClient(
        {
          url: "http://localhost:9000/",
          params: {},
        },
        console,
      ),
    ).rejects.toThrow(
      "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
    );
  });

  it("should add a OAuth header when using Commerce OAuth1a credentials", async () => {
    const { getClient } = require("../../actions/http-client");
    const client = await getClient(
      {
        url: "http://commerce.adobe.io/",
        params: {
          COMMERCE_CONSUMER_KEY: "key",
          COMMERCE_CONSUMER_SECRET: "secret",
          COMMERCE_ACCESS_TOKEN: "secret",
          COMMERCE_ACCESS_TOKEN_SECRET: "secret",
        },
      },
      console,
    );

    const scope = nock("http://commerce.adobe.io", {
      reqheaders: {
        Authorization: (value) => {
          return value.includes("OAuth");
        },
      },
    })
      .matchHeader("accept", "application/json")
      .get("/V1/foo")
      .reply(HTTP_OK, { success: true });
    expect(await client.get("foo", "")).toStrictEqual({
      success: true,
    });
    scope.done();
  });

  it("should add a Authorization with Bearer <TOKEN> when receiving a success response from IMS", async () => {
    const { assertImsAuthParams } = jest.requireActual(
      "@adobe/aio-commerce-lib-auth",
    );

    jest.doMock("@adobe/aio-commerce-lib-auth", () => ({
      __esModule: true,
      getImsAuthProvider: jest.fn().mockReturnValue({
        getAccessToken: jest.fn().mockResolvedValue("test-token"),
      }),
      assertImsAuthParams,
    }));

    const { getClient } = require("../../actions/http-client");

    const client = await getClient(
      {
        url: "http://commerce.adobe.io/",
        params: {
          OAUTH_CLIENT_ID: "client-id",
          OAUTH_CLIENT_SECRET: "client-secret",
          OAUTH_SCOPES: ["scope1", "scope2"],
          OAUTH_TECHNICAL_ACCOUNT_ID: "test-technical-account-id",
          OAUTH_TECHNICAL_ACCOUNT_EMAIL: "test-email@example.com",
          OAUTH_ORG_ID: "test-org-id",
        },
      },
      console,
    );

    const scope = nock("http://commerce.adobe.io", {
      reqheaders: {
        Authorization: (value) => {
          return value.includes("Bearer test-token");
        },
      },
    })
      .matchHeader("accept", "application/json")
      .get("/V1/foo")
      .reply(HTTP_OK, { success: true });

    const result = await client.get("foo", "");
    expect(result).toStrictEqual({
      success: true,
    });

    scope.done();
  });
});
