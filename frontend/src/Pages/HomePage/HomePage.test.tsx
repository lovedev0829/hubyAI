import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import HomePage from "./HomePage";
import config from "../../../config.json";

jest.mock("../../functions/apiFunctions.ts", () => ({
  fetchPostApi: jest.fn(),
}));

describe("AppInfoPage Component", () => {
  // const mockAppData = [
  //   {
  //     company_url: "/company/1",
  //     product_logo_url: "logo1.png",
  //     application: "Application 1",
  //     description: "Description for Application 1",
  //   },
  //   {
  //     company_url: "/company/2",
  //     product_logo_url: "logo2.png",
  //     application: "Application 2",
  //     description: "Description for Application 2",
  //   },
  // ];

  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  test("should render without crashing", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <HomePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
  });

  test("should render header component", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <HomePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("Simplifying AI for creators")).toBeInTheDocument();
  });

  test("should render search input field", () => {
    const { getByPlaceholderText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <HomePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(
      getByPlaceholderText(
        "i.e. I want to record, edit and transcribe my podcast to be used in social media."
      )
    ).toBeInTheDocument();
  });

 /*  test("should render feature dropdown", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <HomePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("Featured")).toBeInTheDocument();
  }); */

/*   test("should render category dropdown", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <HomePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("All Category")).toBeInTheDocument();
  }); */

 /*  test("should render day dropdown", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <HomePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("Today")).toBeInTheDocument();
  }); */

 /*  test("should render AIData component", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <HomePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("Application 1")).toBeInTheDocument();
  }); */

  test("should render footer component", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <HomePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("footer")).toBeInTheDocument(); // assuming you have a text "Footer" in your footer component
  });
});
