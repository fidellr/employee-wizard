import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Step1BasicInfo from "./Step1BasicInfo";
import { draftStorage } from "../lib/draftStorage";
import { api } from "../lib/api";
import type { Role, BasicInfo, Details, DraftData } from "../lib/types";
import "../styles/wizard.css";

interface WizardFormProps {
  role: Role;
}

export default function WizardForm({ role }: WizardFormProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(role === "admin" ? 1 : 2);
  const [basicInfo, setBasicInfo] = useState<Partial<BasicInfo>>({});
  const [details, setDetails] = useState<Partial<Details>>({});
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft on mount
  useEffect(() => {
    const draft = draftStorage.load(role);
    if (draft) {
      if (draft.basicInfo) setBasicInfo(draft.basicInfo);
      if (draft.details) setDetails(draft.details);
    }
  }, [role]);

  // Auto-save with debounce
  const saveDraft = useCallback(() => {
    const draftData: DraftData = {
      basicInfo: role === "admin" ? basicInfo : undefined,
      details,
    };
    draftStorage.save(role, draftData);
  }, [role, basicInfo, details]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    const timer = setTimeout(() => {
      saveDraft();
    }, 2000);

    autoSaveTimerRef.current = timer;

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [saveDraft]);

  const handleBasicInfoChange = (data: Partial<BasicInfo>) => {
    setBasicInfo(data);
  };

  const handleDetailsChange = (data: Partial<Details>) => {
    setDetails(data);
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (
    basicInfoData: BasicInfo | null,
    detailsData: Details
  ) => {
    try {
      if (basicInfoData) {
        // Admin: Submit both steps
        console.log("⏳ Submitting basicInfo...");
        await api.postBasicInfo(basicInfoData);
        console.log("✅ basicInfo saved!");
      }

      console.log("⏳ Submitting details...");
      await api.postDetails(detailsData);
      console.log("✅ details saved!");
      console.log("🎉 All data processed successfully!");

      // Clear draft after successful submission
      draftStorage.clear(role);

      // Redirect to employee list
      navigate("/employees");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  const handleClearDraft = () => {
    if (window.confirm("Are you sure you want to clear the draft?")) {
      draftStorage.clear(role);
      setBasicInfo({});
      setDetails({});
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1 className="wizard-main-title">Employee Registration</h1>
        <button
          type="button"
          className="btn-clear-draft"
          onClick={handleClearDraft}
        >
          Clear Draft
        </button>
      </div>

      {role === "admin" && (
        <div className="wizard-steps">
          <div
            className={`step ${currentStep === 1 ? "active" : ""} ${
              currentStep > 1 ? "completed" : ""
            }`}
          >
            <span className="step-number">1</span>
            <span className="step-label">Basic Info</span>
          </div>
          <div className="step-divider" />
          <div className={`step ${currentStep === 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Details</span>
          </div>
        </div>
      )}

      <div className="wizard-content">
        {currentStep === 1 && role === "admin" && (
          <Step1BasicInfo
            data={basicInfo}
            onChange={handleBasicInfoChange}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
