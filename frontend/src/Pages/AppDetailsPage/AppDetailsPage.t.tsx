// import { render } from "@testing-library/react";
// import { BrowserRouter as Router } from "react-router-dom";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { ToastContainer } from "react-toastify";
// import AppDetailsPage from "./AppDetailsPage"; // Adjust the path as per your project structure

// const googleClientId = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your actual client ID

jest.mock('swiper/react', () => {
  const MockSwiper = ({ children }) => <div>{children}</div>;
  const MockSwiperSlide = ({ children }) => <div>{children}</div>;

  return { Swiper: MockSwiper, SwiperSlide: MockSwiperSlide };
});

describe("AppDetailsPage", () => {
  // test("should render the main application details section", () => {
  //   const { getByText } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   expect(getByText("Application Details")).toBeInTheDocument();
  // });

  // test("should render the related applications section", () => {
  //   const { getByText, getAllByTestId } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   expect(getByText("Related Applications")).toBeInTheDocument();
  //   const relatedAppElements = getAllByTestId("related-app");
  //   relatedAppElements.forEach((element) => {
  //     expect(element).toBeInTheDocument();
  //   });
  // });

  // test("should render the ratings section", () => {
  //   const { getByText, getAllByTestId } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   expect(getByText("Ratings:")).toBeInTheDocument();
  //   const ratingElements = getAllByTestId("rating-component");
  //   ratingElements.forEach((rating) => {
  //     expect(rating).toBeInTheDocument();
  //   });
  // });

  // test("should render the product description section", () => {
  //   const { getByText } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   expect(getByText("Product Description")).toBeInTheDocument();
  // });

  // test("should handle sidebar toggle correctly", () => {
  //   const { getByTestId } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   const sidebarToggleButton = getByTestId("sidebar-toggle");
  //   expect(sidebarToggleButton).toBeInTheDocument();
  // });

  // test("should render toast notifications when triggered", () => {
  //   const { getByText } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   // Simulate triggering a toast notification
  //   // Assuming the component has logic to trigger a toast message
  //   expect(getByText("Notification Message")).toBeInTheDocument(); // Replace with your actual notification message
  // });

  // test("should handle user authentication via Google OAuth", () => {
  //   const { getByTestId } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   const googleAuthButton = getByTestId("google-auth-button");
  //   expect(googleAuthButton).toBeInTheDocument();
  // });

  // test("should display error message on failed data fetch", async () => {
  //   // Mock the API call to simulate a failed fetch
  //   (global.fetch as jest.Mock) = jest.fn(() =>
  //     Promise.resolve({
  //       ok: false,
  //       status: 500,
  //       json: () => Promise.resolve({ message: "Internal Server Error" }),
  //     })
  //   );

  //   const { getByText } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   expect(await getByText("Failed to load application details.")).toBeInTheDocument();
  // });

  // test("should render loading spinner while data is being fetched", () => {
  //   const { getByTestId } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   const loadingSpinner = getByTestId("loading-spinner");
  //   expect(loadingSpinner).toBeInTheDocument();
  // });

  // test("should display no data message if no related applications are found", () => {
  //   const { getByText } = render(
  //     <GoogleOAuthProvider clientId={googleClientId}>
  //       <Router>
  //         <AppDetailsPage />
  //         <ToastContainer />
  //       </Router>
  //     </GoogleOAuthProvider>
  //   );

  //   expect(getByText("No related applications found.")).toBeInTheDocument();
  // });
});
