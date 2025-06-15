'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  department: yup.string().required('Department is required'),
  designation: yup.string().required('Designation is required'),
  joiningDate: yup.date().required('Joining date is required'),
  salary: yup.number().required('Salary is required'),
}).required();

type EmployeeFormData = yup.InferType<typeof schema>;

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Partial<EmployeeFormData>;
  isEditing?: boolean;
}

export default function EmployeeForm({
  onSubmit,
  initialData,
  isEditing = false,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      await onSubmit(data);
      toast.success(
        isEditing ? 'Employee updated successfully!' : 'Employee added successfully!'
      );
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            {...register('firstName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <select
            {...register('department')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">
              {errors.department.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-medium text-gray-700"
          >
            Designation
          </label>
          <select
            {...register('designation')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Designation</option>
            <option value="Developer">Developer</option>
            <option value="Manager">Manager</option>
            <option value="Designer">Designer</option>
            <option value="Analyst">Analyst</option>
          </select>
          {errors.designation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.designation.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="joiningDate"
            className="block text-sm font-medium text-gray-700"
          >
            Joining Date
          </label>
          <input
            type="date"
            {...register('joiningDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.joiningDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.joiningDate.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary
          </label>
          <input
            type="number"
            {...register('salary')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.salary && (
            <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting
            ? 'Saving...'
            : isEditing
            ? 'Update Employee'
            : 'Add Employee'}
        </button>
      </div>
    </form>
  );
} 