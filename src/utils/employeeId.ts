import type { BasicInfo } from "../types/Employee";

export function generateEmployeeId(
  department: string,
  existingEmployees: BasicInfo[]
): string {
  const deptCode = department.substring(0, 3).toUpperCase();

  const deptEmployees = existingEmployees.filter((emp) =>
    emp.employeeId.startsWith(deptCode)
  );

  const sequence = (deptEmployees.length + 1).toString().padStart(3, "0");

  return `${deptCode}-${sequence}`;
}
