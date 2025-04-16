import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router } from "react-router-dom";

// Mock images and icons
jest.mock("../../assets/Images/Home.png", () => "home.png");
jest.mock("react-icons/io5", () => ({
  IoClose: () => <span>CloseIcon</span>,
}));

describe("Sidebar Component", () => {
  const mockOnClose = jest.fn();

  const renderSidebar = (isOpen: boolean, isActive: string) => {
    return render(
      <Router>
        <Sidebar isOpen={isOpen} onClose={mockOnClose} isActive={isActive} />
      </Router>
    );
  };

  test("renders Sidebar component when open", () => {
    renderSidebar(true, "App info");

    // Check if the sidebar items are present
    expect(screen.getByText("Basic Info")).toBeInTheDocument();
    expect(screen.getByText("Submission Status")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    renderSidebar(true, "App info");

    // We are testing for the button with the 'CloseIcon' text
    fireEvent.click(screen.getByText("CloseIcon"));

    // Check if the onClose function is called once
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("applies active class correctly for Basic Info", () => {
    renderSidebar(true, "App info");

    const basicInfoLink = screen.getByText("Basic Info");

    // Ensure that the active class is applied to the active item
    expect(basicInfoLink).toHaveClass("bg-[#FF7F50]");
  });

  test("applies inactive class correctly for Basic Info", () => {
    renderSidebar(true, "View Submission status");

    const basicInfoLink = screen.getByText("Basic Info");

    // Ensure that the inactive class is applied when the item is not active
    expect(basicInfoLink).not.toHaveClass("bg-[#FF7F50]");
  });

  test("applies active class correctly for Submission Status", () => {
    renderSidebar(true, "View Submission status");

    const submissionStatusLink = screen.getByText("Submission Status");

    // Ensure the 'Submission Status' link is active
    expect(submissionStatusLink).toHaveClass("bg-[#FF7F50]");
  });

  test("applies inactive class correctly for Submission Status", () => {
    renderSidebar(true, "App info");

    const submissionStatusLink = screen.getByText("Submission Status");

    // Ensure the 'Submission Status' link is inactive when not selected
    expect(submissionStatusLink).not.toHaveClass("bg-[#FF7F50]");
  });

  test("applies active class correctly for Comments", () => {
    renderSidebar(true, "UserComments");

    const commentsLink = screen.getByText("Comments");

    // Ensure the 'Comments' link is active
    expect(commentsLink).toHaveClass("bg-[#FF7F50]");
  });

  test("applies inactive class correctly for Comments", () => {
    renderSidebar(true, "App info");

    const commentsLink = screen.getByText("Comments");

    // Ensure the 'Comments' link is inactive when not selected
    expect(commentsLink).not.toHaveClass("bg-[#FF7F50]");
  });
});
