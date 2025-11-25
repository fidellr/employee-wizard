import type { Role } from "../types/Employee";

interface RoleSelectorProps {
  role: Role;
  onChange: (role: Role) => void;
}

export default function RoleSelector({ role, onChange }: RoleSelectorProps) {
  return (
    <div className="role-selector">
      <label className="form-label">Select Your Role</label>
      <div className="role-buttons">
        <button
          type="button"
          className={`role-button ${role === "admin" ? "active" : ""}`}
          onClick={() => onChange("admin")}
        >
          Admin
        </button>
        <button
          type="button"
          className={`role-button ${role === "ops" ? "active" : ""}`}
          onClick={() => onChange("ops")}
        >
          Ops
        </button>
      </div>
    </div>
  );
}
