'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

const schema = yup.object({
  name: yup.string()
    .required('Department name is required')
    .min(2, 'Department name must be at least 2 characters')
    .max(50, 'Department name must be less than 50 characters')
    .matches(/^[a-zA-Z\s&-]+$/, 'Department name must contain only letters, spaces, & and -'),
  description: yup.string()
    .optional()
    .max(500, 'Description must be less than 500 characters'),
}).required();

type DepartmentFormData = yup.InferType<typeof schema>;

interface DepartmentFormProps {
  onSubmit: (data: DepartmentFormData) => Promise<void>;
  initialData?: Partial<DepartmentFormData>;
  isEditing?: boolean;
}

export default function DepartmentForm({
  onSubmit,
  initialData,
  isEditing = false,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const handleFormSubmit = async (data: DepartmentFormData) => {
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
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg mx-auto mb-4">
            <BuildingOffice2Icon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-light text-gray-800 tracking-wide">
            {isEditing ? 'Update Department' : 'Create New Department'}
          </h2>
          <p className="text-gray-600 font-light mt-2">
            {isEditing ? 'Modify department information' : 'Add a new department to your organization'}
          </p>
        </div>

        {/* Form Content */}
        <div className="card">
          <div className="space-y-6">
            {/* Department Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className={`form-input ${
                  errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                }`}
                placeholder="e.g., Human Resources, Information Technology"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.name.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 font-light">
                Enter a clear and descriptive department name
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className={`form-textarea ${
                  errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                }`}
                placeholder="Describe the department's purpose, responsibilities, and key functions..."
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
                  Optional but recommended for clarity
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
              <span>{isEditing ? 'Update Department' : 'Create Department'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 