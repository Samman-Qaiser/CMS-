import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import logo from '../../public/logo-full.png'
function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Password Reset Email sent to:", data.email);
    alert(`Reset link has been sent to ${data.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF2F2] p-4 font-poppins">
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-full max-w-lg text-center">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <img 
            src={logo} 
            alt="W3CMS Logo" 
            className="w-48"
          />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-[#2C3E50] mb-8">Forgot Password</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
            <input 
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email" 
              placeholder="Email"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-[#FF6D52] text-white font-bold rounded-lg hover:bg-[#ff5a3d] shadow-md transition-all active:scale-[0.98] uppercase tracking-wide"
          >
            Submit
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-sm text-gray-500">
          Remembered your password? <Link to="/" className="text-orange-500 hover:underline">Back to Login</Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;