vi.mock("#src/customer/commerce-customer-group-api-client");

import { updateCustomerGroup } from "#src/customer/commerce-customer-group-api-client";
import * as sender from "#src/customer/external/group-updated/sender";

describe("Given customer group external updated sender", () => {
  describe("When method sendData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    test("Then update customer group is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(updateCustomerGroup).toHaveBeenCalled();
    });
  });
});
