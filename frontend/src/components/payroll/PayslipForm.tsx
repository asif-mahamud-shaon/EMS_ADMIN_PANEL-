'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  employeeId: yup.string().required('Employee is required'),
  month: yup.string().required('Month is required'),
  basicSalary: yup.number().required('Basic salary is required').min(0),
  allowances: yup.number().required('Allowances is required').min(0),
  deductions: yup.number().required('Deductions is required').min(0),
  bonus: yup.number().required('Bonus is required').min(0),
  overtime: yup.number().required('Overtime is required').min(0),
  notes: yup.string(),
}).required();

type PayslipFormData = yup.InferType<typeof schema>;

interface PayslipFormProps {
  onSubmit: (data: PayslipFormData) => Promise<void>;
  initialData?: Partial<PayslipFormData>;
  isEditing?: boolean;
}

export default function PayslipForm({
  onSubmit,
  initialData,
  isEditing = false,
}: PayslipFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PayslipFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const basicSalary = watch('basicSalary') || 0;
  const allowances = watch('allowances') || 0;
  const deductions = watch('deductions') || 0;
  const bonus = watch('bonus') || 0;
  const overtime = watch('overtime') || 0;

  const netSalary = basicSalary + allowances + bonus + overtime - deductions;

  const handleFormSubmit = async (data: PayslipFormData) => {
    try {
      await onSubmit(data);
      toast.success(
        isEditing ? 'Payslip updated successfully!' : 'Payslip generated successfully!'
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
            htmlFor="employeeId"
            className="block text-sm font-medium text-gray-700"
          >
            Employee
          </label>
          <select
            {...register('employeeId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Employee</option>
            {/* TODO: Add employee options */}
          </select>
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700"
          >
            Month
          </label>
          <input
            type="month"
            {...register('month')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.month && (
            <p className="mt-1 text-sm text-red-600">{errors.month.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="basicSalary"
            className="block text-sm font-medium text-gray-700"
          >
            Basic Salary
          </label>
          <input
            type="number"
            step="0.01"
            {...register('basicSalary')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.basicSalary && (
            <p className="mt-1 text-sm text-red-600">{errors.basicSalary.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="allowances"
            className="block text-sm font-medium text-gray-700"
          >
            Allowances
          </label>
          <input
            type="number"
            step="0.01"
            {...register('allowances')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.allowances && (
            <p className="mt-1 text-sm text-red-600">{errors.allowances.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="deductions"
            className="block text-sm font-medium text-gray-700"
          >
            Deductions
          </label>
          <input
            type="number"
            step="0.01"
            {...register('deductions')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.deductions && (
            <p className="mt-1 text-sm text-red-600">{errors.deductions.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="bonus"
            className="block text-sm font-medium text-gray-700"
          >
            Bonus
          </label>
          <input
            type="number"
            step="0.01"
            {...register('bonus')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.bonus && (
            <p className="mt-1 text-sm text-red-600">{errors.bonus.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="overtime"
            className="block text-sm font-medium text-gray-700"
          >
            Overtime
          </label>
          <input
            type="number"
            step="0.01"
            {...register('overtime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.overtime && (
            <p className="mt-1 text-sm text-red-600">{errors.overtime.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="netSalary"
            className="block text-sm font-medium text-gray-700"
          >
            Net Salary
          </label>
          <input
            type="text"
            value={`$${netSalary.toFixed(2)}`}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
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
            ? 'Update Payslip'
            : 'Generate Payslip'}
        </button>
      </div>
    </form>
  );
} 