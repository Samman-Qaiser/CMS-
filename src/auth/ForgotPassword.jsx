import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import logo from "../../public/logo-full.png";
import axios from "axios";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 3. Modified onSubmit to handle Async Axios request
  const onSubmit = async (data) => {
    setLoading(true);

    const baseUrl =
      import.meta.env?.VITE_BACKEND_URL ||
      "https://cms-backend-ashen.vercel.app";

    try {
      // 4. Send POST request with the email payload
      const response = await axios.post(`${baseUrl}/api/auth/forgot-password`, {
        email: data.email,
      });

      console.log("API Response Success:", response.data);

      // Extract token if backend sends it back directly in the response payload 
      const receivedToken = response.data?.token || response.data?.resetToken;

      if (receivedToken) {
        alert(
          `👉 [TESTING MODE] Your reset token is: ${receivedToken}\n\nYou can manually visit: http://localhost:5173/reset-password/${receivedToken}`,
        );
      } else {
        alert(
          response.data?.message || `Reset link has been sent to ${data.email}`,
        );
      }
    } catch (error) {
      // 5. Handle errors
      console.error(
        "API Response Error:",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-poppins">
      <div className="bg-sidebar-bg rounded-xl shadow-lg p-8 md:p-12 w-full max-w-lg text-center">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="W3CMS Logo" className="w-48" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-header-text mb-8">
          Forgot Password
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div>
            <label className="text-sm font-semibold text-header-text block mb-2">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* 6. Dynamic Submit Button with disabled loading UI */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] uppercase tracking-wide cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-sm text-header-text">
          Remembered your password?{" "}
          <Link to="/" className="text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
