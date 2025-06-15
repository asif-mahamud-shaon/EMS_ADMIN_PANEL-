'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EmployeeForm from '@/components/employees/EmployeeForm';
import toast from 'react-hot-toast';

// Mock data - replace with actual API call
const mockEmployee = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  department: 'Engineering',
  designation: 'Senior Developer',
  joiningDate: '2024-01-01',
  salary: 8000,
};

export default function EditEmployee({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch employee data
    const fetchEmployee = async () => {
      try {
        // TODO: Replace with actual API call
        setEmployee(mockEmployee);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast.error('Failed to fetch employee data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement actual update logic
      console.log('Updating employee:', data);
      toast.success('Employee updated successfully');
      router.push('/employees');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Employee</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <EmployeeForm
              onSubmit={handleSubmit}
              initialData={employee}
              isEditing={true}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 