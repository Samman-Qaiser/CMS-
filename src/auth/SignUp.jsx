import { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { setCredentials } from '../redux/Slice/authSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();

  // Password confirmation check karne ke liye
  const password = watch("password");

  // 2. handle Async Axios request
  const onSubmit = async (data) => {
    setLoading(true);

    const baseUrl =
      import.meta.env?.VITE_BACKEND_URL ||
      "https://cms-backend-ashen.vercel.app";

    try {
      // making the POST API request using Axios
      const response = await axios.post(`${baseUrl}/api/auth/signup`, {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      // Save user details into Redux store
      dispatch(
        setCredentials({
          user: response.data.user || {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            username: data.username,
          },
          role: response.data.role || "User",
          isAuthenticated: true,
          token: response.data.token || null, 
        }),
      );

      console.log("API Response Success:", response.data);
      alert("Registration Successful!");
      navigate("/"); // Redirect to homepage/login
    } catch (error) { 
      console.error(
        "API Response Error:",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message ||
          "Something went wrong during registration.",
      );
    } finally {
      setLoading(false);
    }
  };;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-4 font-poppins">
      <div className="bg-sidebar-bg rounded-xl shadow-lg p-8 md:p-10 w-full max-w-2xl">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <img 
            src="https://w3cms-cms-python-django-content-management-system.dexignzone.com/static/dashboard/images/logo-full.png" 
            alt="W3CMS Logo" 
            className="w-40"
          />
        </div>

        <h2 className="text-center text-lg font-bold text-header-text mb-8">Sign up your account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* First Name & Last Name (Responsive Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-header-text uppercase mb-2 block">First Name</label>
              <input 
                {...register("firstName", { required: "First name is required" })}
                type="text" 
                placeholder="First Name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
              {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="text-xs font-bold text-header-text uppercase mb-2 block">Last Name</label>
              <input 
                {...register("lastName", { required: "Last name is required" })}
                type="text" 
                placeholder="Last Name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
              {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="text-xs font-bold text-header-text uppercase mb-2 block">Email</label>
            <input 
              {...register("email", { 
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
              })}
              type="email" 
              placeholder="Email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
          </div>

          {/* Username Field */}
          <div>
            <label className="text-xs font-bold text-header-text uppercase mb-2 block">UserName</label>
            <input 
              {...register("username", { required: "Username is required" })}
              type="text" 
              placeholder="Username"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
            />
            {errors.username && <p className="text-red-500 text-[10px] mt-1">{errors.username.message}</p>}
          </div>

          {/* Password & Confirm Password (Responsive Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-header-text uppercase mb-2 block">Password</label>
              <input 
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
                type="password" 
                placeholder="Password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
              {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-xs font-bold text-header-text uppercase mb-2 block">Confirm Password</label>
              <input 
                {...register("confirmPassword", { 
                  required: "Please confirm password",
                  validate: value => value === password || "Passwords do not match"
                })}
                type="password" 
                placeholder="Password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
              {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}  
            className={`w-full py-3 mt-4 text-white font-bold rounded-lg shadow-lg transition-all active:scale-[0.98] ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'
            }`}
          >
            {loading ? 'Signing you up...' : 'Sign me up'}
          </button>
        </form>

        <div className="mt-6 text-sm ">
          <span className="text-header-text">Already have an account? </span>
          <Link to="/" className="text-header-text hover:text-secondary cursor-pointer">Sign in</Link>
        </div>

      </div>
    </div>
  );
};

export default SignUp;