'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowDownTrayIcon, PlusIcon, MagnifyingGlassIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { payrollApi } from '@/services/api';
import toast from 'react-hot-toast';

interface PayrollRecord {
  id: number;
  employeeName: string;
  department: string;
  designation: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  bonus: number;
  overtime: number;
  netSalary: number;
  month: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
}

export default function Payroll() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2025-05');

  useEffect(() => {
    fetchPayrollData();
  }, [selectedMonth]);

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const [year, month] = selectedMonth.split('-');
      const response = await payrollApi.getAll({
        year: parseInt(year),
        month: parseInt(month)
      });
      
      if (response.data) {
        setPayrollData(response.data as PayrollRecord[]);
      } else {
        setPayrollData([]);
        toast.error('No payroll data available');
      }
    } catch (error: any) {
      console.error('Error fetching payroll data:', error);
      setPayrollData([]);
      toast.error(error.response?.data?.message || 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayslips = () => {
    router.push('/payroll/generate');
  };

  const handleDownloadPayslip = async (record: PayrollRecord) => {
    try {
      setDownloadLoading(true);
      const response = await payrollApi.downloadPayslip(record.id);
      
      // Create a blob from the response data
      const blob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip-${record.employeeName}-${record.month}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Payslip downloaded successfully');
    } catch (error) {
      console.error('Error downloading payslip:', error);
      toast.error('Failed to download payslip');
    } finally {
      setDownloadLoading(false);
    }
  };

  const getStatusColor = (status: PayrollRecord['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border border-amber-200';
    }
  };

  const filteredData = payrollData.filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="page-header">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <BanknotesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800 tracking-wide">Payroll Management</h1>
                <p className="text-gray-600 font-light mt-1">Manage employee payroll and generate payslips</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={handleGeneratePayslips}
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Generate Payslips
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees, departments, or designations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-12"
              />
            </div>
            <div className="text-sm text-gray-600 font-light flex items-center">
              {filteredData.length} of {payrollData.length} records
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="table-container overflow-hidden">
          {loading ? (
            <div className="animate-pulse p-8">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="table-header">
                    <tr>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Employee
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Basic Salary
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Allowances
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Deductions
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Net Salary
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="relative px-8 py-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center">
                            <BanknotesIcon className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 font-light text-lg">
                              {searchTerm ? 'No records found matching your search' : 'No payroll records found'}
                            </p>
                            <p className="text-gray-400 font-light text-sm mt-1">
                              {searchTerm ? 'Try adjusting your search criteria' : 'Generate payslips to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((record) => (
                        <tr key={record.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-25 transition-all duration-200">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 tracking-wide">{record.employeeName}</div>
                              <div className="text-sm text-gray-600 font-light">{record.designation}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-gray-600 font-light">{record.department}</div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">৳{record.basicSalary.toLocaleString()}</div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-gray-600 font-light">৳{record.allowances.toLocaleString()}</div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-red-600 font-light">৳{record.deductions.toLocaleString()}</div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">৳{record.netSalary.toLocaleString()}</div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className={`status-badge ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleDownloadPayslip(record)}
                              disabled={downloadLoading}
                              className="action-btn"
                              title="Download Payslip"
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 