import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import config from "../../../config.json";

// Mock the API function getUserProfileImage
jest.mock("../../functions/apiFunctions.ts", () => ({
  getUserProfileImage: jest.fn(),
}));

describe("Header Component", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "development";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  beforeEach(() => {
    // Clear local storage before each test
    localStorage.clear();
  });

  test("renders logo", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Header path="/" />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const logoElement = screen.getByAltText("Logo");
    expect(logoElement).toBeInTheDocument();
  });

  test("renders navigation links when not logged in", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Header path="/" />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const appDetailsLink = screen.getByText("App Details");
    const prototypeHubLink = screen.getByText("Prototype hub");
    const submitAppLink = screen.getByText("Submit an App");
    expect(appDetailsLink).toBeInTheDocument();
    expect(prototypeHubLink).toBeInTheDocument();
    expect(submitAppLink).toBeInTheDocument();
  });

  test("renders login and signup links when not logged in", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Header path="/" />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const loginLink = screen.getByText("Login");
    const signUpLink = screen.getByText("Sign up");
    expect(loginLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
  });

  test("renders user profile image when logged in", () => {
    // Simulate logged-in state by setting userData in localStorage
    const userData = { user_id: "123" };
    localStorage.setItem("userData", JSON.stringify(userData));
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Header path="/" />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const userImage = screen.getByAltText("User");
    expect(userImage).toBeInTheDocument();
  });

  test("opens mobile menu on menu button click", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Header path="/" />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const menuButton = screen.getByTestId("mobilemenu-btn");
    fireEvent.click(menuButton);
    const submitAppLink = screen.getByText("Submit an App");
    expect(submitAppLink).toBeInTheDocument();
  });
});
