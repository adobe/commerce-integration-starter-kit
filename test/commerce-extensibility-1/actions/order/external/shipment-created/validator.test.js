import * as validator from "#src/order/external/shipment-created/validator";

describe("Given order external shipment created validator", () => {
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
            comment: {
              comment: "Order Shipped from API",
              visibleOnFront: true,
            },
            items: [{ orderItemId: 7, qty: 1 }],
            orderId: 6,
            stockSourceCode: "default",
            tracks: [
              {
                carrierCode: "custom",
                title: "Custom Title",
                trackNumber: "Custom Value",
              },
            ],
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
      [{ data: { orderId: 7 } }],
      [
        {
          data: {
            comments: [
              {
                comment: "Order Shipped from API",
                notifyCustomer: 0,
                visibleOnFront: 1,
              },
            ],
            items: [{ orderItemId: "7", qty: "1" }],
            orderId: "6",
            stockSourceCode: "default",
            tracks: [
              {
                carrierCode: "custom",
                title: "Custom Title",
                trackNumber: "Custom Value",
              },
            ],
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
