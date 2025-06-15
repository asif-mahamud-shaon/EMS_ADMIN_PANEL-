'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

type LeaveRequestFormData = {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
};

const schema = yup.object().shape({
  leaveType: yup.string().required('Leave type is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup
    .string()
    .required('End date is required')
    .test('is-after-start', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      return !startDate || !value || new Date(value) >= new Date(startDate);
    }),
  reason: yup.string().required('Reason is required'),
});

interface LeaveRequestFormProps {
  onSubmit: (data: LeaveRequestFormData) => Promise<void>;
  isLoading?: boolean;
}

const leaveTypes = [
  { id: 'annual', name: 'Annual Leave' },
  { id: 'sick', name: 'Sick Leave' },
  { id: 'emergency', name: 'Emergency Leave' },
  { id: 'unpaid', name: 'Unpaid Leave' },
];

export default function LeaveRequestForm({ onSubmit, isLoading }: LeaveRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveRequestFormData>({
    resolver: yupResolver(schema),
  });

  const onFormSubmit = async (data: LeaveRequestFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request');
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">
          Leave Type
        </label>
        <select
          id="leaveType"
          {...register('leaveType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a leave type</option>
          {leaveTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.leaveType && (
          <p className="mt-1 text-sm text-red-600">{errors.leaveType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            {...register('startDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            {...register('endDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason
        </label>
        <textarea
          id="reason"
          rows={4}
          {...register('reason')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.reason && (
          <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
} 