'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PlusIcon, PencilIcon, TrashIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock data - replace with actual API call
const designations = [
  {
    id: 1,
    name: 'Software Engineer',
    department: 'Engineering',
    description: 'Develops and maintains software applications',
    employeeCount: 15,
  },
  {
    id: 2,
    name: 'Marketing Manager',
    department: 'Marketing',
    description: 'Manages marketing campaigns and strategies',
    employeeCount: 8,
  },
  {
    id: 3,
    name: 'Sales Representative',
    department: 'Sales',
    description: 'Handles sales and client relationships',
    employeeCount: 12,
  },
];

export default function Designations() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      try {
        setIsLoading(true);
        // TODO: Implement actual delete logic
        console.log('Deleting designation:', id);
        toast.success('Designation deleted successfully');
      } catch (error) {
        console.error('Error deleting designation:', error);
        toast.error('Failed to delete designation');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/designations/${id}/edit`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="page-header">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BriefcaseIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800 tracking-wide">Designation Management</h1>
                <p className="text-gray-600 font-light mt-1">Define roles and responsibilities</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/designations/new')}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              Add Designation
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Designation
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Employees
                  </th>
                  <th scope="col" className="relative px-8 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {designations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <BriefcaseIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-light text-lg">No designations found</p>
                        <p className="text-gray-400 font-light text-sm mt-1">Click "Add Designation" to create one</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  designations.map((designation) => (
                    <tr key={designation.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-25 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 tracking-wide">
                          {designation.name}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {designation.department}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-gray-600 font-light max-w-xs truncate">
                          {designation.description}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="status-badge bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {designation.employeeCount} {designation.employeeCount === 1 ? 'Employee' : 'Employees'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(designation.id)}
                            className="action-btn"
                            title="Edit Designation"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(designation.id)}
                            disabled={isLoading}
                            title="Delete Designation"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 