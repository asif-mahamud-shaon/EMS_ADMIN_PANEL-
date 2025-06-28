'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { employeesApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function NewEmployee() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // Transform data to match backend expectations
      const createData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        departmentId: data.departmentId,
        designationId: data.designationId,
        dateJoined: data.dateJoined,
        basicSalary: data.basicSalary,
        phone: data.phone || null,
        nationalId: data.nationalId || null,
        address: data.address || null,
        emergencyContact: data.emergencyContact || null,
        bloodGroup: data.bloodGroup || null,
      };

      await employeesApi.create(createData);
      toast.success('Employee created successfully!');
      router.push('/employees');
    } catch (error: any) {
      console.error('Error creating employee:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create employee';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div className="flex items-center">
                    <button
                      onClick={() => router.push('/employees')}
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
                      onClick={() => router.push('/employees')}
                      className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
                    >
                      Employees
                    </button>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-500">New Employee</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
                <p className="text-gray-600">Create a new employee profile with complete information</p>
              </div>
            </div>
          </div>

          <EmployeeForm onSubmit={handleSubmit} isEditing={false} />
        </div>
      </div>
    </DashboardLayout>
  );
} 