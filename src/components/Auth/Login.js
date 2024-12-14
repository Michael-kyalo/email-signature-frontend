import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader
    setError(""); // Reset error state

    try {
      // Send login request to the API
      const response = await axiosInstance.post("/login", { email, password });

      const token = response.data.token;
      localStorage.setItem("token", token);

      // Redirect to the dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      // Handle errors and display an alert with the error message
      setError(err.response?.data?.error || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-gray-900 text-white flex flex-col justify-center items-center p-6 sm:p-8">
        <div className="max-w-md text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Create Custom Cards</h2>
          <p className="text-base sm:text-lg mb-6">
            Design personalized email signatures that reflect your style and identity with our easy-to-use customization tools.
          </p>
          <img
            src="https://via.placeholder.com/400x250"
            alt="Custom Design"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-lg p-6 sm:p-10 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back 👋</h1>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="johndoe@gmail.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* Signup Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Don’t have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
