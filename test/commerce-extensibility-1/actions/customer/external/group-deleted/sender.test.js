vi.mock("#src/customer/commerce-customer-group-api-client");

import { deleteCustomerGroup } from "#src/customer/commerce-customer-group-api-client";
import * as sender from "#src/customer/external/group-deleted/sender";

describe("Given customer group external deleted sender", () => {
  describe("When method sendData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    test("Then delete customer group is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(deleteCustomerGroup).toHaveBeenCalled();
    });
  });
});
