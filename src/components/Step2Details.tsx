import { useState, useEffect } from "react";
import AsyncAutocomplete from "./AsyncAutocomplete";
import PhotoUpload from "./PhotoUpload";
import ProgressBar from "./ProgressBar";
import { api } from "../lib/api";
import type { Details, BasicInfo, Role } from "../types/Employee";

interface Step2Props {
  data: Partial<Details>;
  basicInfo?: Partial<BasicInfo>;
  role: Role;
  onChange: (data: Partial<Details>) => void;
  onSubmit: (basicInfo: BasicInfo | null, details: Details) => Promise<void>;
  onBack?: () => void;
}

export default function Step2Details({
  data,
  basicInfo,
  role,
  onChange,
  onSubmit,
  onBack,
}: Step2Props) {
  const [formData, setFormData] = useState<Partial<Details>>(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: keyof Details, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const isValid =
    formData.photo && formData.employmentType && formData.officeLocation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    setProgress(0);

    try {
      const detailsData: Details = {
        photo: formData.photo!,
        employmentType: formData.employmentType!,
        officeLocation: formData.officeLocation!,
        notes: formData.notes || "",
        email: basicInfo?.email,
        employeeId: basicInfo?.employeeId,
      };

      // Prepare basic info for admin role
      const basicInfoData =
        role === "admin" && basicInfo
          ? {
              fullName: basicInfo.fullName!,
              email: basicInfo.email!,
              department: basicInfo.department!,
              role: basicInfo.role!,
              employeeId: basicInfo.employeeId!,
            }
          : null;

      await onSubmit(basicInfoData, detailsData);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  return (
    <form className="wizard-form" onSubmit={handleSubmit}>
      <h2 className="wizard-title">Step 2: Details</h2>

      <PhotoUpload
        value={formData.photo || ""}
        onChange={(base64) => handleChange("photo", base64)}
        label="Photo"
      />

      <div className="form-group">
        <label className="form-label">
          Employment Type<span className="required">*</span>
        </label>
        <select
          className="form-input"
          value={formData.employmentType || ""}
          onChange={(e) => handleChange("employmentType", e.target.value)}
          required
        >
          <option value="">Select employment type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Intern">Intern</option>
        </select>
      </div>

      <AsyncAutocomplete
        value={formData.officeLocation || ""}
        onChange={(value) => handleChange("officeLocation", value)}
        fetchSuggestions={api.searchLocations}
        placeholder="Search location..."
        label="Office Location"
        required
      />

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          className="form-textarea"
          value={formData.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Additional notes..."
          rows={4}
        />
      </div>

      {isSubmitting && (
        <ProgressBar progress={progress} message={progressMessage} />
      )}

      <div className="wizard-actions">
        {role === "admin" && onBack && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
