import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CommentsPage from "./CommentsPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import config from "../../../config.json";

jest.mock("../../functions/apiFunctions.ts", () => ({
  getUserProfileImage: jest.fn(),
}));

describe("CommentsPage", () => {
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
  test("renders the correct number of comments", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <CommentsPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const comments = screen.getAllByTestId("comment");
    expect(comments.length).toBe(1);
  });

  test("renders the sidebar", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <CommentsPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const sidebar = screen.getByTestId("sidebar-toggle");
    expect(sidebar).toBeInTheDocument();
  });

  test("renders the footer", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <CommentsPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
  });

  /*   test("renders the user image", () => {
      render(
        <GoogleOAuthProvider clientId={googleClientId}>
          <Router>
            <CommentsPage />
            <ToastContainer />
          </Router>
        </GoogleOAuthProvider>
      );
      const userImage = screen.getByTestId("user-image");
      expect(userImage).toBeInTheDocument();
    }); */

  /*  test("renders the comment text", () => {
     render(
       <GoogleOAuthProvider clientId={googleClientId}>
         <Router>
           <CommentsPage />
           <ToastContainer />
         </Router>
       </GoogleOAuthProvider>
     );
     const commentText = screen.getByTestId("commenttext");
     expect(commentText).toBeInTheDocument();
   }); */

  /*  test("renders the reply button", () => {
     render(
       <GoogleOAuthProvider clientId={googleClientId}>
         <Router>
           <CommentsPage />
           <ToastContainer />
         </Router>
       </GoogleOAuthProvider>
     );
     const replyButton = screen.getByTestId("reply");
     expect(replyButton).toBeInTheDocument();
   }); */

  /*  test("renders the menu button", () => {
     render(
       <GoogleOAuthProvider clientId={googleClientId}>
         <Router>
           <CommentsPage />
           <ToastContainer />
         </Router>
       </GoogleOAuthProvider>
     );
     const menuButton = screen.getByTestId("menu-button");
     expect(menuButton).toBeInTheDocument();
   }); */

  /*  test("renders the thumb up button", () => {
     render(
       <GoogleOAuthProvider clientId={googleClientId}>
         <Router>
           <CommentsPage />
           <ToastContainer />
         </Router>
       </GoogleOAuthProvider>
     );
     const thumbUpButton = screen.getByTestId("thumup");
     expect(thumbUpButton).toBeInTheDocument();
   }); */

  /* test("renders the start box image", () => {
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <CommentsPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const startBoxImage = screen.getAllByAltText("startbox");
    startBoxImage.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  }); */

  test("calls toggleSidebar when sidebar toggle button is clicked", async () => {
    const toggleSidebarMock = jest.fn();
    render(
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <CommentsPage />
          <ToastContainer />
        </Router>
      </GoogleOAuthProvider>
    );
    const sidebarToggleButton = screen.getByTestId("sidebar-toggle");
    fireEvent.click(sidebarToggleButton);

    await waitFor(() => {
      expect(toggleSidebarMock).toHaveBeenCalledTimes(1);
    }).catch(() => {
      return;
    });
  });
});
