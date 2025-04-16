import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/HomePage/HomePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import SignupPage from "./Pages/SignupPage/SignupPage";
import UpdateProfile from "./components/Auth/UpdateProfile/UpdateProfile";
import Appdetails from "./Pages/AppDetailsPage/AppDetailsPage";
import Appinfo from "./Pages/AppInfoPage/AppInfoPage";
import Viewstatus from "./Pages/ViewStatusPage/ViewStatusPage";
// import Comments from "./Pages/CommentsPage/CommentsPage";
import PrototypehubPage from "./Pages/PrototypehubPage/PrototypehubPage";
import UserProfilePage from "./Pages/UserProfilePage/UserProfilePage.js";
import PrototypeDetailPage from "./Pages/PrototypeDetailPage/PrototypeDetailPage";
import AboutPage from "./Pages/AboutPage/AboutPage";
import ContactPage from "./Pages/ContactPage/ContactPage";
import PrivacyPage from "./Pages/PrivacyPage/PrivacyPage";
import VisionPage from "./Pages/Vision/VisionPage";
import TermsPage from "./Pages/TermsPage/TermsPage";
// import ValuesPage from "./Pages/ValuesPage/ValuesPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AppDetailsSubmission from "./Pages/AppDetailsSubmission/AppDetailsSubmission";

import EditAppInfoPage from "./Pages/EditAppInfoPage/EditAppInfoPage";
import PrototypeDashboardPage from "./Pages/PrototypeDashboardPage/PrototypeDashboardPage";
import ApplicationSourcePage from "./Pages/ApplicationSourcePage/ApplicationSourcePage";
import ApplicationModelPage from "./Pages/ApplicationModelPage/ApplicationModelPage";
import ApplicationMarketingPage from "./Pages/ApplicationMarketingPage/ApplicationMarketingPage";
import ApplicationOwnershipPage from "./Pages/ApplicationOwnershipPage/ApplicationOwnershipPage";
import ApplicationRunTimePage from "./Pages/ApplicationRunTimePage/ApplicationRunTimePage";
import ReviewRequestPage from "./Pages/ReviewRequestPage/ReviewRequestPage";
import ReviewResponsePage from "./Pages/ReviewResponsePage/ReviewResponsePage";
import ApplicationRatingPage from "./Pages/ApplicationRatingPage/ApplicationRatingPage";
import UserCommentsPage from "./Pages/UserCommentsPage/UserCommentsPage";
import config from "../config.json";
import ViewReviewResponse from "./Pages/ViewReviewResponse/ViewReviewResponse";
import NewLandingPage from "./Pages/NewLandingPage/NewLandingPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage/ForgotPasswordPage";
import ChangePasswordPage from "./Pages/ChangePasswordPage/ChangePasswordPage";
import Submitpage from "./Pages/Submitpage/Submitpage"
import Landing from "./Pages/Landing/Landing";
import SearchPage from "./Pages/SearchPage/SearchPage";

function App() {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "development";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);
  // console.log(googleClientId, "googleClientId");

  return (
    <>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/" element={<NewLandingPage />} />
          <Route path="/SearchPage" element={<SearchPage />} />
          <Route
            path="/signup"
            element={<SignupPage initialTab={"SignUp"} />}
          />
          <Route path="/Landing" element={<Landing />} />
          <Route path="/Submitpage" element={<Submitpage />} />
          <Route path="/login" element={<SignupPage initialTab={"Login"} />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/changepassword" element={<ChangePasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/vision" element={<VisionPage />} />
          {/* <Route path="/values" element={<ValuesPage />} /> */}
          <Route path="/appdetails" element={<Appdetails />} />
          <Route path="/preview" element={<Appdetails />} />
          <Route path="/prototypedetails" element={<PrototypeDetailPage />} />
          <Route
            path="/application/review/response"
            element={<ReviewResponsePage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/appinfo" element={<Appinfo />} />
            <Route path="/update/profile" element={<UpdateProfile />} />
            <Route path="/viewstatus" element={<Viewstatus />} />
            <Route path="/comments" element={<UserCommentsPage />} />
            <Route path="/prototypehub" element={<PrototypehubPage />} />
            <Route path="/userprofile" element={<UserProfilePage />} />
            <Route
              path="prototype/dashboard"
              element={<PrototypeDashboardPage />}
            />
            <Route path="/edit/appinfo" element={<EditAppInfoPage />} />
            <Route
              path="/appdetails/submission"
              element={<AppDetailsSubmission />}
            />
            <Route
              path="/application/source"
              element={<ApplicationSourcePage />}
            />
            <Route
              path="/application/model"
              element={<ApplicationModelPage />}
            />
            <Route
              path="/application/marketing"
              element={<ApplicationMarketingPage />}
            />
            <Route
              path="/application/ownership"
              element={<ApplicationOwnershipPage />}
            />
            <Route
              path="/application/runtime"
              element={<ApplicationRunTimePage />}
            />
            <Route
              path="/application/review/request"
              element={<ReviewRequestPage />}
            />
            <Route
              path="/application/rating"
              element={<ApplicationRatingPage />}
            />
            {/* <Route path="/application/usercomments" element={<Comments />} /> */}
            <Route
              path="/application/review/show/response"
              element={<ViewReviewResponse />}
            />
          </Route>
        </Routes>
      </GoogleOAuthProvider>
      {/* <Footer />  */}
    </>
  );
}

export default App;
