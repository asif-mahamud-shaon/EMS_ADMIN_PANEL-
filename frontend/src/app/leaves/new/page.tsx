'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LeaveRequestForm from '@/components/leaves/LeaveRequestForm';
import { leavesApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function NewLeaveRequest() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await leavesApi.create(data);
      toast.success('Leave request submitted successfully!');
      router.push('/leaves');
    } catch (error: any) {
      console.error('Error creating leave request:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit leave request';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div className="flex items-center">
                    <button
                      onClick={() => router.push('/leaves')}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <button
                      onClick={() => router.push('/leaves')}
                      className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
                    >
                      Leave Requests
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-500">New Request</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h1m-1-2V9a2 2 0 012-2h1" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Request Leave</h1>
                <p className="text-gray-600">Submit a new leave request for approval</p>
              </div>
            </div>
          </div>

          <LeaveRequestForm onSubmit={handleSubmit} isEditing={false} />
        </div>
      </div>
    </DashboardLayout>
  );
} 