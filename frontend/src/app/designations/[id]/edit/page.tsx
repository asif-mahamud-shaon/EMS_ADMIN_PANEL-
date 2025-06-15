'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DesignationForm from '@/components/designations/DesignationForm';
import toast from 'react-hot-toast';

export default function EditDesignation({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [designation, setDesignation] = useState<any>(null);

  useEffect(() => {
    // TODO: Implement actual fetch logic
    const fetchDesignation = async () => {
      try {
        // Mock data for now
        const mockDesignation = {
          id: params.id,
          name: 'Software Engineer',
          department: 'Engineering',
          description: 'Develops and maintains software applications',
          employeeCount: 15
        };
        setDesignation(mockDesignation);
      } catch (error) {
        console.error('Error fetching designation:', error);
        toast.error('Failed to fetch designation details');
      } finally {
        setLoading(false);
      }
    };

    fetchDesignation();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement actual update logic
      console.log('Updating designation:', data);
      toast.success('Designation updated successfully');
      router.push('/designations');
    } catch (error) {
      console.error('Error updating designation:', error);
      toast.error('Failed to update designation');
      throw error;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!designation) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Designation not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Designation</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <DesignationForm
              onSubmit={handleSubmit}
              initialData={designation}
              isEditing
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 