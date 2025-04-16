export default {
  testEnvironment: "jsdom",
  transform: {
    "\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.json", // ts-jest config should be here
      },
    ],
  },

  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
