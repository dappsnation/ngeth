module.exports = {
  displayName: 'playground-contracts',
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": { tsconfig: "<rootDir>/tsconfig.spec.json" },
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/e2e/playground-contracts",
  testEnvironment: "node",
};