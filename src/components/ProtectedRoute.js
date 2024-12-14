import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check for token

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to login if token is missing
  }

  return children; // Render the protected route
};

export default ProtectedRoute;
