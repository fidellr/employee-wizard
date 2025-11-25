import { useState, useEffect } from "react";
import AsyncAutocomplete from "./AsyncAutocomplete";
import { api } from "../lib/api";
import { generateEmployeeId } from "../utils/employeeId";
import type { BasicInfo } from "../types/Employee";
import "../styles/wizard.css";

interface Step1Props {
  data: Partial<BasicInfo>;
  onChange: (data: Partial<BasicInfo>) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ data, onChange, onNext }: Step1Props) {
  const [formData, setFormData] = useState<Partial<BasicInfo>>(data);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: keyof BasicInfo, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    handleChange("email", email);
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleDepartmentChange = async (department: string) => {
    handleChange("department", department);

    // Auto-generate employee ID
    try {
      const existingEmployees = await api.getAllBasicInfo();
      const employeeId = generateEmployeeId(department, existingEmployees);
      handleChange("employeeId", employeeId);
    } catch (error) {
      console.error("Failed to generate employee ID:", error);
    }
  };

  const isValid =
    formData.fullName &&
    formData.email &&
    validateEmail(formData.email) &&
    formData.department &&
    formData.role &&
    formData.employeeId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  return (
    <form className="wizard-form" onSubmit={handleSubmit}>
      <h2 className="wizard-title">Step 1: Basic Information</h2>

      <div className="form-group">
        <label className="form-label">
          Full Name<span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={formData.fullName || ""}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Enter full name"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Email<span className="required">*</span>
        </label>
        <input
          type="email"
          className={`form-input ${emailError ? "error" : ""}`}
          value={formData.email || ""}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="Enter email address"
          required
        />
        {emailError && <span className="error-message">{emailError}</span>}
      </div>

      <AsyncAutocomplete
        value={formData.department || ""}
        onChange={handleDepartmentChange}
        fetchSuggestions={api.searchDepartments}
        placeholder="Search department..."
        label="Department"
        required
      />

      <div className="form-group">
        <label className="form-label">
          Role<span className="required">*</span>
        </label>
        <select
          className="form-input"
          value={formData.role || ""}
          onChange={(e) => handleChange("role", e.target.value)}
          required
        >
          <option value="">Select role</option>
          <option value="Ops">Ops</option>
          <option value="Admin">Admin</option>
          <option value="Engineer">Engineer</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Employee ID</label>
        <input
          type="text"
          className="form-input"
          value={formData.employeeId || ""}
          disabled
          placeholder="Auto-generated"
        />
      </div>

      <div className="wizard-actions">
        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Next
        </button>
      </div>
    </form>
  );
}
