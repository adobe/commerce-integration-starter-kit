import * as validator from "#src/order/external/shipment-updated/validator";

describe("Given order external shipment updated validator", () => {
  describe("When method validateData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(validator.validateData).toBeInstanceOf(Function);
    });
  });
  describe("When data to validate is valid", () => {
    it.each([
      [
        {
          data: {
            id: 9,
            orderId: 6,
            items: [{ entityId: 12, orderItemId: 7, qty: 1 }],
            tracks: [
              {
                entityId: 13,
                trackNumber: "Custom Value",
                title: "Custom Title",
                carrierCode: "custom",
              },
            ],
            comments: [
              {
                entityId: 14,
                notifyCustomer: false,
                comment: "Order Shipped from API",
                visibleOnFront: true,
              },
            ],
            stockSourceCode: "default",
          },
        },
      ],
    ])("Then for %o,  returns successful response", (params) => {
      const SUCCESSFUL_RESPONSE = { success: true };
      expect(validator.validateData(params)).toMatchObject(SUCCESSFUL_RESPONSE);
    });
  });
  describe("When data to validate is not valid", () => {
    it.each([
      [{ data: { id: 9, orderId: 6 } }],
      [
        {
          data: {
            id: "9",
            orderId: "6",
            items: [{ entityId: "12", orderItemId: "7", qty: "1" }],
            tracks: [
              {
                entityId: "13",
                trackNumber: "Custom Value",
                title: "Custom Title",
                carrierCode: "custom",
              },
            ],
            comments: [
              {
                entityId: "14",
                notifyCustomer: 0,
                comment: "Order Shipped from API",
                visibleOnFront: 1,
              },
            ],
            stockSourceCode: "default",
          },
        },
      ], // wrong type property
    ])("Then for %o,  returns error response", (params) => {
      const UNSUCCESSFUL_RESPONSE = { success: false };
      expect(validator.validateData(params)).toMatchObject(
        UNSUCCESSFUL_RESPONSE,
      );
    });
  });
});
