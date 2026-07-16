import * as action from "#src/starter-kit/info/index";

describe("Given the starter kit info action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When invoked", () => {
    test("Then the starter kit version is included in the response", async () => {
      const response = await action.main({});
      expect(response).toHaveProperty("body.message.starter_kit_version");
    });
    test("Then the eventing data is included in the response", async () => {
      const response = await action.main({});
      expect(response).toHaveProperty("body.message.eventing");
    });
    test("Then registrations points to the eventing property for backwards compatibility", async () => {
      const response = await action.main({});
      expect(response.body.message.registrations).toBe(
        'This information now lives in the "eventing" property.',
      );
    });
  });
});
