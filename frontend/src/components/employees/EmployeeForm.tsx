'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { departmentsApi, designationsApi } from '@/services/api';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  IdentificationIcon, 
  MapPinIcon, 
  HeartIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const schema = yup.object({
  firstName: yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name must contain only letters'),
  lastName: yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name must contain only letters'),
  email: yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .max(100, 'Email must be less than 100 characters'),
  password: yup.string()
    .when('isEditing', {
      is: false,
      then: (schema) => schema
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
      otherwise: (schema) => schema.optional()
    }),
  departmentId: yup.number()
    .required('Department is required')
    .positive('Please select a valid department'),
  designationId: yup.number()
    .required('Designation is required')
    .positive('Please select a valid designation'),
  dateJoined: yup.date()
    .required('Joining date is required')
    .max(new Date(), 'Joining date cannot be in the future'),
  basicSalary: yup.number()
    .required('Basic salary is required')
    .positive('Salary must be positive')
    .min(5000, 'Salary must be at least 5000')
    .max(1000000, 'Salary must be less than 1,000,000'),
  phone: yup.string()
    .optional()
    .matches(/^[+]?[0-9\s\-()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 characters'),
  nationalId: yup.string()
    .optional()
    .length(10, 'National ID must be exactly 10 digits')
    .matches(/^[0-9]+$/, 'National ID must contain only numbers'),
  address: yup.string()
    .optional()
    .max(200, 'Address must be less than 200 characters'),
  emergencyContact: yup.string()
    .optional()
    .matches(/^[+]?[0-9\s\-()]+$/, 'Please enter a valid emergency contact number'),
  bloodGroup: yup.string().optional(),
}).required();

type EmployeeFormData = yup.InferType<typeof schema>;

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Partial<EmployeeFormData>;
  isEditing?: boolean;
}

interface Department {
  id: number;
  name: string;
}

interface Designation {
  id: number;
  name: string;
  departmentId: number;
}

const steps = [
  {
    id: 1,
    name: 'Personal Info',
    description: 'Basic details',
    icon: UserIcon,
    fields: ['firstName', 'lastName', 'email', 'password', 'phone']
  },
  {
    id: 2,
    name: 'Job Details',
    description: 'Role & department',
    icon: BriefcaseIcon,
    fields: ['departmentId', 'designationId', 'dateJoined', 'basicSalary']
  },
  {
    id: 3,
    name: 'Additional Info',
    description: 'Extra details',
    icon: IdentificationIcon,
    fields: ['nationalId', 'address', 'emergencyContact', 'bloodGroup']
  }
];

export default function EmployeeForm({
  onSubmit,
  initialData,
  isEditing = false,
}: EmployeeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<Designation[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(schema.shape({ isEditing: yup.boolean().default(isEditing) })),
    mode: 'onChange',
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      departmentId: initialData?.departmentId || undefined,
      designationId: initialData?.designationId || undefined,
      dateJoined: initialData?.dateJoined ? new Date(initialData.dateJoined).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      basicSalary: initialData?.basicSalary || 0,
      phone: initialData?.phone || '',
      nationalId: initialData?.nationalId || '',
      address: initialData?.address || '',
      emergencyContact: initialData?.emergencyContact || '',
      bloodGroup: initialData?.bloodGroup || '',
    },
  });

  const selectedDepartmentId = watch('departmentId');

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  useEffect(() => {
    if (selectedDepartmentId && designations.length > 0) {
      const filtered = designations.filter(d => d.departmentId === Number(selectedDepartmentId));
      setFilteredDesignations(filtered);
      
      // Reset designation if it doesn't belong to selected department
      const currentDesignation = watch('designationId');
      if (currentDesignation && !filtered.find(d => d.id === Number(currentDesignation))) {
        setValue('designationId', undefined);
      }
    } else {
      setFilteredDesignations([]);
    }
  }, [selectedDepartmentId, designations, setValue, watch]);

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

  const fetchDesignations = async () => {
    try {
      const response = await designationsApi.getAll();
      setDesignations(response.data);
    } catch (error) {
      console.error('Error fetching designations:', error);
      toast.error('Failed to load designations');
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

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      await onSubmit(data);
      toast.success(
        isEditing ? 'Employee updated successfully!' : 'Employee added successfully!'
      );
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

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
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="card">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <UserIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Personal Information</h3>
                  <p className="text-amber-100 text-sm mt-1 font-light">Basic employee details and contact information</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className={`form-input ${
                      errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className={`form-input ${
                      errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`form-input ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="example@gmail.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`form-input ${
                      errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="+880 1712-345678"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className={`form-input pr-12 ${
                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                      }`}
                      placeholder="Enter a strong password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.password.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 font-light">
                    Must contain at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {currentStep === 2 && (
          <div className="card">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <BriefcaseIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Job Details</h3>
                  <p className="text-emerald-100 text-sm mt-1 font-light">Role, department and employment information</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('designationId', {
                      setValueAs: (value) => value === '' ? undefined : Number(value)
                    })}
                    disabled={!selectedDepartmentId || filteredDesignations.length === 0}
                    className={`form-select ${
                      errors.designationId ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                  >
                    <option value="">
                      {!selectedDepartmentId 
                        ? 'Select department first'
                        : filteredDesignations.length === 0
                        ? 'No designations available'
                        : 'Select designation'
                      }
                    </option>
                    {filteredDesignations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
                        {designation.name}
                      </option>
                    ))}
                  </select>
                  {errors.designationId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.designationId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Joined <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('dateJoined')}
                    className={`form-input ${
                      errors.dateJoined ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                  />
                  {errors.dateJoined && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.dateJoined.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
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
                    min="5000"
                    max="1000000"
                  />
                  {errors.basicSalary && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.basicSalary.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 font-light">
                    Enter monthly basic salary amount
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Additional Information */}
        {currentStep === 3 && (
          <div className="card">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 -m-8 mb-8 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center text-white">
                <IdentificationIcon className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="text-xl font-light tracking-wide">Additional Information</h3>
                  <p className="text-purple-100 text-sm mt-1 font-light">Optional personal and emergency details</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IdentificationIcon className="h-4 w-4 inline mr-1" />
                    National ID
                  </label>
                  <input
                    type="text"
                    {...register('nationalId')}
                    className={`form-input ${
                      errors.nationalId ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    placeholder="1234567890"
                    maxLength={10}
                  />
                  {errors.nationalId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.nationalId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HeartIcon className="h-4 w-4 inline mr-1" />
                    Blood Group
                  </label>
                  <select
                    {...register('bloodGroup')}
                    className={`form-select ${
                      errors.bloodGroup ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.bloodGroup.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Address
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className={`form-textarea ${
                    errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  placeholder="Enter full address"
                  maxLength={200}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  Emergency Contact
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
                  {isEditing ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span>{isEditing ? 'Update Employee' : 'Create Employee'}</span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 