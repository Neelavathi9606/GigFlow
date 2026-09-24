import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { register } from "../service/service";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    contact_no: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-+()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.contact_no ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all the fields");
      return;
    }

    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validateUsername(formData.username)) {
      setError(
        "Username must be 3-20 characters (letters, numbers, underscore only)"
      );
      return;
    }

    if (!validatePhone(formData.contact_no)) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await register(
        formData.name,
        formData.email,
        formData.username,
        formData.contact_no,
        formData.password
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
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
            Create Account
          </h1>
          <p className="text-royal-blue opacity-80">
            Join GigFlow and start your journey
          </p>
        </div>

        {/* Register Form */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-royal-blue font-semibold mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                />
              </div>

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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                />
              </div>

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-royal-blue font-semibold mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="johndoe"
                  className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                />
              </div>

              {/* Contact Number Field */}
              <div>
                <label
                  htmlFor="contact_no"
                  className="block text-royal-blue font-semibold mb-2"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contact_no"
                  value={formData.contact_no}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_no: e.target.value })
                  }
                  placeholder="+1 234 567 8900"
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
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-royal-blue font-semibold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                />
              </div>

              {/* Error Message */}
              {error && <ErrorMessage message={error} />}

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-royal-blue text-bone py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl mt-6 cursor-pointer"
              >
                Create Account
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-royal-blue">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-bold hover:text-blue-600 transition-colors"
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
