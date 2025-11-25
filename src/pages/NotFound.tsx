import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          fontWeight: "bold",
          color: "#ef4444",
          marginBottom: "1rem",
        }}
      >
        404
      </h1>
      <p
        style={{ fontSize: "1.25rem", color: "#6b7280", marginBottom: "2rem" }}
      >
        Page not found
      </p>
      <button
        onClick={() => navigate("/wizard")}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "0.375rem",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
      >
        Go to Wizard
      </button>
    </div>
  );
}
