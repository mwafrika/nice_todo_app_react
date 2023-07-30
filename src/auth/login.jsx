// src/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(
        "http://localhost:7000/api/auth/login",
        formData
      );
      localStorage.setItem("token", data.data.token);
      toast.success("Successfully logged in");
      navigate("/posts");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto py-4 shadow-lg px-4 bg-white rounded">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="flex justify-between flex-col w-full gap-y-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded w-fit"
            >
              Login
            </button>
            <span className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
