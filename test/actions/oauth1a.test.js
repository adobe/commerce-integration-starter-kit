const { HTTP_OK } = require("../../actions/constants");
const { getClient } = require("../../actions/oauth1a");

jest.mock("../../utils/adobe-auth", () => ({
  getAdobeAccessToken: jest.fn().mockResolvedValue("TOKEN"),
}));

const mockJsonResponse = (body, ok = true) =>
  Promise.resolve({
    ok,
    status: ok ? HTTP_OK : 500,
    statusText: ok ? "OK" : "Internal Server Error",
    json: () => Promise.resolve(body),
  });

describe("getClient", () => {
  it("should return a client", () => {
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

  it("throw an error when authOptions are not declared", () =>
    expect(() => {
      getClient(
        {
          url: "http://localhost:9000/",
          params: {},
        },
        console,
      );
    }).toThrow(
      "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
    ));

  it("should add a OAuth header when using Commerce OAuth1a credentials", async () => {
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(() => mockJsonResponse({ success: true }));

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

    expect(await client.get("foo", "")).toStrictEqual({ success: true });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://commerce.adobe.io/V1/foo",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: expect.stringContaining("OAuth"),
        }),
      }),
    );

    fetchSpy.mockRestore();
  });

  it("should add a Authorization with Bearer <TOKEN> when receiving a success response from IMS", async () => {
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(() => mockJsonResponse({ success: true }));

    const client = getClient(
      {
        url: "http://commerce.adobe.io/",
        params: {
          OAUTH_CLIENT_ID: "client-id",
          OAUTH_CLIENT_SECRET: "client-secret",
          OAUTH_SCOPES: ["scope1", "scope2"],
        },
      },
      console,
    );

    expect(await client.get("foo", "")).toStrictEqual({ success: true });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://commerce.adobe.io/V1/foo",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: "Bearer TOKEN",
        }),
      }),
    );

    fetchSpy.mockRestore();
  });
});
