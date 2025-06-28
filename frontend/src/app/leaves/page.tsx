'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CheckIcon, XMarkIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { leavesApi } from '@/services/api';
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
  const router = useRouter();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await leavesApi.getAll();
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true);
      await leavesApi.updateStatus(parseInt(id), 'approved');
      const updatedRequests = leaveRequests.map((request) =>
        request.id === id ? { ...request, status: 'Approved' as const } : request
      );
      setLeaveRequests(updatedRequests);
      toast.success('Leave request approved successfully');
    } catch (error: any) {
      console.error('Error approving leave request:', error);
      toast.error(error.response?.data?.message || 'Failed to approve leave request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(true);
      await leavesApi.updateStatus(parseInt(id), 'rejected');
      const updatedRequests = leaveRequests.map((request) =>
        request.id === id ? { ...request, status: 'Rejected' as const } : request
      );
      setLeaveRequests(updatedRequests);
      toast.success('Leave request rejected successfully');
    } catch (error: any) {
      console.error('Error rejecting leave request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject leave request');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border border-amber-200';
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
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800 tracking-wide">Leave Management</h1>
                <p className="text-gray-600 font-light mt-1">Manage employee leave requests and approvals</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/leaves/new')}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              New Leave Request
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
                    Leave Type
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-8 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-light text-lg">No leave requests found</p>
                        <p className="text-gray-400 font-light text-sm mt-1">Leave requests will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-green-25 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 tracking-wide">
                          {request.employeeName}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {request.department}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {request.leaveType}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {new Date(request.startDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-light">
                          {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-gray-600 font-light max-w-xs truncate">{request.reason}</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`status-badge ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === 'Pending' && (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(request.id)}
                              disabled={actionLoading}
                              className="text-emerald-600 hover:text-emerald-800 transition-colors duration-200 p-1 rounded-lg hover:bg-emerald-50"
                              title="Approve Request"
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(request.id)}
                              disabled={actionLoading}
                              className="delete-btn"
                              title="Reject Request"
                            >
                              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        )}
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