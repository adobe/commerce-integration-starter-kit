const {
  resolveScopes,
  createIntegrationProvider,
  createImsProvider,
  imsProviderWithEnvResolver,
} = require("../../utils/adobe-auth.js");

describe("adobe-auth", () => {
  describe("resolveScopes", () => {
    it("returns array as is", () => {
      const input = ["scope1", "scope2"];
      const result = resolveScopes(input);
      expect(result).toEqual(input);
    });

    it.each([
      ["scope", ["scope"]],
      ["scope1, scope2", ["scope1", "scope2"]],
      ["scope_1, scope-2, scope.3", ["scope_1", "scope-2", "scope.3"]],
    ])("splits comma-separated string %s", (input, expected) => {
      const result = resolveScopes(input);
      expect(result).toEqual(expected);
    });

    it("parses JSON array string", () => {
      const input = '["scope1", "scope2"]';
      const result = resolveScopes(input);
      expect(result).toEqual(["scope1", "scope2"]);
    });

    it("handles invalid single comma strings gracefully", () => {
      const input = "['scope1, scope2]";
      expect(() => resolveScopes(input)).toThrow("Invalid scopes format");
    });

    it.each([
      ["scope@"],
      ["scope1; scope2"],
      ["scope_1|scope-2"],
      ["scope_1,,scope-2"],
    ])("should not parse invalid scope pattern %s", (input) => {
      expect(() => resolveScopes(input)).toThrow("Invalid scopes format");
    });

    it("handles empty string", () => {
      const input = "";
      expect(() => resolveScopes(input)).toThrow("Invalid scopes format");
    });
  });

  describe("createIntegrationProvider", () => {
    const validParams = {
      consumerKey: "consumerKey",
      consumerSecret: "consumerSecret",
      accessToken: "accessToken",
      accessTokenSecret: "accessTokenSecret",
    };

    it.each([
      ["valid object", validParams],
      ["valid function", () => validParams],
      ["valid async function", async () => Promise.resolve(validParams)],
    ])("returns the ImsAuthProvider %s", (_subject, input) => {
      expect(async () => {
        const provider = await createIntegrationProvider(input);
        expect(provider).toBeInstanceOf(Object);
        expect(provider).toHaveProperty("getHeaders", expect.any(Function));
        expect(
          provider.getHeaders("POST", "http://localhost:8080"),
        ).toHaveProperty("Authorization");
      }).not.toThrowError();
    });
  });

  describe("createImsProvider", () => {
    const validParams = {
      clientId: "OAUTH_CLIENT_ID",
      clientSecrets: ["OAUTH_CLIENT_SECRET"],
      technicalAccountId: "example@adobe-ds.com",
      technicalAccountEmail: "example2@adobe-ds.com",
      imsOrgId: "OAUTH_ORG_ID",
      environment: "prod",
      scopes: ["scope1"],
    };

    it.each([
      ["valid object", validParams],
      ["valid function", () => validParams],
      ["valid async function", async () => Promise.resolve(validParams)],
    ])("returns the ImsAuthProvider %s", (_subject, input) => {
      expect(async () => {
        const provider = await createImsProvider(input);
        expect(provider).toBeInstanceOf(Object);
        expect(provider).toHaveProperty("getAccessToken", expect.any(Function));
        expect(provider).toHaveProperty("getHeaders", expect.any(Function));
      }).not.toThrowError();
    });
  });

  describe("resolveImsEnvResolver", () => {
    it("returns the ImsAuthProvider object", () => {
      const validEnvParams = {
        OAUTH_CLIENT_ID: "OAUTH_CLIENT_ID",
        OAUTH_CLIENT_SECRET: "OAUTH_CLIENT_SECRET",
        OAUTH_TECHNICAL_ACCOUNT_ID: "example@adobe-ds.com",
        OAUTH_TECHNICAL_ACCOUNT_EMAIL: "example2@adobe-ds.com",
        OAUTH_ORG_ID: "OAUTH_ORG_ID",
        OAUTH_SCOPES: "scope1,scope2",
      };

      expect(async () => {
        const provider = await imsProviderWithEnvResolver(validEnvParams);
        expect(provider).toBeInstanceOf(Object);
        expect(provider).toHaveProperty("getAccessToken", expect.any(Function));
        expect(provider).toHaveProperty("getHeaders", expect.any(Function));
      }).not.toThrowError();
    });
  });
});
