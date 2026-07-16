vi.mock("#src/product/commerce-product-api-client");

import { deleteProduct } from "#src/product/commerce-product-api-client";
import * as sender from "#src/product/external/deleted/sender";

describe("Given product external deleted sender", () => {
  describe("When method sendData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    test("Then delete product is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(deleteProduct).toHaveBeenCalled();
    });
  });
});
