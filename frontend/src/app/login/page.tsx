'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { EnvelopeIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loginAs, setLoginAs] = useState<'User' | 'Admin'>('Admin');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormInputs>();
  const router = useRouter();

  const adminCredentials = { username: 'admin', password: 'admin123' }; // Mock Admin credentials
  const userCredentials = { username: 'user', password: 'user123' }; // Mock User credentials

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    // Simulate login validation
    if (loginAs === 'Admin') {
      if (data.username === adminCredentials.username && data.password === adminCredentials.password) {
        toast.success('Admin login successful!');
        // Simulate setting auth state or token
        localStorage.setItem('isLoggedIn', 'true'); // Simple auth simulation
        router.push('/dashboard');
      } else {
        toast.error('Invalid Admin credentials');
        reset(); // Clear form on failure
      }
    } else if (loginAs === 'User') {
      if (data.username === userCredentials.username && data.password === userCredentials.password) {
         toast.success('User login successful!');
         // Simulate setting auth state or token
         localStorage.setItem('isLoggedIn', 'true'); // Simple auth simulation
         // Redirect to user dashboard or appropriate page
         router.push('/user-dashboard'); // Assuming a user dashboard route
      } else {
         toast.error('Invalid User credentials');
         reset(); // Clear form on failure
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-6">
            <UserCircleIcon className="h-16 w-16 text-orange-400 mb-2" />
            <h2 className="text-2xl font-bold text-orange-500 mb-1">HRMS</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-800">Sign In</h3>
              <div className="flex items-center text-xs">
                <span className="mr-2 text-gray-500">Login As :</span>
                <button
                  type="button"
                  className={`px-2 py-1 rounded-l-full border ${loginAs === 'User' ? 'bg-orange-100 text-orange-600 border-orange-400' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                  onClick={() => setLoginAs('User')}
                >
                  User
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 rounded-r-full border-l-0 border ${loginAs === 'Admin' ? 'bg-orange-100 text-orange-600 border-orange-400' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                  onClick={() => setLoginAs('Admin')}
                >
                  Admin
                </button>
              </div>
            </div>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-orange-400" />
              <input
                type="text"
                placeholder="Username"
                {...register('username', { required: 'Username is required' })}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none"
              />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message as string}</p>}
            </div>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-orange-400" />
              <input
                type="password"
                placeholder="Password"
                {...register('password', { required: 'Password is required' })}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message as string}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-orange-400 to-yellow-400 shadow hover:from-orange-500 hover:to-yellow-500 transition"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="flex justify-center mt-2">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-orange-500 border border-gray-200 rounded-full px-4 py-1 bg-white shadow-sm"
              >
                Forgot Password ?
              </button>
            </div>
          </form>
        </div>
        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-yellow-50 to-orange-100 items-center justify-center">
          {/* Placeholder SVG illustration */}
          <svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="260" height="260" rx="40" fill="url(#paint0_linear)"/>
            <circle cx="80" cy="90" r="30" fill="#FBBF24"/>
            <rect x="120" y="60" width="80" height="20" rx="6" fill="#FDBA74"/>
            <rect x="120" y="90" width="60" height="20" rx="6" fill="#FDE68A"/>
            <rect x="120" y="120" width="100" height="20" rx="6" fill="#FBBF24"/>
            <rect x="40" y="160" width="180" height="20" rx="6" fill="#FDBA74"/>
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="260" y2="260" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF7ED"/>
                <stop offset="1" stopColor="#FDE68A"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
} 