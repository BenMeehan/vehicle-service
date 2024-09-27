import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ element, path }) => {
  const token = localStorage.getItem("token");

  const isLoggedIn = () => {
    if (!token) return false;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  };

  const userType = localStorage.getItem("userType");

  let userId;
  if (isLoggedIn()) {
    const decoded = jwtDecode(token);
    userId = decoded.user_id;
  }

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if (userType === "customer" && path === "/operations") {
    return <Navigate to="/login" />;
  }

  if (userType === "operational" && path === "/home") {
    return <Navigate to="/login" />;
  }

  return React.cloneElement(element, { userId });
};

export default PrivateRoute;
