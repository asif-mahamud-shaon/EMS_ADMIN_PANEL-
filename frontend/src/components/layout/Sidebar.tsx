'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Employees', href: '/employees', icon: UsersIcon },
  { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Designations', href: '/designations', icon: BriefcaseIcon },
  { name: 'Attendance', href: '/attendance', icon: CalendarIcon },
  { name: 'Leave Management', href: '/leaves', icon: DocumentTextIcon },
  { name: 'Payroll', href: '/payroll', icon: BanknotesIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      {/* Admin Profile Button */}
      <div className="px-2 py-4 border-t border-gray-700">
        <Link
          href="/profile"
          className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
            pathname === '/profile'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <UserCircleIcon
            className={`mr-3 h-6 w-6 flex-shrink-0 ${
              pathname === '/profile' ? 'text-white' : 'text-gray-400 group-hover:text-white'
            }`}
            aria-hidden="true"
          />
          Admin Profile
        </Link>
      </div>
    </div>
  );
} 