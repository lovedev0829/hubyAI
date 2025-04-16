import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import PrototypehubPage from "./PrototypehubPage";
import config from "../../../config.json";

jest.mock("../../functions/apiFunctions.ts", () => ({
  fetchPostApi: jest.fn(),
}));

jest.mock("react-slick", () => {
  return {
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
  };
});

describe("AppInfoPage Component", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);
  test("should render without crashing", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypehubPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
  });

  test("renders Header component", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypehubPage />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("header")).toBeInTheDocument();
  });

  test("renders the featured prototypes section correctly", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypehubPage />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("FeaturedPrototypes")).toBeInTheDocument();
  });

  test("renders latest updates", () => {
    const { getAllByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypehubPage />
        </Router>
      </GoogleOAuthProvider>
    );
    const latestUpdates = getAllByTestId("update-card");
    latestUpdates.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  test("renders subscribe form", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypehubPage />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("Subscribe")).toBeInTheDocument();
  });

  test("renders EmailAddress", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypehubPage />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("EmailAddress")).toBeInTheDocument();
  });

  test("renders Footer component", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypehubPage />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("footer")).toBeInTheDocument();
  });
});
