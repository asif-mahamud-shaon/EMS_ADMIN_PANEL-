'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserGroupIcon, BuildingOffice2Icon, StarIcon, DocumentTextIcon, DocumentCheckIcon, DocumentPlusIcon, DocumentMinusIcon } from '@heroicons/react/24/outline';

const stats = [
  {
    label: 'REGISTERED EMPLOYEES',
    value: 3,
    icon: <UserGroupIcon className="h-8 w-8 text-white" />,
    bg: 'bg-teal-500',
  },
  {
    label: 'LISTED DEPARTMENTS',
    value: 4,
    icon: <BuildingOffice2Icon className="h-8 w-8 text-white" />,
    bg: 'bg-yellow-400',
  },
  {
    label: 'LISTED LEAVE TYPE',
    value: 2,
    icon: <StarIcon className="h-8 w-8 text-white" />,
    bg: 'bg-rose-500',
  },
];

const leaveStats = [
  {
    label: 'LEAVES APPLIED',
    value: 4,
    icon: <DocumentTextIcon className="h-8 w-8 text-white" />,
    bg: 'bg-cyan-600',
  },
  {
    label: 'NEW LEAVE REQUESTS',
    value: 1,
    icon: <DocumentPlusIcon className="h-8 w-8 text-white" />,
    bg: 'bg-yellow-400',
  },
  {
    label: 'RJECTED LEAVE REQUESTS',
    value: 1,
    icon: <DocumentMinusIcon className="h-8 w-8 text-white" />,
    bg: 'bg-rose-500',
  },
  {
    label: 'APPROVED LEAVE REQUESTS',
    value: 2,
    icon: <DocumentCheckIcon className="h-8 w-8 text-white" />,
    bg: 'bg-green-500',
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="px-2 md:px-6 py-4 space-y-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="inline-block">&#128200;</span> Dashboard
          </h1>
          <div className="text-sm text-gray-700 font-medium">Welcome Back : <span className="font-bold">Admin</span></div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center p-4 rounded-lg shadow bg-white">
              <div className={`flex items-center justify-center h-14 w-14 rounded-full ${stat.bg} mr-4`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaves Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Leaves Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaveStats.map((stat) => (
              <div key={stat.label} className="flex items-center p-4 rounded-lg shadow bg-white">
                <div className={`flex items-center justify-center h-14 w-14 rounded-full ${stat.bg} mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">{stat.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 