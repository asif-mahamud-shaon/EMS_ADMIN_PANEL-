'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DepartmentForm from '@/components/departments/DepartmentForm';
import { departmentsApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function NewDepartment() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await departmentsApi.create(data);
      toast.success('Department created successfully!');
      router.push('/departments');
    } catch (error: any) {
      console.error('Error creating department:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create department';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="page-header">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div className="flex items-center">
                  <button
                    onClick={() => router.push('/departments')}
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
                    onClick={() => router.push('/departments')}
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-light"
                  >
                    Departments
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-light text-gray-500">New Department</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-800 tracking-wide">Add New Department</h1>
              <p className="text-gray-600 font-light mt-1">Create a new department with organizational details</p>
            </div>
          </div>
        </div>

        {/* Department Form */}
        <DepartmentForm onSubmit={handleSubmit} isEditing={false} />
      </div>
    </DashboardLayout>
  );
} 