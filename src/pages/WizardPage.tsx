import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RoleSelector from "../components/RoleSelector";
import WizardForm from "../components/WizardForm";
import type { Role } from "../types/Employee";

import "../styles/wizard.css";

export default function WizardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get("role") as Role | null;
  const [role, setRole] = useState<Role>(roleParam || "admin");

  useEffect(() => {
    if (roleParam && (roleParam === "admin" || roleParam === "ops")) {
      setRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setSearchParams({ role: newRole });
  };

  return (
    <div className="page-container">
      <RoleSelector role={role} onChange={handleRoleChange} />
      <WizardForm role={role} />
    </div>
  );
}
