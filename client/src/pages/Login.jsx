import useAuth from "../context/authContext";
import { useState } from "react";
import { login as loginService } from "../service/service";
import { Navigate, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const { login } = useAuth();

  const handleShowPassword = (e) => {
    e.preventDefault();

    setViewPassword(!viewPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill all the fields");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await loginService(formData.email, formData.password);
      console.log("Login response:", response);
      login(response.data.accessToken, response.data.user);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-powder-blue to-bone flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-royal-blue rounded-lg px-6 py-3 inline-block mb-4">
            <span className="text-3xl font-bold text-bone">GigFlow</span>
          </div>
          <h1 className="text-3xl font-bold text-royal-blue mb-2">
            Welcome Back
          </h1>
          <p className="text-royal-blue opacity-80">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Form */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-royal-blue font-semibold mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-royal-blue font-semibold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={viewPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-20 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleShowPassword(e)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-royal-blue hover:text-blue-600 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    {viewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className=" cursor-pointer w-full bg-royal-blue text-bone py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-powder-blue"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-royal-blue">OR</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-royal-blue">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-bold hover:text-blue-600 transition-colors"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
