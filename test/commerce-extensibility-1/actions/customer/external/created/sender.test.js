vi.mock("#src/customer/commerce-customer-api-client");

import { createCustomer } from "#src/customer/commerce-customer-api-client";
import * as sender from "#src/customer/external/created/sender";

describe("Given customer external created sender", () => {
  describe("When method sendData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    test("Then create customer is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(createCustomer).toHaveBeenCalled();
    });
  });
});
