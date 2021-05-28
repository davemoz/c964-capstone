module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "quote-props": 0,
    quotes: ["error", "double"],
    "max-len": 0,
  },
};
