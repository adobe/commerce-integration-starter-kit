// Jest CJS shim for camelcase (ESM-only in v8+).
// Maps to the CJS-compatible camelcase@5 already installed as a transitive dep,
// and exposes `.default` to match the ESM named export used by aio-commerce-lib-core.
const camelcase = require("camelcase");
module.exports = camelcase;
module.exports.default = camelcase;
