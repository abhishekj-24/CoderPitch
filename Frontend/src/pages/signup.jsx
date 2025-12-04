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

    const [showPassword, setshowPassword] = useState(false)
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
        <div className='min-h-screen flex justify-center items-center p-4 '>
            <div className='card w-96 bg-base-100 shadow-xl border-2 border-amber-50'>
                <div className='card-body'>
                    <h2 className='card-title justify-center text-3xl'>CoderPitch</h2>
                    <form onSubmit={handleSubmit(submitdata)}>


                        <div className='form-control mt-4'>
                            <label className='label'>
                                <span className='label-text mb-1'>FirstName</span>
                            </label>
                            <input
                                type='text'
                                placeholder="Abhishek"
                                className={`input input-bordered ${errors.firstname && 'input-error'}`}
                                {...register('firstname')} />
                            {errors.firstname && (<span className='text-error'>{errors.firstname.message}</span>)}
                        </div>

                        <div className='form-control mt-4'>
                            <label className='label'>
                                <span className='label-text mb-1'>Email</span>
                            </label>
                            <input
                                type='email'
                                placeholder="abcd@gmail.com"
                                className={`input input-bordered ${errors.emailid && 'input-error'}`}
                                {...register('emailid')} />
                            {errors.firstname && (<span className='text-error'>{errors.firstname.message}</span>)}
                        </div>

                        {/* <input {...register('Email')} placeholder="Enter email" />
                            {errors.Email ? (<span>{errors.Email.message}</span>) : null} */}

                        <div className='form-control mt-4'>
                            <label className='label'>
                                <span className='label-text mb-1'>Password</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`input input-bordered ${errors.password && 'input-error'}`}
                                {...register('password')} />
                            {errors.password && (<span className='text-error'>{errors.password.message}</span>)}
                        </div>

                        {/* <button type="submit" className="btn btn-lg btn-primary">submit</button> */}
                        <div className="form-control mt-6 flex justify-center">
                            <button type="submit" className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <div className='text-center mt-4'>
                        <span className='text-sm'>
                            Already have an account ?{' '}
                            <NavLink to='/login' className='link link-primary' >Login</NavLink>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )

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


