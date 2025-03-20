import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./views/login";
import Register from "./views/register";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layout/appLayout";
const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <div className="w-full">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<AppLayout />} />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{ zIndex: 99999 }}
      />
    </div>
  );
};

export default App;
