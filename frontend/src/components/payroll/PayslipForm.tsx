'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { employeesApi } from '@/services/api';
import { 
  BanknotesIcon, 
  UserIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const schema = yup.object({
  employeeId: yup.number()
    .required('Employee is required')
    .positive('Please select a valid employee'),
  month: yup.string()
    .required('Month is required')
    .matches(/^\d{4}-\d{2}$/, 'Please select a valid month'),
  basicSalary: yup.number()
    .required('Basic salary is required')
    .positive('Basic salary must be positive')
    .min(1, 'Basic salary must be at least 1'),
  allowances: yup.number()
    .min(0, 'Allowances cannot be negative')
    .optional()
    .default(0),
  overtime: yup.number()
    .min(0, 'Overtime cannot be negative')
    .optional()
    .default(0),
  bonus: yup.number()
    .min(0, 'Bonus cannot be negative')
    .optional()
    .default(0),
  deductions: yup.number()
    .min(0, 'Deductions cannot be negative')
    .optional()
    .default(0),
  tax: yup.number()
    .min(0, 'Tax cannot be negative')
    .optional()
    .default(0),
}).required();

type PayslipFormData = yup.InferType<typeof schema>;

interface PayslipFormProps {
  onSubmit: (data: PayslipFormData) => Promise<void>;
  initialData?: Partial<PayslipFormData>;
  isEditing?: boolean;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  basicSalary: number;
  department?: {
    name: string;
  };
  designation?: {
    name: string;
  };
}

const steps = [
  {
    id: 1,
    name: 'Employee',
    description: 'Select employee',
    icon: UserIcon,
    fields: ['employeeId', 'month']
  },
  {
    id: 2,
    name: 'Earnings',
    description: 'Salary & earnings',
    icon: BanknotesIcon,
    fields: ['basicSalary', 'allowances', 'overtime', 'bonus']
  },
  {
    id: 3,
    name: 'Deductions',
    description: 'Tax & deductions',
    icon: CurrencyDollarIcon,
    fields: ['deductions', 'tax']
  }
];

export default function PayslipForm({
  onSubmit,
  initialData,
  isEditing = false,
}: PayslipFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<PayslipFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      employeeId: initialData?.employeeId || undefined,
      month: initialData?.month || new Date().toISOString().slice(0, 7),
      basicSalary: initialData?.basicSalary || 0,
      allowances: initialData?.allowances || 0,
      overtime: initialData?.overtime || 0,
      bonus: initialData?.bonus || 0,
      deductions: initialData?.deductions || 0,
      tax: initialData?.tax || 0,
    },
  });

  const selectedEmployeeId = watch('employeeId');
  const basicSalary = watch('basicSalary');
  const allowances = watch('allowances') || 0;
  const overtime = watch('overtime') || 0;
  const bonus = watch('bonus') || 0;
  const deductions = watch('deductions') || 0;
  const tax = watch('tax') || 0;

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      const selectedEmployee = employees.find(emp => emp.id === Number(selectedEmployeeId));
      if (selectedEmployee && !initialData?.basicSalary) {
        setValue('basicSalary', selectedEmployee.basicSalary);
      }
    }
  }, [selectedEmployeeId, employees, setValue, initialData]);

  const fetchEmployees = async () => {
    try {
      const response = await employeesApi.getAll();
      setEmployees(response.data as Employee[]);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setIsLoadingEmployees(false);
    }
  };

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

  const handleFormSubmit = async (data: PayslipFormData) => {
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

  const calculateGrossEarnings = () => basicSalary + allowances + overtime + bonus;
  const calculateTotalDeductions = () => deductions + tax;
  const calculateNetSalary = () => calculateGrossEarnings() - calculateTotalDeductions();

  const selectedEmployee = employees.find(emp => emp.id === Number(selectedEmployeeId));

  return (
    <div className="max-w-4xl mx-auto">
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
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : status === 'current'
                            ? 'bg-white border-amber-600 text-amber-600'
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
                            status === 'completed' ? 'bg-amber-600' : 'bg-gray-300'
                          }`}
                          style={{ width: 'calc(100% + 2rem)' }}
                        />
                      )}
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium transition-colors duration-300 ${
                          status === 'current' ? 'text-amber-600' : status === 'completed' ? 'text-amber-600' : 'text-gray-500'
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
        {/* Step 1: Employee & Period */}
        {currentStep === 1 && (
          <div className="card">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <UserIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Employee & Period</h3>
                  <p className="text-blue-100 text-sm mt-1 font-light">Select employee and payroll period</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('employeeId', {
                    setValueAs: (value) => value === '' ? undefined : Number(value)
                  })}
                  disabled={isLoadingEmployees}
                  className={`form-select ${
                    errors.employeeId ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                >
                  <option value="">
                    {isLoadingEmployees ? 'Loading employees...' : 'Select employee'}
                  </option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                      {employee.department?.name && ` - ${employee.department.name}`}
                      {employee.designation?.name && ` (${employee.designation.name})`}
                    </option>
                  ))}
                </select>
                {errors.employeeId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.employeeId.message}
                  </p>
                )}
              </div>

              {selectedEmployee && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Employee Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700">Name:</span>
                      <span className="ml-2 text-blue-900 font-medium">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Basic Salary:</span>
                      <span className="ml-2 text-blue-900 font-medium">
                        ৳{selectedEmployee.basicSalary.toLocaleString()}
                      </span>
                    </div>
                    {selectedEmployee.department && (
                      <div>
                        <span className="text-blue-700">Department:</span>
                        <span className="ml-2 text-blue-900 font-medium">
                          {selectedEmployee.department.name}
                        </span>
                      </div>
                    )}
                    {selectedEmployee.designation && (
                      <div>
                        <span className="text-blue-700">Designation:</span>
                        <span className="ml-2 text-blue-900 font-medium">
                          {selectedEmployee.designation.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  Payroll Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  {...register('month')}
                  max={new Date().toISOString().slice(0, 7)}
                  className={`form-input ${
                    errors.month ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                />
                {errors.month && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.month.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Earnings */}
        {currentStep === 2 && (
          <div className="card">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <BanknotesIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Earnings</h3>
                  <p className="text-emerald-100 text-sm mt-1 font-light">Configure salary and additional earnings</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Salary (BDT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('basicSalary', {
                      setValueAs: (value) => value === '' ? 0 : Number(value)
                    })}
                    className={`form-input ${
                      errors.basicSalary ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="50000"
                    min="1"
                  />
                  {errors.basicSalary && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.basicSalary.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowances (BDT)
                  </label>
                  <input
                    type="number"
                    {...register('allowances', {
                      setValueAs: (value) => value === '' ? 0 : Number(value)
                    })}
                    className={`form-input ${
                      errors.allowances ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="5000"
                    min="0"
                  />
                  {errors.allowances && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.allowances.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 font-light">
                    Transport, housing, meal allowances
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Overtime Pay (BDT)
                  </label>
                  <input
                    type="number"
                    {...register('overtime', {
                      setValueAs: (value) => value === '' ? 0 : Number(value)
                    })}
                    className={`form-input ${
                      errors.overtime ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="3000"
                    min="0"
                  />
                  {errors.overtime && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.overtime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bonus (BDT)
                  </label>
                  <input
                    type="number"
                    {...register('bonus', {
                      setValueAs: (value) => value === '' ? 0 : Number(value)
                    })}
                    className={`form-input ${
                      errors.bonus ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="10000"
                    min="0"
                  />
                  {errors.bonus && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.bonus.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 font-light">
                    Performance bonus, festival bonus
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800 font-medium">Gross Earnings:</span>
                  <span className="text-emerald-900 font-bold text-lg">
                    ৳{calculateGrossEarnings().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Deductions */}
        {currentStep === 3 && (
          <div className="card">
            <div className="bg-gradient-to-r from-red-600 to-red-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <CurrencyDollarIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Deductions</h3>
                  <p className="text-red-100 text-sm mt-1 font-light">Configure tax and other deductions</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Deductions (BDT)
                  </label>
                  <input
                    type="number"
                    {...register('deductions', {
                      setValueAs: (value) => value === '' ? 0 : Number(value)
                    })}
                    className={`form-input ${
                      errors.deductions ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="2000"
                    min="0"
                  />
                  {errors.deductions && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.deductions.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 font-light">
                    Insurance, loan repayment, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax (BDT)
                  </label>
                  <input
                    type="number"
                    {...register('tax', {
                      setValueAs: (value) => value === '' ? 0 : Number(value)
                    })}
                    className={`form-input ${
                      errors.tax ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="5000"
                    min="0"
                  />
                  {errors.tax && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.tax.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 font-light">
                    Income tax deduction
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                <h4 className="font-medium text-gray-900 text-lg">Salary Summary</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Salary:</span>
                      <span className="text-gray-900">৳{basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allowances:</span>
                      <span className="text-gray-900">৳{allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overtime:</span>
                      <span className="text-gray-900">৳{overtime.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bonus:</span>
                      <span className="text-gray-900">৳{bonus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span className="text-emerald-700">Gross Earnings:</span>
                      <span className="text-emerald-800">৳{calculateGrossEarnings().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Deductions:</span>
                      <span className="text-gray-900">৳{deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="text-gray-900">৳{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span className="text-red-700">Total Deductions:</span>
                      <span className="text-red-800">৳{calculateTotalDeductions().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-lg">
                      <span className="text-blue-700">Net Salary:</span>
                      <span className="text-blue-800">৳{calculateNetSalary().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
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
                    ? 'bg-amber-600'
                    : step.id < currentStep
                    ? 'bg-amber-300'
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
                  {isEditing ? 'Updating...' : 'Generating...'}
                </span>
              ) : (
                <span>{isEditing ? 'Update Payslip' : 'Generate Payslip'}</span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}