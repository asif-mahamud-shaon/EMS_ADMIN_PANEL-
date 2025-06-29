'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PlusIcon, PencilIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import { employeesApi } from '@/services/api';
import toast from 'react-hot-toast';

interface Employee {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  department: { name: string } | null;
  designation: { name: string } | null;
  status: string;
}

export default function Employees() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeesApi.getAll();
      setEmployees(response.data);
      } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setIsLoading(true);
        await employeesApi.delete(id);
        setEmployees(employees.filter(emp => emp.id !== id));
        toast.success('Employee deleted successfully');
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        toast.error(error.response?.data?.message || 'Failed to delete employee');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/employees/${id}/edit`);
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
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800 tracking-wide">Employee Management</h1>
                <p className="text-gray-600 font-light mt-1">Manage your workforce efficiently</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/employees/new')}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              Add Employee
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
                    Employee
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Email
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
                    Designation
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-8 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <UsersIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-light text-lg">No employees found</p>
                        <p className="text-gray-400 font-light text-sm mt-1">Click "Add Employee" to create one</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-25 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 tracking-wide">
                          {employee.name}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">{employee.email}</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {employee.department?.name || 'No Department'}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {employee.designation?.name || 'No Designation'}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span
                          className={`status-badge ${
                            employee.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(employee.id)}
                            className="action-btn"
                            title="Edit Employee"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(employee.id)}
                            disabled={isLoading}
                            title="Delete Employee"
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