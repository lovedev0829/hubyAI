import { render } from "@testing-library/react";
import Footer from "./Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
import config from "../../../config.json";

describe("Footer Component", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  test("renders About Us and Contact Us links", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Footer />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("About Us")).toBeInTheDocument();
    expect(getByText("Contact Us")).toBeInTheDocument();
  });

  test("renders social media icons", () => {
    const { getByAltText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Footer />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByAltText("facebooklogo")).toBeInTheDocument();
    expect(getByAltText("twitter")).toBeInTheDocument();
    expect(getByAltText("instagram")).toBeInTheDocument();
    expect(getByAltText("Combined-shape")).toBeInTheDocument();
  });

  test("renders copyright text", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Footer />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(
      getByText("© 2024 huby. All rights reserved.")
    ).toBeInTheDocument();
  });

  test("renders Terms link", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Footer />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("Terms")).toBeInTheDocument();
  });
});
