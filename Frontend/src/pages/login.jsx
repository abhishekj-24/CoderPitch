import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { loginUser } from '../authSlice';


//Schema validation
const signUpSchema = z.object({
    emailid: z.string().email("invalid email"),
    password: z.string().min(8, "password must contain 8 charcters")
})

export default function Login() {

    const dispatch = useDispatch()
    const nevigate = useNavigate()
    const {isAuthenticated, loading , error} = useSelector(state => state.auth)

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signUpSchema) });

    useEffect(()=>{
        if(isAuthenticated){
            nevigate('/')
        }
    },[isAuthenticated,nevigate])

    const submitdata = (data) => {
        dispatch(loginUser(data))
    }

    return (
        <>
            <div className='min-h-screen flex justify-center items-center p-4 '>
                <div className='card w-96 bg-base-100 shadow-xl border-2 border-amber-50'>
                    <div className='card-body'>
                        <h2 className='card-title justify-center text-3xl'>CoderPitch</h2>
                        <form onSubmit={handleSubmit(submitdata)}>

                            <div className='form-control mt-4'>
                                <label className='label'>
                                    <span className='label-text mb-1'>Email</span>
                                </label>
                                <input
                                    type='email'
                                    placeholder="abcd@gmail.com"
                                    className={`input input-bordered ${errors.emailid && 'input-error'}`}
                                    {...register('emailid')} />
                                {errors.firstname && (<span className='text-error'>{errors.Email.message}</span>)}
                            </div>

                            {/* <input {...register('Email')} placeholder="Enter email" />
                            {errors.Email ? (<span>{errors.Email.message}</span>) : null} */}

                            <div className='form-control mt-4'>
                                <label className='label'>
                                    <span className='label-text mb-1'>Password</span>
                                </label>
                                <input
                                    type='password'
                                    placeholder="*****"
                                    className={`input input-bordered ${errors.password && 'input-error'}`}
                                    {...register('password')} />
                                {errors.password && (<span className='text-error'>{errors.password.message}</span>)}
                            </div>

                            {/* <button type="submit" className="btn btn-lg btn-primary">submit</button> */}
                            <div className="form-control mt-6 flex justify-center">
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                            </div>
                        </form>
                        <div className='text-center mt-4'>
                            <span>
                                Dont have an account ? {' '}
                                <NavLink to='/signUp' className='link link-primary'>Sign Up</NavLink>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}