import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "./SignUp";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { fetchGoogleInfoApi, fetchPostApi } from "@/functions/apiFunctions";
import userEvent from "@testing-library/user-event";
import config from "../../../../config.json";

jest.mock("../../../functions/apiFunctions.ts", () => ({
  fetchPostApi: jest.fn(),
  fetchGoogleInfoApi: jest.fn(),
}));

describe("SignUp component", () => {
  const setTabMock = jest.fn();
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  const access_user = JSON.parse(localStorage.getItem("access_token"));

  test("renders input fields and button correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignUp setTab={setTabMock} />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Work Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Create account")).toBeInTheDocument();
  });

  test("handles input changes correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignUp setTab={setTabMock} />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const fullNameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Work Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(fullNameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("toggles password visibility", () => {
    const { getByLabelText, getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignUp setTab={setTabMock} />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const passwordInput = getByLabelText("Password") as HTMLInputElement;
    const toggleButton = getByTestId("toggle-password-button");

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  test("validates first name correctly", async () => {
    const { getByLabelText, getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignUp setTab={setTabMock} />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const fullNameInput = getByLabelText("Full Name");

    fireEvent.change(fullNameInput, { target: { value: "" } });
    fireEvent.click(getByText("Create account"));

    await waitFor(() => {
      expect(getByText("First Name is required")).toBeInTheDocument();
    });

    fireEvent.change(fullNameInput, { target: { value: "John" } });
    fireEvent.click(getByText("Create account"));

    await waitFor(() => {
      expect(screen.queryByText("First Name is required")).toBeNull();
    });
  });

  test("validates email correctly", async () => {
    const { getByLabelText, getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignUp setTab={setTabMock} />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const emailInput = getByLabelText("Work Email");

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.click(getByText("Create account"));

    await waitFor(() => {
      expect(
        getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });

    fireEvent.change(emailInput, { target: { value: "valid@email.com" } });
    fireEvent.click(getByText("Create account"));

    await waitFor(() => {
      expect(
        screen.queryByText("Please enter a valid email address")
      ).toBeNull();
    });
  });

  test("validates password correctly", async () => {
    const { getByLabelText, getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignUp setTab={setTabMock} />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const passwordInput = getByLabelText("Password");

    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.click(getByText("Create account"));

    await waitFor(() => {
      expect(
        getByText("Password must be 8 or more characters")
      ).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: "validpassword" } });
    fireEvent.click(getByText("Create account"));

    await waitFor(() => {
      expect(
        screen.queryByText("Password must be 8 or more characters")
      ).toBeNull();
    });
  });

  test("handles sign-up correctly", async () => {
    const mockFetchPostApi = fetchPostApi as jest.Mock;
    mockFetchPostApi.mockResolvedValueOnce({ data: true });

    const { getByLabelText, getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignUp setTab={setTabMock} />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    const fullNameInput = getByLabelText("Full Name");
    const emailInput = getByLabelText("Work Email");
    const passwordInput = getByLabelText("Password");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(getByText("Create account"));

    await waitFor(() => {
      expect(fetchPostApi).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(setTabMock).toHaveBeenCalledWith("Login");
    });
  });

  test("handles OAuth signup", async () => {
    (fetchGoogleInfoApi as jest.Mock).mockResolvedValueOnce({ data: true });

    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <SignUp setTab={setTabMock} />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    const googleOAuthButton = screen.getByTestId("google-oauth-button");
    userEvent.click(googleOAuthButton);

    fetchGoogleInfoApi(access_user);

    await waitFor(() => {
      expect(fetchGoogleInfoApi).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(setTabMock).toHaveBeenCalledWith("Login");
    });
  });
});
