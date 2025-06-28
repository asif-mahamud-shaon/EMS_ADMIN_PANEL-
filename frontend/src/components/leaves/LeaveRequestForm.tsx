'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon,
  ClockIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';

const schema = yup.object({
  leaveType: yup.string()
    .required('Leave type is required')
    .oneOf(['Sick', 'Casual', 'Annual', 'Maternity', 'Paternity', 'Emergency'], 'Please select a valid leave type'),
  startDate: yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),
  endDate: yup.date()
    .required('End date is required')
    .test('is-after-start', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      return !startDate || !value || value >= startDate;
    }),
  reason: yup.string()
    .required('Reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters'),
  emergencyContact: yup.string()
    .optional()
    .matches(/^[+]?[0-9\s\-()]+$/, 'Please enter a valid contact number'),
}).required();

type LeaveRequestFormData = yup.InferType<typeof schema>;

interface LeaveRequestFormProps {
  onSubmit: (data: LeaveRequestFormData) => Promise<void>;
  initialData?: Partial<LeaveRequestFormData>;
  isEditing?: boolean;
}

const steps = [
  {
    id: 1,
    name: 'Leave Type',
    description: 'Select type',
    icon: DocumentTextIcon,
    fields: ['leaveType']
  },
  {
    id: 2,
    name: 'Dates',
    description: 'Choose dates',
    icon: CalendarIcon,
    fields: ['startDate', 'endDate']
  },
  {
    id: 3,
    name: 'Details',
    description: 'Reason & contact',
    icon: UserIcon,
    fields: ['reason', 'emergencyContact']
  }
];

const leaveTypes = [
  { value: 'Sick', label: 'Sick Leave', description: 'For medical reasons or illness' },
  { value: 'Casual', label: 'Casual Leave', description: 'For personal matters' },
  { value: 'Annual', label: 'Annual Leave', description: 'Planned vacation time' },
  { value: 'Maternity', label: 'Maternity Leave', description: 'For expecting mothers' },
  { value: 'Paternity', label: 'Paternity Leave', description: 'For new fathers' },
  { value: 'Emergency', label: 'Emergency Leave', description: 'For urgent situations' },
];

export default function LeaveRequestForm({
  onSubmit,
  initialData,
  isEditing = false,
}: LeaveRequestFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      leaveType: initialData?.leaveType || '',
      startDate: initialData?.startDate 
        ? new Date(initialData.startDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      endDate: initialData?.endDate 
        ? new Date(initialData.endDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      reason: initialData?.reason || '',
      emergencyContact: initialData?.emergencyContact || '',
    },
  });

  const validateCurrentStep = async () => {
    const currentStepFields = steps.find(step => step.id === currentStep)?.fields || [];
    return await trigger(currentStepFields as any);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = async (data: LeaveRequestFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedLeaveType = watch('leaveType');
  const reasonLength = watch('reason')?.length || 0;

  // Calculate number of days
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper Navigation */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIdx) => {
              const status = getStepStatus(step.id);
              return (
                <li key={step.name} className="relative flex-1">
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          status === 'completed'
                            ? 'bg-green-600 border-green-600 text-white'
                            : status === 'current'
                            ? 'bg-white border-green-600 text-green-600'
                            : 'bg-white border-gray-300 text-gray-500'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckIcon className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>
                      {stepIdx < steps.length - 1 && (
                        <div
                          className={`absolute top-6 left-6 w-full h-0.5 transition-all duration-300 ${
                            status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                          style={{ width: 'calc(100% + 2rem)' }}
                        />
                      )}
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium transition-colors duration-300 ${
                          status === 'current' ? 'text-green-600' : status === 'completed' ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Step 1: Leave Type */}
        {currentStep === 1 && (
          <div className="card">
            <div className="bg-gradient-to-r from-green-600 to-green-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <DocumentTextIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Leave Type Selection</h3>
                  <p className="text-green-100 text-sm mt-1 font-light">Choose the type of leave you want to request</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {leaveTypes.map((type) => (
                <div key={type.value}>
                  <label className="relative flex items-start cursor-pointer group">
                    <input
                      type="radio"
                      value={type.value}
                      {...register('leaveType')}
                      className="sr-only"
                    />
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 mr-3 transition-all duration-200 ${
                      selectedLeaveType === type.value
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300 group-hover:border-green-400'
                    }`}>
                      {selectedLeaveType === type.value && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className={`flex-1 p-4 rounded-xl border transition-all duration-200 ${
                      selectedLeaveType === type.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600 font-light mt-1">{type.description}</div>
                    </div>
                  </label>
                </div>
              ))}
              {errors.leaveType && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.leaveType.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Dates */}
        {currentStep === 2 && (
          <div className="card">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <CalendarIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Leave Dates</h3>
                  <p className="text-blue-100 text-sm mt-1 font-light">Select your leave start and end dates</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className={`form-input ${
                      errors.startDate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('endDate')}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className={`form-input ${
                      errors.endDate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {startDate && endDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Duration: {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}</span>
                      <p className="text-xs text-blue-600 font-light mt-1">
                        From {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {currentStep === 3 && (
          <div className="card">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <UserIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Additional Details</h3>
                  <p className="text-purple-100 text-sm mt-1 font-light">Provide reason and emergency contact</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('reason')}
                  rows={4}
                  className={`form-textarea ${
                    errors.reason ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  placeholder="Please provide a detailed reason for your leave request..."
                  maxLength={500}
                />
                {errors.reason && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.reason.message}
                  </p>
                )}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 font-light">
                    Provide clear and detailed reason
                  </p>
                  <p className={`text-xs font-light ${
                    reasonLength > 450 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {reasonLength}/500 characters
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  {...register('emergencyContact')}
                  className={`form-input ${
                    errors.emergencyContact ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  placeholder="+880 1712-345678"
                />
                {errors.emergencyContact && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.emergencyContact.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 font-light">
                  Optional contact number in case of emergency during leave
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  step.id === currentStep
                    ? 'bg-green-600'
                    : step.id < currentStep
                    ? 'bg-green-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
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
                  {isEditing ? 'Updating...' : 'Submitting...'}
                </span>
              ) : (
                <span>{isEditing ? 'Update Request' : 'Submit Request'}</span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 