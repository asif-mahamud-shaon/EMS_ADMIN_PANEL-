'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowDownTrayIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { attendanceApi } from '@/services/api';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  workingHours: string;
}

export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await attendanceApi.getAll();
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    try {
      setDownloadLoading(true);

      // Prepare data for Excel
      const excelData = attendanceRecords.map((record) => ({
        'Employee Name': record.employeeName,
        'Department': record.department,
        'Date': record.date,
        'Check In': record.checkIn,
        'Check Out': record.checkOut,
        'Status': record.status,
        'Working Hours': record.workingHours,
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');

      // Generate Excel file
      XLSX.writeFile(workbook, 'attendance_records.xlsx');

      toast.success('Attendance records downloaded successfully');
    } catch (error) {
      console.error('Error downloading attendance records:', error);
      toast.error('Failed to download attendance records');
    } finally {
      setDownloadLoading(false);
    }
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Late':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Half Day':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="page-header">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>
          <div className="table-container">
            <div className="animate-pulse p-8">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="page-header">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800 tracking-wide">Attendance Management</h1>
                <p className="text-gray-600 font-light mt-1">Track employee attendance and working hours</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={downloadLoading}
              className="btn-primary inline-flex items-center"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              {downloadLoading ? 'Downloading...' : 'Download Excel'}
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Employee
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Check In
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Check Out
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Working Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-light text-lg">No attendance records found</p>
                        <p className="text-gray-400 font-light text-sm mt-1">Attendance data will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-25 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 tracking-wide">
                          {record.employeeName}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">{record.department}</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">{record.checkIn}</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">{record.checkOut}</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`status-badge ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">{record.workingHours}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 