const CREATE_COMMERCE_AND_BACKOFFICE_REGISTRATIONS = {
  product: ["commerce", "backoffice"],
  customer: [],
  order: [],
  stock: [],
};

const CREATE_ONLY_COMMERCE_REGISTRATIONS = {
  product: ["commerce"],
  customer: [],
  order: [],
  stock: [],
};

const CREATE_ONLY_BACKOFFICE_REGISTRATIONS = {
  product: ["backoffice"],
  customer: [],
  order: [],
  stock: [],
};

module.exports = {
  CREATE_COMMERCE_AND_BACKOFFICE_REGISTRATIONS,
  CREATE_ONLY_COMMERCE_REGISTRATIONS,
  CREATE_ONLY_BACKOFFICE_REGISTRATIONS,
};
