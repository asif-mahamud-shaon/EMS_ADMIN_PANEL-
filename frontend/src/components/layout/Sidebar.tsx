'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Employees', href: '/employees', icon: UsersIcon },
  { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Designations', href: '/designations', icon: BriefcaseIcon },
  { name: 'Attendance', href: '/attendance', icon: CalendarIcon },
  { name: 'Leave Management', href: '/leaves', icon: DocumentTextIcon },
  { name: 'Payroll', href: '/payroll', icon: BanknotesIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 border-r border-gray-100 shadow-lg">
      {/* Premium top bar */}
      <div className="bg-black text-white text-center py-2 text-xs font-light tracking-wider">
        <span className="opacity-90">ADMIN PANEL</span>
      </div>
      
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100 bg-gradient-to-r from-slate-50 via-white to-slate-50">
        <div className="text-2xl font-thin text-black tracking-[0.2em] relative">
          <span className="font-serif">HRMS</span>
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-lg px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 shadow-md border border-amber-200'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-amber-700'
              }`}
            >
              <item.icon
                className={`mr-4 h-5 w-5 flex-shrink-0 transition-colors duration-300 ${
                  isActive 
                    ? 'text-amber-700' 
                    : 'text-gray-500 group-hover:text-amber-600'
                }`}
                aria-hidden="true"
              />
              <span className="uppercase tracking-wider font-light">{item.name}</span>
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600"></div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* User Info & Profile */}
      <div className="px-4 py-6 border-t border-gray-100 bg-gradient-to-r from-slate-50 via-white to-slate-50">
        <Link
          href="/profile"
          className={`group flex items-center rounded-lg px-4 py-3 text-sm font-light mb-3 transition-all duration-300 relative overflow-hidden ${
            pathname === '/profile'
              ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 shadow-md border border-amber-200'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-amber-700'
          }`}
        >
          <UserCircleIcon
            className={`mr-4 h-5 w-5 flex-shrink-0 transition-colors duration-300 ${
              pathname === '/profile' 
                ? 'text-amber-700' 
                : 'text-gray-500 group-hover:text-amber-600'
            }`}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium tracking-wide uppercase">
              {user ? `${user.firstName} ${user.lastName}` : 'Admin Profile'}
            </span>
            {user && (
              <span className="text-xs text-amber-600 capitalize font-light mt-1">{user.role}</span>
            )}
          </div>
          {pathname === '/profile' && (
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600"></div>
          )}
        </Link>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-lg px-4 py-3 text-sm font-light text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-300 border border-transparent hover:border-red-200"
        >
          <ArrowRightOnRectangleIcon
            className="mr-4 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-red-600 transition-colors duration-300"
            aria-hidden="true"
          />
          <span className="uppercase tracking-wider">Logout</span>
        </button>
      </div>
    </div>
  );
} 