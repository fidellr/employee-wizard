import { useState } from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, afterEach, vi } from "vitest";
import AsyncAutocomplete from "../components/AsyncAutocomplete";

function TestWrapper({
  fetchSuggestions,
  label = "Department",
  placeholder = "Search...",
  required = false,
  initial = "",
  onChangeSpy,
}: {
  fetchSuggestions: (q: string) => Promise<Array<{ id: number; name: string }>>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  initial?: string;
  onChangeSpy?: (v: string) => void;
}) {
  const [value, setValue] = useState(initial);
  const handleChange = (v: string) => {
    onChangeSpy?.(v);
    setValue(v);
  };
  return (
    <AsyncAutocomplete
      value={value}
      onChange={handleChange}
      fetchSuggestions={fetchSuggestions}
      placeholder={placeholder}
      label={label}
      required={required}
    />
  );
}

afterEach(cleanup);
describe("AsyncAutocomplete", () => {
  it("renders the input with label and placeholder", () => {
    const mockFetchSuggestions = vi.fn().mockResolvedValue([]);
    render(
      <TestWrapper
        fetchSuggestions={mockFetchSuggestions}
        label="Department"
        placeholder="Search..."
        required
      />
    );

    expect(screen.getByText("Department")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Search...");
  });

  it("fetches and displays suggestions correctly when typing", async () => {
    const mockFetchSuggestions = vi.fn().mockResolvedValue([
      { id: 1, name: "Engineering" },
      { id: 2, name: "Operations" },
    ]);

    render(
      <TestWrapper
        fetchSuggestions={mockFetchSuggestions}
        label="Department"
        placeholder="Search..."
        required
      />
    );

    const input = screen.getByRole("textbox");

    await userEvent.type(input, "Eng", { delay: 20 });

    // Wait for debounce and fetch call
    await waitFor(() => {
      expect(mockFetchSuggestions).toHaveBeenCalledWith("Eng");
    });

    // Suggestions appear
    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Operations")).toBeInTheDocument();
    });

    // Select a suggestion -> input value should update via wrapper's state
    await userEvent.click(screen.getByText("Engineering"));
    await waitFor(() => {
      expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
        "Engineering"
      );
    });
  });

  it("shows loading state while fetching", async () => {
    const mockFetchSuggestions = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise<Array<{ id: number; name: string }>>((resolve) =>
            setTimeout(() => resolve([]), 100)
          )
      );

    render(
      <TestWrapper
        fetchSuggestions={mockFetchSuggestions}
        label="Department"
        placeholder="Search..."
      />
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });
});
