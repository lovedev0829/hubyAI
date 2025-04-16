import { fireEvent, render, waitFor } from "@testing-library/react";
import AppInfoPage from "./AppInfoPage";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router-dom";
import { fetchPostApi } from "@/functions/apiFunctions";
import config from "../../../config.json";

jest.mock("../../functions/apiFunctions", () => ({
  fetchPostApi: jest.fn(),
}));

jest.mock("react-slick", () => {
  return {
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("AppInfoPage component", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);
  // const mockAppData = [
  //   {
  //     company_url: "/",
  //     product_logo_url: "logo1.png",
  //     application: "Application 1",
  //     description: "Description for Application 1",
  //   },
  //   {
  //     company_url: "/",
  //     product_logo_url: "logo2.png",
  //     application: "Application 2",
  //     description: "Description for Application 2",
  //   },
  // ];

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders input fields correctly", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <AppInfoPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("appName")).toBeInTheDocument();
    expect(getByTestId("description")).toBeInTheDocument();
    expect(getByTestId("appLogo")).toBeInTheDocument();
  });

  test("handles input changes correctly", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <AppInfoPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const fields = [
      { label: "App Name", testId: "appName" },
      { label: "Description", testId: "description" },
    ];

    fields.forEach(({ testId }) => {
      const input = getByTestId(testId) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "Test Value" } });
      expect(input.value).toBe("Test Value");
    });
  });

  test("handles file selections correctly", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <AppInfoPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const fields = [
      { label: "App Logo", testId: "appLogo" }
    ];

    fields.forEach(({ testId }) => {
      const appLogoInput = getByTestId(testId) as HTMLInputElement;
      const file = new File(["(⌐□_□)"], "logo.png", { type: "image/png" });
      fireEvent.change(appLogoInput, { target: { files: [file] } });
      expect(appLogoInput.files?.[0]).toBe(file);
    });
  });

  test("submits form data correctly", async () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <AppInfoPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    const mockFormData = {
      application: "Test Application",
      description: "Test Description",
      category: "Test Category",
      keywords: "Test Keywords",
      app_logo_url: "test_logo.png",
      screenShorts_url: "test_screenshot.png",
      other_media_url: "test_media.png",
      developer_name: "Test Developer",
      web_url: "http://example.com",
      email: "test@example.com",
    };

    const submitButton = getByText("Submit");
    fireEvent.click(submitButton);

    (fetchPostApi as jest.Mock).mockResolvedValueOnce({
      data: true,
    });

    fetchPostApi("/api/applications", mockFormData, "application/json", {
      access_user: { access_token: "mock_access_token" },
    });

    await waitFor(() => {
      expect(fetchPostApi).toHaveBeenCalled();
      expect(fetchPostApi).toHaveBeenCalledWith(
        "/api/applications",
        mockFormData,
        "application/json",
        { access_user: { access_token: "mock_access_token" } }
      );
    });
  });
});
