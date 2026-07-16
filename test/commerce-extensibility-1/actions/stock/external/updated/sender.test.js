vi.mock("#src/stock/commerce-stock-api-client");

import { updateStock } from "#src/stock/commerce-stock-api-client";
import * as sender from "#src/stock/external/updated/sender";

describe("Given stock external updated sender", () => {
  describe("When method sendData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    test("Then update stock is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(updateStock).toHaveBeenCalled();
    });
  });
});
