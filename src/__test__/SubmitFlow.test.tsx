import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Step2Details from "../components/Step2Details";
import type { BasicInfo, Details } from "../types/Employee";

// Mock the API module
vi.mock("../lib/api", () => ({
  api: {
    postBasicInfo: vi.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return {};
    }),
    postDetails: vi.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return {};
    }),
    searchLocations: vi.fn().mockResolvedValue([
      { id: 1, name: "Jakarta" },
      { id: 2, name: "Surabaya" },
    ]),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

afterEach(cleanup);

describe("Submit Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles sequential POST and progress states", async () => {
    const mockBasicInfo: Partial<BasicInfo> = {
      fullName: "John Doe",
      email: "john@example.com",
      department: "Engineering",
      role: "Engineer",
      employeeId: "ENG-001",
    };

    const mockDetails: Partial<Details> = {
      photo: "data:image/png;base64,test",
      employmentType: "Full-time",
      officeLocation: "Jakarta",
      notes: "Test notes",
    };

    const mockOnChange = vi.fn();
    const mockOnSubmit = vi
      .fn()
      .mockImplementation(async (basicInfo, details) => {
        // Simulate the sequential POST behavior
        if (basicInfo) {
          console.log("⏳ Submitting basicInfo...");
          await new Promise((resolve) => setTimeout(resolve, 100));
          console.log("✅ basicInfo saved!");
        }

        console.log("⏳ Submitting details...");
        await new Promise((resolve) => setTimeout(resolve, 100));
        console.log("✅ details saved!");
        console.log("🎉 All data processed successfully!");
      });

    render(
      <BrowserRouter>
        <Step2Details
          data={mockDetails}
          basicInfo={mockBasicInfo}
          role="admin"
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      </BrowserRouter>
    );

    // Find and click submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();

    await userEvent.click(submitButton);

    // Check that submit was called
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "John Doe",
          email: "john@example.com",
        }),
        expect.objectContaining({
          photo: "data:image/png;base64,test",
          employmentType: "Full-time",
        })
      );
    });

    // Button should be disabled during submission
    expect(submitButton).toHaveTextContent(/submitting/i);
  });

  it("displays progress bar during submission", async () => {
    const mockDetails: Partial<Details> = {
      photo: "data:image/png;base64,test",
      employmentType: "Full-time",
      officeLocation: "Jakarta",
      notes: "",
    };

    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    render(
      <BrowserRouter>
        <Step2Details
          data={mockDetails}
          role="ops"
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
        />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Progress bar should appear
    await waitFor(() => {
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    });
  });
});
