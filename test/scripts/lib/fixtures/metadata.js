const CREATE_COMMERCE_AND_BACKOFFICE_PROVIDERS_METADATA = {
  product: ["commerce", "backoffice"],
  customer: [],
  order: [],
  stock: [],
};

const CREATE_ONLY_COMMERCE_PROVIDERS_METADATA = {
  product: ["commerce"],
  customer: [],
  order: [],
  stock: [],
};

const CREATE_ONLY_BACKOFFICE_PROVIDERS_METADATA = {
  product: ["backoffice"],
  customer: [],
  order: [],
  stock: [],
};

module.exports = {
  CREATE_COMMERCE_AND_BACKOFFICE_PROVIDERS_METADATA,
  CREATE_ONLY_COMMERCE_PROVIDERS_METADATA,
  CREATE_ONLY_BACKOFFICE_PROVIDERS_METADATA,
};
