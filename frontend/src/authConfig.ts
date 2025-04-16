// src/authConfig.ts
import { Configuration } from "@azure/msal-browser";
import config from "../config.json";

const currentEnvironment: string =
  process.env.VITE_HUBY_ENV || "development";

const office365ClientId: string = `${currentEnvironment}.office365ClientId`
  .split(".")
  .reduce((obj: any, key: string) => obj?.[key], config);

const office365ApiUrl: string = `${currentEnvironment}.office365ApiUrl`
  .split(".")
  .reduce((obj: any, key: string) => obj?.[key], config);

const office365RedirectUriLogin: string =
  `${currentEnvironment}.office365RedirectUriLogin`
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

// const office365RedirectUriSignup: string =
//   `${currentEnvironment}.office365RedirectUriSignup`
//     .split(".")
//     .reduce((obj: any, key: string) => obj?.[key], config);

const msalConfig: Configuration = {
  auth: {
    clientId: office365ClientId, // Application (client) ID from Azure
    authority: office365ApiUrl,
    redirectUri: office365RedirectUriLogin, // Your redirect URI
  },
  // cache: {
  //   cacheLocation: "sessionStorage", // This configures where the tokens will be stored
  //   storeAuthStateInCookie: false,
  // },
};

const loginRequest = {
  scopes: ["User.Read", "profile", "openid"],
};

// const signupRequest = {
//   scopes: ["User.Read", "profile", "openid", "email"],
//   redirectUri: "http://localhost:5173/signup",
// };

// const tokenRequest = {
//     scopes:["Mail .Read"]
// }

export { msalConfig, loginRequest };
