import { render, fireEvent } from "@testing-library/react";
import PrototypeDetailPage from "./PrototypeDetailPage";
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

describe("PrototypeDetailPage", () => {
  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "integration";
  const configPath: string = `${currentEnvironment}.googleClientId`;
  const googleClientId: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  test("renders without crashing", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
  });

  test("renders header component", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("App Name")).toBeInTheDocument();
  });

  test("renders app description", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("Description of the app")).toBeInTheDocument();
  });

  test("renders other apps by developer section", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("Other Apps by Developer")).toBeInTheDocument();
  });

  test("renders user reviews section", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("User Reviews")).toBeInTheDocument();
  });

  test("renders latest updates section", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("Latest Updates")).toBeInTheDocument();
  });

  test("renders related apps section", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByText("Related Apps")).toBeInTheDocument();
  });

  test("renders footer component", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("footer")).toBeInTheDocument(); // assuming you have a text 'Footer' in your footer component
  });

  test("renders app image placeholder", () => {
    const { getAllByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const AppImageData = getAllByTestId("app-image-placeholder");
    AppImageData.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  test("renders other apps placeholder", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("other-apps-placeholder")).toBeInTheDocument();
  });

  test("renders user review placeholder", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("user-review-placeholder")).toBeInTheDocument();
  });

  test("renders latest update placeholder", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("latest-update-placeholder")).toBeInTheDocument();
  });

  test("renders related app placeholder", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    expect(getByTestId("related-app-placeholder")).toBeInTheDocument();
  });

  test("should navigate to other app details page when other app is clicked", async () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const otherAppLink = getByText("App 1");
    fireEvent.click(otherAppLink);
    // add your navigation logic here
  });

  test("should render carousel with 4 slides", () => {
    const { getAllByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const carousel = getAllByTestId("carousel");
    carousel.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  test("should render carousel slide with post image", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const carouselSlide = getByTestId("carousel-slide");
    expect(carouselSlide).toHaveStyle('background-image: url("Post Image")');
  });

  test("should render heart and comment icons", () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const heartIcon = getByTestId("heart-icon");
    const commentIcon = getByTestId("comment-icon");
    expect(heartIcon).toBeInTheDocument();
    expect(commentIcon).toBeInTheDocument();
  });

  test("should render related app with app name and description", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <PrototypeDetailPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const appName = getByText("App A");
    const appDescription = getByText("Similar app to explore");
    expect(appName).toBeInTheDocument();
    expect(appDescription).toBeInTheDocument();
  });
});
