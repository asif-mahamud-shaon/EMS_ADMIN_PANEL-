'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EmployeeForm from '@/components/employees/EmployeeForm';
import api from '@/services/api';

export default function NewEmployee() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await api.post('/employees', data);
      router.push('/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Add New Employee</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <EmployeeForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 