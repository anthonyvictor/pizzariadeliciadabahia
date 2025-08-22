module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", // usa parser TS
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals", // regras recomendadas pelo Next
    "plugin:@typescript-eslint/recommended", // regras recomendadas TS
  ],
  rules: {
    // Aqui você pode sobrescrever regras, ex:
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/explicit-function-return-type": "off", // se quiser
  },
};
