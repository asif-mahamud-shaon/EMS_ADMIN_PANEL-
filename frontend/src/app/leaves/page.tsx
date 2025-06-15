'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function Leaves() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load leave requests from localStorage
    const storedData = localStorage.getItem('leaveRequests');
    if (storedData) {
      setLeaveRequests(JSON.parse(storedData));
    } else {
      // Initialize with mock data if no data exists
      const mockData: LeaveRequest[] = [
        {
          id: '1',
          employeeName: 'John Doe',
          department: 'Engineering',
          leaveType: 'Annual Leave',
          startDate: '2024-03-01',
          endDate: '2024-03-05',
          reason: 'Family vacation',
          status: 'Pending',
        },
        {
          id: '2',
          employeeName: 'Jane Smith',
          department: 'Marketing',
          leaveType: 'Sick Leave',
          startDate: '2024-03-02',
          endDate: '2024-03-03',
          reason: 'Medical appointment',
          status: 'Pending',
        },
      ];
      setLeaveRequests(mockData);
      localStorage.setItem('leaveRequests', JSON.stringify(mockData));
    }
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      const updatedRequests = leaveRequests.map((request) =>
        request.id === id ? { ...request, status: 'Approved' as const } : request
      );
      setLeaveRequests(updatedRequests);
      localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
      toast.success('Leave request approved successfully');
    } catch (error) {
      console.error('Error approving leave request:', error);
      toast.error('Failed to approve leave request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoading(true);
      const updatedRequests = leaveRequests.map((request) =>
        request.id === id ? { ...request, status: 'Rejected' as const } : request
      );
      setLeaveRequests(updatedRequests);
      localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
      toast.success('Leave request rejected successfully');
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      toast.error('Failed to reject leave request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Leave Management</h1>
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
                    Leave Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.employeeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {request.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {request.leaveType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(request.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(request.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{request.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'Pending' && (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(request.id)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(request.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      )}
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