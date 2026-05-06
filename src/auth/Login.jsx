import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/Slice/authSlice';
import LoginIllustration from '../../public/login.png'
import logo from '../../public/logo-full.png'
import { Link } from 'react-router';
import video from '../../public/video.jpg'
import documentation from '../../public/doc.jpg'
const Login = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', role: 'Customer' }
  });

  // Auto-fill logic for quick login
  const handleQuickLogin = (role) => {
    const credentials = {
      Admin: { email: 'admin@example.com', pass: 'admin123' },
      Manager: { email: 'manager@example.com', pass: 'manager123' },
      Customer: { email: 'customer@example.com', pass: 'customer123' },
    };
    
    setValue('email', credentials[role].email);
    setValue('password', credentials[role].pass);
    setValue('role', role);
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    dispatch(setCredentials({ user: data.email, role: data.role }));
    alert(`Logged in as ${data.role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF2F2] p-4 ">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
        
        {/* Left Side: Branding & Illustration (Hidden on mobile) */}
        <div className="hidden md:flex flex-col items-center pt-13 w-1/2 bg-[#FFF0EE] space-y-8">
          <img src={logo} alt="Logo" className='w-60' />
          <div className="flex gap-4">
             <div className=" rounded-xl shadow-sm text-center border border-orange-100 w-32 cursor-pointer">
             <a href="https://www.youtube.com/@dexignzone" target="_blank" rel="noopener noreferrer">
                       <img src={video} alt="Vide" className="w-full" />
</a>
             </div>
             <div className="  rounded-xl shadow-sm text-center border border-orange-100 w-32 cursor-pointer">
             <a href="https://www.dexignzone.com/documentation/" target="_blank" rel="noopener noreferrer">
                 <img src={documentation} alt="Documentation" className="w-full" />
             </a>
          
             </div>
          </div>
          <img src={LoginIllustration} alt="Illustration" className="w-full  max-w-sm" />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800">Sign in your account</h2>
          <p className="text-gray-400 text-sm mb-8">Welcome back! Login with your data that you entered during registration</p>

          <div className="space-y-4 mb-6">
            <button className="w-full py-2.5 border border-gray-100 rounded-lg bg-[#FFF0EE] cursor-pointer text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4" alt="G" /> Login with Google
            </button>
            <button className="w-full py-2.5 cursor-pointer bg-[#FFF0EE] text-[#4267B2] rounded-lg text-sm font-medium flex items-center justify-center gap-2">
               <span className="font-bold text-lg">f</span> Login with Facebook
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input 
                {...register("email", { required: true })}
                type="email" 
                placeholder="Email"
                className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input 
                {...register("password", { required: true })}
                type="password" 
                placeholder="Password"
                className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>

            <div className="flex flex-col  text-sm">
              <label className="flex items-center gap-2 font-bold text-gray-500">
                <input type="checkbox" className="accent-orange-500 font-bold" /> Remember my preference
              </label>
              <br />
              <Link to="/forgot-password" className="text-gray-400 hover:text-orange-500 cursor-pointer">
Forgot Password?
              </Link>
            </div>

            <button type="submit" className="w-full py-3 bg-[#FF6D52] text-white font-bold rounded-lg cursor-pointer hover:bg-[#ff5a3d] shadow-lg transition-all active:scale-[0.98]">
              Sign Me In
            </button>
          </form>

          {/* Quick Login Buttons (The 3 Buttons at bottom) */}
          <div className="mt-8">
            <p className="text-sm text-gray-400 mb-3 ">Don't have an account? 
            <Link to="/signup" className="text-emerald-500 cursor-pointer">Sign up</Link>
            </p>
            <div className="flex justify-between gap-12">
              <button onClick={() => handleQuickLogin('Admin')} className="flex-1 py-2 bg-[#5CC16E] cursor-pointer text-white text-xs font-bold rounded-md uppercase">Admin</button>
              <button onClick={() => handleQuickLogin('Manager')} className="flex-1 py-2 bg-[#F9B307] cursor-pointer text-white text-xs font-bold rounded-md uppercase">Manager</button>
              <button onClick={() => handleQuickLogin('Customer')} className="flex-1 py-2 bg-[#58BD9F] cursor-pointer text-white text-xs font-bold rounded-md uppercase">Customer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;