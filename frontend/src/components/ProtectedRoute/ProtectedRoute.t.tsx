import { render, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { isTokenExpired } from "../../functions/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignupPage from "@/Pages/SignupPage/SignupPage";
import HomePage from "@/Pages/HomePage/HomePage";
import AboutPage from "@/Pages/AboutPage/AboutPage";
import ContactPage from "@/Pages/ContactPage/ContactPage";
import UpdateProfile from "../Auth/UpdateProfile/UpdateProfile";
import AppDetailsPage from "@/Pages/AppDetailsPage/AppDetailsPage";
import AppInfoPage from "@/Pages/AppInfoPage/AppInfoPage";
import ViewStatusPage from "@/Pages/ViewStatusPage/ViewStatusPage";
import CommentsPage from "@/Pages/CommentsPage/CommentsPage";
import PrototypehubPage from "@/Pages/PrototypehubPage/PrototypehubPage";
import UserProfilePage from "@/Pages/UserProfilePage/UserProfilePage";
import PrototypeDetailPage from "@/Pages/PrototypeDetailPage/PrototypeDetailPage";
import { ToastContainer } from "react-toastify";
import PrototypeDashboardPage from "@/Pages/PrototypeDashboardPage/PrototypeDashboardPage";
import EditAppInfoPage from "@/Pages/EditAppInfoPage/EditAppInfoPage";

import AppDetailsSubmission from "@/Pages/AppDetailsSubmission/AppDetailsSubmission";
import ReviewRequestPage from "@/Pages/ReviewRequestPage/ReviewRequestPage";
import config from "../../../config.json";
import NewLandingPage from "@/Pages/NewLandingPage/NewLandingPage";
import ForgotPasswordPage from "@/Pages/ForgotPasswordPage/ForgotPasswordPage";
import ChangePasswordPage from "@/Pages/ChangePasswordPage/ChangePasswordPage";

jest.mock("../../functions/auth", () => ({
  isTokenExpired: jest.fn(),
}));

jest.mock('swiper/react', () => {
  const MockSwiper = ({ children }) => <div>{children}</div>;
  const MockSwiperSlide = ({ children }) => <div>{children}</div>;

  return { Swiper: MockSwiper, SwiperSlide: MockSwiperSlide };
});
describe("ProtectedRoute", () => {
  const setTabMock = jest.fn();
  const mockedIsTokenExpired = isTokenExpired as jest.MockedFunction<
    typeof isTokenExpired
  >;

  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  const renderWithRouter = () => {
    return render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/" element={<NewLandingPage />} />
            <Route
              path="/signup"
              element={<SignupPage initialTab={"SignUp"} />}
            />
            <Route
              path="/login"
              element={<SignupPage initialTab={"Login"} />}
            />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/changepassword" element={<ChangePasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/prototypedetails" element={<PrototypeDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/appdetails" element={<AppDetailsPage />} />
              <Route path="/appinfo" element={<AppInfoPage />} />
              <Route path="/viewstatus" element={<ViewStatusPage />} />
              <Route path="/comments" element={<CommentsPage />} />
              <Route path="/prototypehub" element={<PrototypehubPage />} />
              <Route path="/userprofile" element={<UserProfilePage />} />
              <Route path="/review-request" element={<ReviewRequestPage />} />
              <Route
                path="prototype/dashboard"
                element={<PrototypeDashboardPage />}
              />
              <Route path="/edit-appinfo" element={<EditAppInfoPage />} />
              <Route
                path="/appdetailssubmission"
                element={<AppDetailsSubmission />}
              />
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    mockedIsTokenExpired.mockReturnValue(true);

    const { queryByText } = renderWithRouter();

    // Assuming there is a loading state or redirect behavior
    expect(queryByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedIsTokenExpired).toHaveBeenCalled();
    });
  });

  test("redirects to login if not authenticated", async () => {
    mockedIsTokenExpired.mockReturnValue(true);

    const { getByText } = renderWithRouter();

    await waitFor(() => {
      // Mock behavior should redirect to login
      expect(getByText("Login")).toBeInTheDocument();
      expect(setTabMock).toHaveBeenCalledWith("Login");
    });
  });

  test("renders child routes if authenticated", async () => {
    mockedIsTokenExpired.mockReturnValue(false);

    const { getByText } = renderWithRouter();

    await waitFor(() => {
      // Mock behavior should allow access to protected routes
      expect(getByText("Home")).toBeInTheDocument();
    });
  });

  test("checks authentication every 60 seconds", async () => {
    jest.useFakeTimers();

    // First, the user is authenticated
    mockedIsTokenExpired.mockReturnValueOnce(false);

    // Later, the token expires
    mockedIsTokenExpired.mockReturnValueOnce(true);

    const { getByText } = renderWithRouter();

    jest.advanceTimersByTime(60000);

    await waitFor(() => {
      // Expect redirection after token expiration
      expect(getByText("Login")).toBeInTheDocument();
      expect(setTabMock).toHaveBeenCalledWith("Login");
    });

    jest.useRealTimers();
  });
});
