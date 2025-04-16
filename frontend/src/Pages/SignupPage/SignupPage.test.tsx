import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import SignupPage from "./SignupPage";
import config from "../../../config.json";

jest.mock("../../functions/apiFunctions.ts", () => ({
  fetchPostApi: jest.fn(),
}));

describe("SignupPage Component", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  test("should render without crashing", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignupPage initialTab="Signup" />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
  });

  test("should switch to Login tab when Login button is clicked", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignupPage initialTab="SignUp" />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    const loginButton = getByText("Log In");
    fireEvent.click(loginButton);

    expect(loginButton).toHaveClass("font-bold");
  });

  test("should switch to SignUp tab when SignUp button is clicked", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignupPage initialTab="Login" />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    const signUpButton = getByText("Sign up free");
    fireEvent.click(signUpButton);

    expect(signUpButton).toHaveClass("font-bold");
  });
});
