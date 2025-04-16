import { render } from "@testing-library/react";
import AIData from "./AIData";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import userEvent from "@testing-library/user-event";
import config from "../../../config.json";

describe("AIData Component", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  const mockAppData = [
    {
      company_url: "/",
      product_logo_url: "logo1.png",
      application: "Application 1",
      description: "Description for Application 1",
    },
    {
      company_url: "/",
      product_logo_url: "logo2.png",
      application: "Application 2",
      description: "Description for Application 2",
    },
  ];
  const searchTerms = "hi test";

  test("renders without crashing", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <AIData
            isLoading={false}
            searchAppData={mockAppData}
            appData={mockAppData}
            searchAppDataUncurated={mockAppData}
            searchLlmData={mockAppData}
            searchTerms={searchTerms}
            isPressEnter={false}
          />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
  });
  test("renders correct application data", () => {
    const { getByText, getAllByAltText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <AIData
            isLoading={false}
            searchAppData={mockAppData}
            searchAppDataUncurated={mockAppData}
            searchLlmData={mockAppData}
            appData={mockAppData}
            searchTerms={searchTerms}
            isPressEnter={false}
          />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    mockAppData.forEach((app) => {
      const appNameElement = getByText(app.application);
      expect(appNameElement).toBeInTheDocument();
    });

    const logoImages = getAllByAltText("start-box");
    expect(logoImages.length).toBe(mockAppData.length);
  });

  test("links navigate correctly", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <AIData
            isLoading={false}
            searchAppData={mockAppData}
            searchAppDataUncurated={mockAppData}
            searchLlmData={mockAppData}
            appData={mockAppData}
            searchTerms={searchTerms}
            isPressEnter={false}
          />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    const app1Link = getByText(mockAppData[0].application);
    userEvent.click(app1Link);
    expect(window.location.pathname).toBe(mockAppData[0].company_url);
  });
});
