import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { Employee } from "../types/Employee";
import "../styles/employees.css";

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all data to merge properly
      const [basicInfoList, detailsList] = await Promise.all([
        api.getAllBasicInfo(),
        api.getAllDetails(),
      ]);

      // Merge data by email or employeeId
      const merged: Employee[] = basicInfoList.map((basic) => {
        const detail = detailsList.find(
          (d) => d.email === basic.email || d.employeeId === basic.employeeId
        );

        return {
          ...basic,
          photo: detail?.photo || "",
          employmentType: detail?.employmentType || "—",
          officeLocation: detail?.officeLocation || "—",
          notes: detail?.notes || "",
        };
      });

      // Add details-only entries (from Ops users)
      detailsList.forEach((detail) => {
        const exists = merged.some(
          (emp) =>
            emp.email === detail.email || emp.employeeId === detail.employeeId
        );
        if (!exists) {
          merged.push({
            fullName: "—",
            email: detail.email || "—",
            department: "—",
            role: "—",
            employeeId: detail.employeeId || "—",
            photo: detail.photo,
            employmentType: detail.employmentType,
            officeLocation: detail.officeLocation,
            notes: detail.notes,
          });
        }
      });

      // Calculate pagination
      setTotalPages(Math.ceil(merged.length / itemsPerPage));
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = merged.slice(startIndex, startIndex + itemsPerPage);

      setEmployees(paginatedData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = () => {
    navigate("/wizard");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="employees-header">
        <h1 className="employees-title">Employee List</h1>
        <button className="btn btn-primary" onClick={handleAddEmployee}>
          + Add Employee
        </button>
      </div>

      <div className="table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Location</th>
              <th>Employee ID</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No employees found. Click "Add Employee" to get started.
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={index}>
                  <td>
                    {employee.photo ? (
                      <img
                        src={employee.photo}
                        alt={employee.fullName}
                        className="employee-photo"
                      />
                    ) : (
                      <div className="employee-photo-placeholder">—</div>
                    )}
                  </td>
                  <td>{employee.fullName}</td>
                  <td>{employee.department}</td>
                  <td>{employee.role}</td>
                  <td>{employee.officeLocation}</td>
                  <td>{employee.employeeId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
