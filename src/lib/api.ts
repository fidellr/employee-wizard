import type { Department, Location, BasicInfo, Details } from "../types/Employee";

const API_BASE_1 = import.meta.env.VITE_API_1;
const API_BASE_2 = import.meta.env.VITE_API_1;

export const api = {
  // Step 1 API
  async searchDepartments(query: string): Promise<Department[]> {
    const response = await fetch(
      `${API_BASE_1}/departments?name_like=${query}`
    );
    if (!response.ok) throw new Error("Failed to fetch departments");
    return response.json();
  },

  async getBasicInfo(
    page: number = 1,
    limit: number = 10
  ): Promise<BasicInfo[]> {
    const response = await fetch(
      `${API_BASE_1}/basicInfo?_page=${page}&_limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch basic info");
    return response.json();
  },

  async getAllBasicInfo(): Promise<BasicInfo[]> {
    const response = await fetch(`${API_BASE_1}/basicInfo`);
    if (!response.ok) throw new Error("Failed to fetch all basic info");
    return response.json();
  },

  async postBasicInfo(data: BasicInfo): Promise<BasicInfo> {
    // Simulate 3s delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const response = await fetch(`${API_BASE_1}/basicInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to post basic info");
    return response.json();
  },

  // Step 2 API
  async searchLocations(query: string): Promise<Location[]> {
    const response = await fetch(`${API_BASE_2}/locations?name_like=${query}`);
    if (!response.ok) throw new Error("Failed to fetch locations");
    return response.json();
  },

  async getDetails(page: number = 1, limit: number = 10): Promise<Details[]> {
    const response = await fetch(
      `${API_BASE_2}/details?_page=${page}&_limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch details");
    return response.json();
  },

  async getAllDetails(): Promise<Details[]> {
    const response = await fetch(`${API_BASE_2}/details`);
    if (!response.ok) throw new Error("Failed to fetch all details");
    return response.json();
  },

  async postDetails(data: Details): Promise<Details> {
    // Simulate 3s delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const response = await fetch(`${API_BASE_2}/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to post details");
    return response.json();
  },
};
