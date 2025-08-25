const CREATE_COMMERCE_AND_BACKOFFICE_PROVIDERS = {
  product: ["commerce", "backoffice"],
  customer: [],
  order: [],
  stock: [],
};

const CREATE_COMMERCE_PROVIDER_ONLY = {
  product: ["commerce"],
  customer: [],
  order: [],
  stock: [],
};

const CREATE_BACKOFFICE_PROVIDER_ONLY = {
  product: ["backoffice"],
  customer: [],
  order: [],
  stock: [],
};

const MISSING_ENTITIES_CLIENT_REGISTRATION = {
  product: ["commerce"],
  order: [],
  stock: [],
};

module.exports = {
  CREATE_COMMERCE_AND_BACKOFFICE_PROVIDERS,
  CREATE_COMMERCE_PROVIDER_ONLY,
  CREATE_BACKOFFICE_PROVIDER_ONLY,
  MISSING_ENTITIES_CLIENT_REGISTRATION,
};
