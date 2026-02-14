import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { loginUser } from '../authSlice';


//Schema validation
const loginSchema = z.object({
    emailid: z.string().email("invalid email"),
    password: z.string().min(8, "password must contain 8 charcters")
})

export default function Login() {

    const dispatch = useDispatch()
    const nevigate = useNavigate()
    const {isAuthenticated, loading , error} = useSelector(state => state.auth)
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

    useEffect(()=>{
        if(isAuthenticated){
            nevigate('/')
        }
    },[isAuthenticated,nevigate])

    const submitdata = (data) => {
        dispatch(loginUser(data))
    }

return (
  <div className="min-h-screen flex justify-center items-center bg-[#17254556] px-4 font-sans selection:bg-blue-500/30 relative overflow-hidden">
    
    {/* Login Card */}
    <div className="w-full max-w-[440px] bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-10 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      
      <div className="mb-10 text-center">

        <h2 className="text-xl font-bold text-slate-200 mb-1 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-slate-400 text-sm">
          Please enter your details to sign in.
        </p>
      </div>

      <form onSubmit={handleSubmit(submitdata)} className="space-y-6">

        {/* Email/Username */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Username or Email
          </label>
          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${errors.emailid ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`}>@</span>
            <input
              type="email"
              placeholder="dev_solve_user"
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all
                ${errors.emailid ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/10'}`}
              {...register('emailid', { required: "Email is required" })}
            />
          </div>
          {errors.emailid && (
            <span className="text-sm text-red-400 mt-1 block ml-1">
              {errors.emailid.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>

          <div className="relative group">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all
                ${errors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/10'}`}
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
          {errors.password && (
            <span className="text-sm text-red-400 mt-1 block ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#6366f1] via-[#3b82f6] to-[#06b6d4] hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center shadow-lg active:scale-[0.98] mt-4"
        >
          Login
        </button>
      </form>

      <div className="text-center mt-10">
        <p className="text-slate-400 text-sm">
          Don't have an account?{" "}
          <NavLink to="/signUp" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            Create Account
          </NavLink>
        </p>
      </div>
    </div>
  </div>
);

}