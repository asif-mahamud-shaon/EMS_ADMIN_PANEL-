'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  UserGroupIcon, 
  BuildingOffice2Icon, 
  StarIcon, 
  DocumentTextIcon, 
  DocumentCheckIcon, 
  DocumentPlusIcon, 
  DocumentMinusIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { dashboardApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface DashboardStats {
  overview: {
    employeeCount: number;
    departmentCount: number;
    leaveTypeCount: number;
  };
  leaveStats: {
    applied: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  attendanceStats: {
    present: number;
    absent: number;
    leave: number;
    half_day: number;
  };
}

const greetingByTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const formatTime = () => {
  return new Date().toLocaleString('en-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStats();
      setStats(response.data as DashboardStats);
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-8">
          <div className="page-header">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const overviewStats = [
    {
      label: 'Total Employees',

      value: stats?.overview.employeeCount || 0,
      icon: <UserGroupIcon className="h-8 w-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      label: 'Departments',

      value: stats?.overview.departmentCount || 0,
      icon: <BuildingOffice2Icon className="h-8 w-8" />,
      gradient: 'from-emerald-500 to-teal-500',
      change: '+2%',
      changeType: 'increase' as const,
    },
    {
      label: 'Leave Types',

      value: stats?.overview.leaveTypeCount || 4, // Default to 4 leave types
      icon: <StarIcon className="h-8 w-8" />,
      gradient: 'from-purple-500 to-pink-500',
      change: 'Stable',
      changeType: 'stable' as const,
    },
  ];

  const leaveStatsData = [
    {
      label: 'Applied',
 
      value: stats?.leaveStats.applied || 0,
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Pending',

      value: stats?.leaveStats.pending || 0,
      icon: <DocumentPlusIcon className="h-6 w-6" />,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    },
    {
      label: 'Approved',

      value: stats?.leaveStats.approved || 0,
      icon: <DocumentCheckIcon className="h-6 w-6" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    {
      label: 'Rejected',

      value: stats?.leaveStats.rejected || 0,
      icon: <DocumentMinusIcon className="h-6 w-6" />,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
  ];

  const quickActions = [
    {
      title: 'Mark Attendance',

      icon: <ClockIcon className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      action: () => {/* Navigate to attendance */}
    },
    {
      title: 'Apply Leave',

      icon: <CalendarIcon className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      action: () => {/* Navigate to leave application */}
    },
    {
      title: 'View Payroll',

      icon: <CurrencyDollarIcon className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      action: () => {/* Navigate to payroll */}
    },
    {
      title: 'Generate Report',

      icon: <ChartBarIcon className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
      action: () => {/* Navigate to reports */}
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="page-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <HomeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800 tracking-wide mb-2">
                  {greetingByTime()}, {user?.firstName}! 👋
                </h1>
                <p className="text-gray-600 font-light flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {formatTime()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 font-light">Welcome to</div>
              <div className="text-xl font-medium text-gray-800">Admin Panel</div>
              
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {overviewStats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative card hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.changeType === 'increase' 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-gray-600 bg-gray-100'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>

              </div>
            </div>
          ))}
        </div>

        {/* Leave Management Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light text-gray-800 tracking-wide">Leave Management</h2>

            </div>
            <div className="text-sm text-gray-500 font-light">This Month</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {leaveStatsData.map((stat) => (
              <div
                key={stat.label}
                className={`p-4 rounded-xl border-2 ${stat.border} ${stat.bg} hover:shadow-md transition-all duration-200 cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.color} ${stat.bg}`}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
                <div className={`font-medium ${stat.color}`}>{stat.label}</div>

              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-light text-gray-800 tracking-wide">Quick Actions</h2>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={action.action}
                className="group p-4 text-left rounded-xl border-2 border-gray-100 hover:border-transparent hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="font-semibold text-gray-800 group-hover:text-gray-900">
                  {action.title}
                </div>

              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm font-light">
          <p>🇧🇩 Made with ❤️ for Bangladesh | Created by Binti</p>
        </div>
      </div>
    </DashboardLayout>
  );
} 