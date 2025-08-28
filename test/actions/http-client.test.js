const { HTTP_OK } = require("../../actions/constants");
const nock = require("nock");

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("getClient", () => {
  it("should return a client", () => {
    const { getClient } = require("../../actions/http-client");
    const client = getClient(
      {
        url: "http://localhost:9000",
        params: {
          COMMERCE_CONSUMER_KEY: "key",
          COMMERCE_CONSUMER_SECRET: "secret",
          COMMERCE_ACCESS_TOKEN: "secret",
          COMMERCE_ACCESS_TOKEN_SECRET: "secret",
        },
      },
      console,
    );

    expect(client).toBeDefined();
  });

  it("throw an error when authOptions are not declared", () => {
    const { getClient } = require("../../actions/http-client");
    return expect(() => {
      getClient(
        {
          url: "http://localhost:9000/",
          params: {},
        },
        console,
      );
    }).toThrow(
      "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
    );
  });

  it("should add a OAuth header when using Commerce OAuth1a credentials", async () => {
    const { getClient } = require("../../actions/http-client");
    const client = getClient(
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

    const client = getClient(
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
