import { fireEvent, render, screen } from "@testing-library/react";
import UserProfilePage from "./UserProfilePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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

describe("UserProfilePage component", () => {
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

  test("should render without crashing", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
  });

 /*  test("displays user profile information correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      screen.getByText("Passionate about technology and design")
    ).toBeInTheDocument();
    // Add more assertions for other profile information
  }); */

  test("allows editing profile", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("Edit Profile"));
  });

  test("displays reputation score correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(screen.getByText("950")).toBeInTheDocument();
    expect(screen.getByText("+25")).toBeInTheDocument();
  });

  test("displays bio section correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(screen.getByText("Bio Section")).toBeInTheDocument();
    expect(
      screen.getByText("Highlighting user expertise and interests")
    ).toBeInTheDocument();
  });

  test("displays activity section correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(screen.getByText("Activity Section")).toBeInTheDocument();
    expect(
      screen.getByText("User's recent actions and interactions")
    ).toBeInTheDocument();
  });

  /* test("displays recent activity correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByTestId("Greatdiscussion")).toBeInTheDocument();
  }); */

  test("allows saving changes to profile", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByText("Save Changes"));
  });

  test("displays edit profile button correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(screen.getByTestId("EditProfile")).toBeInTheDocument();
  });

  test("displays location input field correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(
      screen.getByPlaceholderText("Enter your location")
    ).toBeInTheDocument();
  });

  test("displays company input field correctly", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <UserProfilePage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(
      screen.getByPlaceholderText("Enter your company affiliation")
    ).toBeInTheDocument();
  });
});
