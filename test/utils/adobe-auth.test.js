const { resolveScopes } = require("../../utils/adobe-auth.js");

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
      ["scope_1, scope-2", ["scope_1", "scope-2"]],
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

    it.each([["scope@"], ["scope1; scope2"], ["scope_1|scope-2"]])(
      "splits comma-separated string %s",
      (input) => {
        expect(() => resolveScopes(input)).toThrow("Invalid scopes format");
      },
    );

    it("handles empty string", () => {
      const input = "";
      expect(() => resolveScopes(input)).toThrow("Invalid scopes format");
    });
  });
});
