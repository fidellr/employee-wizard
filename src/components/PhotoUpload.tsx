import { useState, useRef } from "react";

interface PhotoUploadProps {
  value: string;
  onChange: (base64: string) => void;
  label: string;
}

export default function PhotoUpload({
  value,
  onChange,
  label,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="photo-upload">
        {preview ? (
          <div className="photo-preview">
            <img src={preview} alt="Preview" className="photo-preview-image" />
            <button
              type="button"
              className="photo-remove-btn"
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="photo-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="photo-input"
              id="photo-input"
            />
            <label htmlFor="photo-input" className="photo-upload-label">
              <span className="photo-upload-icon">📷</span>
              <span>Click to upload photo</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
