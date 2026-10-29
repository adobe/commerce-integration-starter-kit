import { createProduct } from "#src/product/commerce-product-api-client";
import * as sender from "#src/product/external/created/sender";

vi.mock("#src/product/commerce-product-api-client");

describe("Given product external created sender", () => {
  describe("When method sendData is defined", () => {
    it("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    it("Then create product is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(createProduct).toHaveBeenCalled();
    });
  });
});
