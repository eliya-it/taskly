import React, { useEffect, useState } from "react";
import "./index.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedLayout from "./components/ProtectedRoute";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
