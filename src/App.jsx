// src/App.jsx
import Posts from "./posts";
import Login from "./auth/login";
import Register from "./auth/register";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
