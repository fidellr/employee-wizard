export type Role = "admin" | "ops";

export interface BasicInfo {
  fullName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface Details {
  photo: string; // Base64
  employmentType: string;
  officeLocation: string;
  notes: string;
  email?: string; // For merging
  employeeId?: string; // For merging
}

export interface DraftData {
  basicInfo?: Partial<BasicInfo>;
  details?: Partial<Details>;
}
