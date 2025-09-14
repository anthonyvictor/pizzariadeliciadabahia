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
    "@typescript-eslint/no-explicit-any": "off", // desliga
    "prefer-const": "off", // desliga
    "@typescript-eslint/no-non-null-assertion": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "react/display-name": "off",
    "@next/next/no-img-element": "off",
    "jsx-a11y/alt-text": "off",
  },
};
