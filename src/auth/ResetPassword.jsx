import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../public/logo-full.png";

function ResetPassword() {
  const { token } = useParams(); // Grabs the ':token' from the browser URL path
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    const baseUrl =
      import.meta.env?.VITE_BACKEND_URL ||
      "https://cms-backend-ashen.vercel.app";

    try {
      // Sending a PUT request 
      const response = await axios.put(
        `${baseUrl}/api/auth/reset-password/${token}`,
        {
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      );

      console.log("Password reset success:", response.data);
      alert(response.data?.message || "Password updated successfully!");
      navigate("/"); // Redirect user back to Login page
    } catch (error) {
      console.error(
        "Password reset error:",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || "Token is invalid or has expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-poppins">
      <div className="bg-sidebar-bg rounded-xl shadow-lg p-8 md:p-12 w-full max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="W3CMS Logo" className="w-48" />
        </div>

        <h2 className="text-xl font-bold text-header-text mb-8">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          {/* New Password Field */}
          <div>
            <label className="text-sm font-semibold text-header-text block mb-2">
              New Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label className="text-sm font-semibold text-header-text block mb-2">
              Confirm New Password
            </label>
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] uppercase tracking-wide cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
