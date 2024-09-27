import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CustomerHome from "./components/CustomerHome";
import OperationalHome from "./components/OperationalHome";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={<PrivateRoute element={<CustomerHome />} path="/home" />}
        />
        <Route
          path="/operations"
          element={
            <PrivateRoute element={<OperationalHome />} path="/operations" />
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
