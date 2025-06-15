'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DepartmentForm from '@/components/departments/DepartmentForm';
import toast from 'react-hot-toast';

export default function EditDepartment({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<any>(null);

  useEffect(() => {
    // TODO: Implement actual fetch logic
    const fetchDepartment = async () => {
      try {
        // Mock data for now
        const mockDepartment = {
          id: params.id,
          name: 'IT Department',
          description: 'Information Technology Department',
          manager: 'John Doe',
          employeeCount: 15
        };
        setDepartment(mockDepartment);
      } catch (error) {
        console.error('Error fetching department:', error);
        toast.error('Failed to fetch department details');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement actual update logic
      console.log('Updating department:', data);
      toast.success('Department updated successfully');
      router.push('/departments');
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Failed to update department');
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

  if (!department) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Department not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Department</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <DepartmentForm
              onSubmit={handleSubmit}
              initialData={department}
              isEditing
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 