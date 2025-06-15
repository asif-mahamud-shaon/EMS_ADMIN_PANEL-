'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PayslipForm from '@/components/payroll/PayslipForm';
import toast from 'react-hot-toast';

export default function GeneratePayroll() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // Calculate net salary
      const netSalary = data.basicSalary + data.allowances + data.bonus + data.overtime - data.deductions;

      // Create new payroll record
      const newPayroll = {
        id: Date.now().toString(),
        employeeName: 'John Doe', // TODO: Get from employee data
        department: 'Engineering', // TODO: Get from employee data
        designation: 'Software Engineer', // TODO: Get from employee data
        basicSalary: data.basicSalary,
        allowances: data.allowances,
        deductions: data.deductions,
        bonus: data.bonus,
        overtime: data.overtime,
        netSalary,
        month: data.month,
        status: 'Pending',
        notes: data.notes,
      };

      // Save to localStorage
      const existingData = localStorage.getItem('payrollData');
      const payrollData = existingData ? JSON.parse(existingData) : [];
      payrollData.push(newPayroll);
      localStorage.setItem('payrollData', JSON.stringify(payrollData));

      toast.success('Payroll generated successfully');
      router.push('/payroll');
    } catch (error) {
      console.error('Error generating payroll:', error);
      toast.error('Failed to generate payroll');
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Generate Payroll</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <PayslipForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 