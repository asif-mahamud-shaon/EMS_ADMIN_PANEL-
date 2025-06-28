'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { EnvelopeIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loginAs, setLoginAs] = useState<'admin' | 'employee'>('employee');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormInputs>();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await login(data.email, data.password, loginAs);
      toast.success(`${loginAs === 'admin' ? 'Admin' : 'Employee'} login successful!`);
      
      // Redirect to the originally requested page or dashboard
      const from = searchParams.get('from');
      router.push(from || '/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
      reset({ password: '' }); // Only reset password field
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
      {/* Premium top bar */}
      <div className="bg-black text-white text-center py-2 text-sm font-light tracking-wider">
        <span className="opacity-90">EMPLOYEE MANAGEMENT SYSTEM • PREMIUM ADMIN EXPERIENCE</span>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-48px)] px-4">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex overflow-hidden">
          {/* Left: Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="flex flex-col items-center mb-8">
              <div className="text-3xl font-thin text-black tracking-[0.2em] relative mb-4">
                <span className="font-serif">HRMS</span>
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
              </div>
              <p className="text-sm text-gray-600 font-light tracking-wide uppercase">Premium Admin Portal</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-light text-gray-800 tracking-wide">Welcome Back</h3>
                <div className="flex items-center text-xs">
                  <span className="mr-3 text-gray-500 font-light tracking-wide">LOGIN AS:</span>
                  <div className="flex border border-gray-200 rounded-full overflow-hidden">
                    <button
                      type="button"
                      className={`px-4 py-2 text-xs font-light tracking-wide uppercase transition-all duration-300 ${
                        loginAs === 'employee' 
                          ? 'bg-amber-100 text-amber-700 border-amber-200' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                      onClick={() => setLoginAs('employee')}
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-xs font-light tracking-wide uppercase transition-all duration-300 border-l ${
                        loginAs === 'admin' 
                          ? 'bg-amber-100 text-amber-700 border-amber-200' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                      onClick={() => setLoginAs('admin')}
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="pl-12 pr-4 py-4 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-500 font-light"
                />
                {errors.email && <p className="text-xs text-red-500 mt-2 font-light">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password', { required: 'Password is required' })}
                  className="pl-12 pr-4 py-4 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-500 font-light"
                />
                {errors.password && <p className="text-xs text-red-500 mt-2 font-light">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl text-white font-light tracking-wide uppercase bg-gradient-to-r from-amber-600 to-amber-700 shadow-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] focus:scale-[1.02]"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-amber-600 border border-gray-200 rounded-full px-6 py-2 bg-white shadow-sm transition-all duration-300 hover:shadow-md font-light tracking-wide"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>

          {/* Right: Illustration */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 items-center justify-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/30 rounded-full -ml-12 -mb-12"></div>
            
            <div className="text-center z-10">
              <UserCircleIcon className="h-32 w-32 text-amber-700 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-light text-amber-800 tracking-wide mb-4">Login</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 