import { updateCustomerGroup } from "#src/customer/commerce-customer-group-api-client";
import * as sender from "#src/customer/external/group-updated/sender";

vi.mock("#src/customer/commerce-customer-group-api-client");

describe("Given customer group external updated sender", () => {
  describe("When method sendData is defined", () => {
    it("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    it("Then update customer group is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(updateCustomerGroup).toHaveBeenCalled();
    });
  });
});
