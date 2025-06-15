'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DepartmentForm from '@/components/departments/DepartmentForm';
import toast from 'react-hot-toast';

export default function NewDepartment() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement actual create logic
      console.log('Creating department:', data);
      toast.success('Department created successfully');
      router.push('/departments');
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department');
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Add New Department</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <DepartmentForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 