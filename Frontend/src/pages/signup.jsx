import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { registerUser } from '../authSlice';


//Schema validation
const signUpSchema = z.object({
    firstname: z.string().min(3, "name must contain 3 latters"),
    emailid: z.string().email("invalid email"),
    password: z.string().min(8, "password must contain 8 charcters")
})

export default function SignUp() {

    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()
    const nevigate = useNavigate()
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signUpSchema) });

    useEffect(() => {
        if (isAuthenticated) {
            nevigate('/')
        }
    }, [isAuthenticated, nevigate])

    const submitdata = (data) => {
        console.log(data)
        dispatch(registerUser(data))
    }

return (
  <div className="min-h-screen flex justify-center items-center bg-[#17254556] px-4 font-sans selection:bg-blue-500/30 relative overflow-hidden">
    
    {/* Signup Card */}
    <div className="w-full max-w-[440px] bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-10 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      
      <div className="mb-10 text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-1 tracking-tight">
          Join CoderPitch
        </h2>
        <p className="text-slate-400 text-sm">
          Create your account and start coding
        </p>
      </div>

      <form onSubmit={handleSubmit(submitdata)} className="space-y-6">

        {/* First Name */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            First Name
          </label>
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors 
              ${errors.firstname ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Enter your first name"
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all
                ${errors.firstname 
                  ? 'border-red-500 focus:ring-red-500/10' 
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/10'
                }`}
              {...register('firstname', { required: "First name is required" })}
            />
          </div>
          {errors.firstname && (
            <span className="text-xs text-red-400 mt-1.5 block ml-1">{errors.firstname.message}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors 
              ${errors.emailid ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`}>
              @
            </span>
            <input
              type="email"
              placeholder="name@company.com"
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all
                ${errors.emailid 
                  ? 'border-red-500 focus:ring-red-500/10' 
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/10'
                }`}
              {...register('emailid', { required: "Email is required" })}
            />
          </div>
          {errors.emailid && (
            <span className="text-xs text-red-400 mt-1.5 block ml-1">{errors.emailid.message}</span>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors 
              ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all
                ${errors.password 
                  ? 'border-red-500 focus:ring-red-500/10' 
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/10'
                }`}
              {...register('password', { 
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" }
              })}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
          {errors.password && <span className="text-xs text-red-400 mt-1.5 block ml-1">{errors.password.message}</span>}
          {error && !errors.password && (
            <span className="text-xs text-red-400 mt-1.5 block ml-1">{error?.response?.data || error?.message || 'Password is too weak'}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#6366f1] via-[#3b82f6] to-[#06b6d4] hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center shadow-lg active:scale-[0.98] mt-4"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-10">
        <p className="text-slate-400 text-sm">
          Already have an account?{' '}
          <NavLink to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  </div>
);

    // return (
    //     <div className="min-h-screen flex justify-center items-center relative overflow-hidden">
    //         {/* Dark background with subtle gradient */}
    //         <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>

    //         {/* Subtle glowing accent */}
    //         <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
    //         <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

    //         {/* Card */}
    //         <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-gray-700 z-10">
    //             <h2 className="text-center text-3xl font-bold text-white mb-2">Create Account</h2>
    //             <p className="text-center text-gray-400 mb-8">Start your coding journey 🚀</p>

    //             <form onSubmit={handleSubmit(submitdata)} className="space-y-6">
    //                 {/* First Name */}
    //                 <div>
    //                     <input
    //                         type="text"
    //                         placeholder="First Name"
    //                         className={`w-full px-4 py-3 rounded-md bg-gray-800 border text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.firstname ? "border-red-500 focus:ring-red-500" : "border-gray-700"
    //                             }`}
    //                         {...register("firstname")}
    //                     />
    //                     {errors.firstname && <span className="text-sm text-red-400 mt-1">{errors.firstname.message}</span>}
    //                 </div>

    //                 {/* Email */}
    //                 <div>
    //                     <input
    //                         type="email"
    //                         placeholder="Email"
    //                         className={`w-full px-4 py-3 rounded-md bg-gray-800 border text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.emailid ? "border-red-500 focus:ring-red-500" : "border-gray-700"
    //                             }`}
    //                         {...register("emailid")}
    //                     />
    //                     {errors.emailid && <span className="text-sm text-red-400 mt-1">{errors.emailid.message}</span>}
    //                 </div>

    //                 {/* Password */}
    //                 <div>
    //                     <input
    //                         type="password"
    //                         placeholder="Password"
    //                         className={`w-full px-4 py-3 rounded-md bg-gray-800 border text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-700"
    //                             }`}
    //                         {...register("password")}
    //                     />
    //                     {errors.password && <span className="text-sm text-red-400 mt-1">{errors.password.message}</span>}
    //                 </div>

    //                 {/* Remember + Forgot */}
    //                 <div className="flex items-center justify-between text-sm text-gray-400">
    //                     <label className="flex items-center space-x-2">
    //                         <input type="checkbox" className="checkbox checkbox-xs border-gray-600 bg-gray-800" />
    //                         <span>Remember me</span>
    //                     </label>
    //                     <a href="#" className="hover:underline hover:text-indigo-400">Forgot Password?</a>
    //                 </div>

    //                 {/* Submit Button */}
    //                 <div>
    //                     <button
    //                         type="submit"
    //                         className="w-full py-3 rounded-md bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition"
    //                     >
    //                         Sign Up
    //                     </button>
    //                 </div>

    //                 {/* Already account */}
    //                 <p className="text-center text-gray-400 text-sm mt-4">
    //                     Already have an account?{" "}
    //                     <a href="#" className="text-indigo-400 hover:underline">
    //                         Login
    //                     </a>
    //                 </p>
    //             </form>
    //         </div>
    //     </div>
    // );


}


