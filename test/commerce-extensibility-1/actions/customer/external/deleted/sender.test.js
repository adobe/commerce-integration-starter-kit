import { deleteCustomer } from "#src/customer/commerce-customer-api-client";
import * as sender from "#src/customer/external/deleted/sender";

vi.mock("#src/customer/commerce-customer-api-client");

describe("Given customer external deleted sender", () => {
  describe("When method sendData is defined", () => {
    it("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    it("Then delete customer is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(deleteCustomer).toHaveBeenCalled();
    });
  });
});
