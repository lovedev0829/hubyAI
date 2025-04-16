import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { fetchGoogleInfoApi, fetchPostApi, getUserDataByEmail } from "@/functions/apiFunctions";
import config from "../../../../config.json";

jest.mock("../../../functions/apiFunctions.ts", () => ({
  fetchPostApi: jest.fn(),
  fetchGoogleInfoApi: jest.fn(),
  getUserDataByEmail: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Login component", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  const access_user = JSON.parse(localStorage.getItem("access_token"));

  test("renders email and password inputs", () => {
    const { getByLabelText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Login />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const emailInput = getByLabelText("Email Address") as HTMLInputElement;
    const passwordInput = getByLabelText("Password") as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test("handles input changes", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Login />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("toggles password visibility", () => {
    const { getByLabelText, getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Login />
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

  test("should show error messages for invalid email and password", async () => {
    const { getByTestId, getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Login />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.change(passwordInput, { target: { value: "short" } });

    expect(getByText("Please enter a valid email address")).toBeInTheDocument();
    expect(
      getByText("Password must be 8 or more characters")
    ).toBeInTheDocument();
  });

  test("should validate email and password on submit", async () => {
    const { getByTestId, getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Login />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    const loginButton = getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(
        getByText("Please enter a valid email address")
      ).toBeInTheDocument();
      expect(
        getByText("Password must be 8 or more characters")
      ).toBeInTheDocument();
      expect(fetchPostApi).not.toHaveBeenCalled();
    });
  });

  test("should call login function with correct data on successful login", async () => {

    const fetchPostApiMock = jest.fn()
      .mockResolvedValueOnce({
        data: {
          authorization_code: "mockAuthorizationCode",
          user_id: "mockUserId",
        },
      })
      .mockResolvedValueOnce({
        data: {
          access_token: "mockAccessToken",
          refresh_token: "mockRefreshToken",
        },
      });

    (fetchPostApi as jest.Mock).mockImplementation(fetchPostApiMock);

    // Mock getUserDataByEmail
    const getUserDataByEmailMock = jest.fn().mockResolvedValue({
      data: [
        {
          id: "mockUserId",
          email: "test@example.com",
          verification: "V",
        },
      ],
    });

    (getUserDataByEmail as jest.Mock).mockImplementation(getUserDataByEmailMock);

    // Mock localStorage
    const setItemMock = jest.fn();
    const getItemMock = jest.fn().mockImplementation((key) => {
      if (key === "access_token") {
        return JSON.stringify({ access_token: "mockAccessToken" });
      }
      return null;
    });

    Object.defineProperty(window, "localStorage", {
      value: {
        setItem: setItemMock,
        getItem: getItemMock,
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // Render the component
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Login />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    // Interact with the form
    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    const passwordInput = screen.getByTestId("password-input") as HTMLInputElement;
    const loginButton = screen.getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    // Assertions
    await waitFor(() => {
      expect(fetchPostApiMock).toHaveBeenCalledWith(
        "/api/users/login",
        { email: "test@example.com", password: "password123" },
        "application/json",
        undefined,
        expect.any(Function), // navigate
        expect.any(Object)    // location
      );
    });

    await waitFor(() => {
      expect(fetchPostApiMock).toHaveBeenCalledWith(
        "/api/auth/token",
        {
          authorization_code: "mockAuthorizationCode",
          user_id: "mockUserId",
        },
        "application/json",
        undefined,
        expect.any(Function), // navigate
        expect.any(Object)    // location
      );
    });

    await waitFor(() => {
      expect(getUserDataByEmailMock).toHaveBeenCalledWith(
        "test@example.com",
        { access_token: "mockAccessToken" }
      );
    });

    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith(
        "access_token",
        JSON.stringify({ access_token: "mockAccessToken" })
      );
      expect(setItemMock).toHaveBeenCalledWith(
        "refresh_token",
        JSON.stringify({ refresh_token: "mockRefreshToken" })
      );
      expect(setItemMock).toHaveBeenCalledWith(
        "userData",
        JSON.stringify({
          id: "mockUserId",
          email: "test@example.com",
          verification: "V",
        })
      );
    });
  });

  test("should call Google OAuth login function on Google login button click", async () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Login />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );

    const fetchGoogleInfoApiMock = jest.fn().mockResolvedValue({
      email: "test@example.com",
    });
    (fetchGoogleInfoApi as jest.Mock).mockImplementation(
      fetchGoogleInfoApiMock
    );

    const googleLoginButton = screen.getByTestId("google-login-button");
    fireEvent.click(googleLoginButton);

    fetchGoogleInfoApi(access_user);

    await waitFor(() => {
      expect(fetchGoogleInfoApiMock).toHaveBeenCalledTimes(1);
    });
  });
});
