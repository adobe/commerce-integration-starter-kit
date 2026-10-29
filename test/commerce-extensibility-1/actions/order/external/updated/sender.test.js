import { addComment } from "#src/order/commerce-order-api-client";
import * as sender from "#src/order/external/updated/sender";

vi.mock("#src/order/commerce-order-api-client");

describe("Given order external updated sender", () => {
  describe("When method sendData is defined", () => {
    it("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    it("Then order add comment is called", async () => {
      const params = { data: { id: 99 } };
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(addComment).toHaveBeenCalled();
    });
  });
});
