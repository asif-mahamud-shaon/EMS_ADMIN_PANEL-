'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { departmentsApi } from '@/services/api';
import { BriefcaseIcon, BuildingOffice2Icon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const schema = yup.object({
  name: yup.string()
    .required('Designation name is required')
    .min(2, 'Designation name must be at least 2 characters')
    .max(50, 'Designation name must be less than 50 characters')
    .matches(/^[a-zA-Z\s&-]+$/, 'Designation name must contain only letters, spaces, & and -'),
  description: yup.string()
    .optional()
    .max(500, 'Description must be less than 500 characters'),
  departmentId: yup.number()
    .required('Department is required')
    .positive('Please select a valid department'),
  salaryRange: yup.string()
    .optional()
    .max(50, 'Salary range must be less than 50 characters'),
}).required();

type DesignationFormData = yup.InferType<typeof schema>;

interface DesignationFormProps {
  onSubmit: (data: DesignationFormData) => Promise<void>;
  initialData?: Partial<DesignationFormData>;
  isEditing?: boolean;
}

interface Department {
  id: number;
  name: string;
}

export default function DesignationForm({
  onSubmit,
  initialData,
  isEditing = false,
}: DesignationFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DesignationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      departmentId: initialData?.departmentId || undefined,
      salaryRange: initialData?.salaryRange || '',
    },
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentsApi.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setIsLoadingDepts(false);
    }
  };

  const handleFormSubmit = async (data: DesignationFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const descriptionLength = watch('description')?.length || 0;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center shadow-lg mx-auto mb-4">
            <BriefcaseIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-light text-gray-800 tracking-wide">
            {isEditing ? 'Update Designation' : 'Create New Designation'}
          </h2>
          <p className="text-gray-600 font-light mt-2">
            {isEditing ? 'Modify designation information' : 'Add a new role designation to your organization'}
          </p>
        </div>

        {/* Form Content */}
        <div className="card">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`form-input ${
                    errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  placeholder="e.g., Senior Software Engineer"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BuildingOffice2Icon className="h-4 w-4 inline mr-1" />
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('departmentId', {
                    setValueAs: (value) => value === '' ? undefined : Number(value)
                  })}
                  disabled={isLoadingDepts}
                  className={`form-select ${
                    errors.departmentId ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                >
                  <option value="">
                    {isLoadingDepts ? 'Loading departments...' : 'Select department'}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.departmentId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                Salary Range (BDT)
              </label>
              <input
                type="text"
                {...register('salaryRange')}
                className={`form-input ${
                  errors.salaryRange ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                }`}
                placeholder="e.g., 50,000 - 80,000"
              />
              {errors.salaryRange && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.salaryRange.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 font-light">
                Optional salary range for this position
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className={`form-textarea ${
                  errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                }`}
                placeholder="Describe the role responsibilities, qualifications, and key duties..."
                maxLength={500}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.description.message}
                </p>
              )}
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500 font-light">
                  Optional but helps clarify role expectations
                </p>
                <p className={`text-xs font-light ${
                  descriptionLength > 450 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {descriptionLength}/500 characters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              <span>{isEditing ? 'Update Designation' : 'Create Designation'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 