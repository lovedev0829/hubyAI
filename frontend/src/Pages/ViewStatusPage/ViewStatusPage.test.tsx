import { render, screen } from "@testing-library/react";
import ViewStatusPage from "./ViewStatusPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import config from "../../../config.json";

jest.mock("../../functions/apiFunctions.ts", () => ({
  fetchPostApi: jest.fn(),
  fetchGetApi: jest.fn(),
}));

describe("ViewStatusPage component", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  // Helper function to render the component
  const renderComponent = () => {
    return render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <ViewStatusPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
  };


  /* test("renders application submitted list item", () => {
    renderComponent();
    expect(screen.getByText("Application Submitted")).toBeInTheDocument();
  }); */

  /* test("renders app reviewed list item", () => {
    renderComponent();
    expect(screen.getByText("App Reviewed")).toBeInTheDocument();
  }); */

  /* test("renders app approved list item", () => {
    renderComponent();
    expect(screen.getByText("App Approved")).toBeInTheDocument();
  }); */

  test("renders posted on marketplace list item", () => {
    renderComponent();
    expect(screen.getByText("Posted on Marketplace")).toBeInTheDocument();
  });

  /* test("renders date picker input", () => {
    renderComponent();
    expect(screen.getByTestId("datepicker")).toBeInTheDocument();
  }); */

  /* test("renders feedback input field", () => {
    renderComponent();
    expect(screen.getByTestId("Describe")).toBeInTheDocument();
  }); */

  /* test("renders submit inquiry button", () => {
    renderComponent();
    expect(screen.getByText("Submit inquiry")).toBeInTheDocument();
  }); */
});
