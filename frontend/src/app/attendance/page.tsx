'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load attendance records from localStorage
    const storedData = localStorage.getItem('attendanceRecords');
    if (storedData) {
      setAttendanceRecords(JSON.parse(storedData));
    } else {
      // Initialize with mock data if no data exists
      const mockData: AttendanceRecord[] = [
        {
          id: '1',
          employeeName: 'John Doe',
          department: 'Engineering',
          date: '2024-03-01',
          checkIn: '09:00 AM',
          checkOut: '06:00 PM',
          status: 'Present',
          workingHours: '9h',
        },
        {
          id: '2',
          employeeName: 'Jane Smith',
          department: 'Marketing',
          date: '2024-03-01',
          checkIn: '09:15 AM',
          checkOut: '06:00 PM',
          status: 'Late',
          workingHours: '8.75h',
        },
        {
          id: '3',
          employeeName: 'Mike Johnson',
          department: 'Sales',
          date: '2024-03-01',
          checkIn: '09:00 AM',
          checkOut: '02:00 PM',
          status: 'Half Day',
          workingHours: '5h',
        },
      ];
      setAttendanceRecords(mockData);
      localStorage.setItem('attendanceRecords', JSON.stringify(mockData));
    }
  }, []);

  const handleDownloadExcel = () => {
    try {
      setLoading(true);

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
      setLoading(false);
    }
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800';
      case 'Half Day':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Attendance Records</h1>
          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            {loading ? 'Downloading...' : 'Download Excel'}
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Employee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check In
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check Out
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Working Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.employeeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{record.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{record.checkIn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{record.checkOut}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{record.workingHours}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 