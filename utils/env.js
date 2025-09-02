const v = require("valibot");

const NonEmptyStringSchema = v.pipe(
  v.string(),
  v.nonEmpty("The string should contain at least one character."),
);

const requireEnvVars = (keys) => {
  return v.object(v.entriesFromList(keys, NonEmptyStringSchema));
};

module.exports = {
  requireEnvVars,
};
