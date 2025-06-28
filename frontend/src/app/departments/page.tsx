'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PlusIcon, PencilIcon, TrashIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { departmentsApi } from '@/services/api';
import toast from 'react-hot-toast';

interface Department {
  id: number;
  name: string;
  description: string;
  employeeCount: number;
  manager: { 
    firstName: string; 
    lastName: string; 
  } | null;
}

export default function Departments() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentsApi.getAll();
      setDepartments(response.data as Department[]);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        setIsLoading(true);
        await departmentsApi.delete(id);
        setDepartments(departments.filter(dept => dept.id !== id));
        toast.success('Department deleted successfully');
      } catch (error: any) {
        console.error('Error deleting department:', error);
        toast.error(error.response?.data?.message || 'Failed to delete department');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/departments/${id}/edit`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="page-header">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>
          <div className="table-container">
            <div className="animate-pulse p-8">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="page-header">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <BuildingOffice2Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800 tracking-wide">Department Management</h1>
                <p className="text-gray-600 font-light mt-1">Organize your company structure</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/departments/new')}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              Add Department
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
                    Manager
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
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <BuildingOffice2Icon className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-light text-lg">No departments found</p>
                        <p className="text-gray-400 font-light text-sm mt-1">Click "Add Department" to create one</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  departments.map((department) => (
                    <tr key={department.id} className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-25 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 tracking-wide">
                          {department.name}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-gray-600 font-light max-w-xs truncate">
                          {department.description}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {department.manager 
                            ? `${department.manager.firstName} ${department.manager.lastName}`
                            : 'No Manager'}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="status-badge bg-blue-100 text-blue-800 border border-blue-200">
                          {department.employeeCount} {department.employeeCount === 1 ? 'Employee' : 'Employees'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(department.id)}
                            className="action-btn"
                            title="Edit Department"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(department.id)}
                            disabled={isLoading}
                            title="Delete Department"
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