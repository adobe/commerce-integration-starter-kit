module.exports = {
  businessConfig: {
    schema: [
      {
        name: "exampleList",
        type: "list",
        label: "Example List",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
        default: "option1",
        description: "This is a description for the example list",
      },
      {
        name: "currency",
        type: "text",
        label: "Currency",
      },
      {
        name: "paymentMethod",
        type: "text",
        label: "Payment Test Method",
      },
      {
        name: "testField",
        type: "text",
        description: "This is a description for the test field",
        label: "Test Field",
        default: "Test Default Value1",
      },
    ],
  },
};
