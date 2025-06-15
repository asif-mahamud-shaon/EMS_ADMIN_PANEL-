'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DesignationForm from '@/components/designations/DesignationForm';
import toast from 'react-hot-toast';

export default function NewDesignation() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement actual create logic
      console.log('Creating designation:', data);
      toast.success('Designation created successfully');
      router.push('/designations');
    } catch (error) {
      console.error('Error creating designation:', error);
      toast.error('Failed to create designation');
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Add New Designation</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <DesignationForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 