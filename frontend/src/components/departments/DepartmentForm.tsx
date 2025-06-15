'use client';

import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

// Mock employee data
const mockEmployees = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Emily Brown' },
];

const schema = yup.object({
  name: yup.string().required('Department name is required'),
  manager: yup.string().required('Manager is required'),
  description: yup.string().required('Description is required'),
  employees: yup.array().of(yup.string().required()).min(1, 'Select at least one employee').required(),
});

type DepartmentFormData = yup.InferType<typeof schema>;

type DepartmentFormProps = {
  initialData?: Partial<DepartmentFormData>;
  onSubmit: (data: DepartmentFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
};

const DepartmentForm: React.FC<DepartmentFormProps> = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      manager: initialData?.manager || '',
      description: initialData?.description || '',
      employees: initialData?.employees || [],
    },
  });

  const submitHandler: SubmitHandler<DepartmentFormData> = async (data) => {
    try {
      onSubmit(data);
      toast.success('Department saved successfully');
    } catch (error) {
      toast.error('Failed to save department');
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Department Name</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Manager</label>
          <input
            type="text"
            {...register('manager')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.manager && <p className="mt-1 text-xs text-red-600">{errors.manager.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>
      {/* Employees Multi-Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Employees</label>
        <Controller
          control={control}
          name="employees"
          render={({ field }) => (
            <select
              multiple
              {...field}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-32"
            >
              {mockEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.employees && <p className="mt-1 text-xs text-red-600">{errors.employees.message}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Department' : 'Add Department'}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm; 