import { render, screen, fireEvent } from "@testing-library/react";
import UpdateProfile from "./UpdateProfile";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("../../../functions/apiFunctions.ts", () => ({
  fetchPostApi: jest.fn(),
  fetchPutApi: jest.fn(),
}));
jest.mock("react-toastify");

describe("UpdateProfile Component", () => {
  beforeEach(() => {
    localStorage.setItem("userData", JSON.stringify({ user_id: "123" }));
    localStorage.setItem("access_token", JSON.stringify("mock_access_token"));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders UpdateProfile component", () => {
    render(
      <Router>
        <UpdateProfile />
      </Router>
    );

    expect(screen.getByText("Update Profile")).toBeInTheDocument();
    expect(screen.getByText("Upload Image")).toBeInTheDocument();
  });

  test("shows error toast if no image file is selected", () => {
    render(
      <Router>
        <UpdateProfile />
      </Router>
    );

    const uploadButton = screen.getByText("Upload Image");
    fireEvent.click(uploadButton);

    expect(toast.error).toHaveBeenCalledWith("No image file selected");
  });
});
