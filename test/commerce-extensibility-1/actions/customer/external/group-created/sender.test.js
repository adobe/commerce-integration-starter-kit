vi.mock("#src/customer/commerce-customer-group-api-client");

import { createCustomerGroup } from "#src/customer/commerce-customer-group-api-client";
import * as sender from "#src/customer/external/group-created/sender";

describe("Given customer group external created sender", () => {
  describe("When method sendData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    test("Then create customer group is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(createCustomerGroup).toHaveBeenCalled();
    });
  });
});
