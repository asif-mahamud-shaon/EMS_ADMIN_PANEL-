'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { 
  UserCircleIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  KeyIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  QuestionMarkCircleIcon, 
  StarIcon, 
  Cog6ToothIcon, 
  PencilIcon, 
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  HeartIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  nationalId?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  avatar?: string;
  role: string;
  department?: {
    id: number;
    name: string;
    description?: string;
  };
  designation?: {
    id: number;
    name: string;
  };
  basicSalary: number;
  dateJoined?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const sidebarSections = [
  { key: 'personal', label: 'Personal Information', icon: UserCircleIcon, color: 'bg-blue-500' },
  { key: 'job', label: 'Job Details', icon: BriefcaseIcon, color: 'bg-green-500' },
  { key: 'contact', label: 'Contact & Emergency', icon: PhoneIcon, color: 'bg-purple-500' },
  { key: 'security', label: 'Security', icon: KeyIcon, color: 'bg-red-500' },
  { key: 'documents', label: 'Documents', icon: DocumentTextIcon, color: 'bg-yellow-500' },
  { key: 'benefits', label: 'Benefits & Perks', icon: StarIcon, color: 'bg-pink-500' },
  { key: 'settings', label: 'Settings', icon: Cog6ToothIcon, color: 'bg-gray-500' },
];

function formatDateForInput(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

function calculateAge(dob?: string) {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-BD', { 
    style: 'currency', 
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('personal');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/employees/profile');
      setProfile(response.data as ProfileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Fallback to user data from auth context
      if (user) {
        setProfile({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          basicSalary: 0,
          isActive: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      await api.put('/employees/profile', profile);
      toast.success('Profile updated successfully!');
      setEditMode(false);
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => prev ? { ...prev, avatar: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile data</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckIcon className="h-5 w-5 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <aside className="w-80 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
              {/* Profile Summary Card */}
              <div className="p-6 border-b border-gray-200">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        `${profile.firstName[0]}${profile.lastName[0]}`
                      )}
                    </div>
                    {editMode && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <CameraIcon className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-800">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600">{profile.designation?.name || 'Employee'}</p>
                  <p className="text-sm text-gray-500">{profile.department?.name || 'No Department'}</p>
                  <div className="mt-3 flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      profile.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <div className="space-y-2">
                  {sidebarSections.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                        activeSection === section.key
                          ? 'bg-blue-100 text-blue-700 shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${section.color} text-white mr-3`}>
                        <section.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{section.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date(profile.updatedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formatDateForInput(profile.dateOfBirth)}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        {profile.dateOfBirth && (
                          <div className="absolute right-3 top-3 text-sm text-gray-500">
                            {calculateAge(profile.dateOfBirth)} years old
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                      <select
                        name="bloodGroup"
                        value={profile.bloodGroup || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">National ID</label>
                      <input
                        type="text"
                        name="nationalId"
                        value={profile.nationalId || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="e.g., 1234567890123"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        name="address"
                        value={profile.address || ''}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        rows={3}
                        placeholder="Enter your full address"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Job Details */}
              {activeSection === 'job' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800">Job Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <BriefcaseIcon className="h-8 w-8 text-blue-600 mr-3" />
                        <h4 className="text-lg font-semibold text-gray-800">Position</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{profile.designation?.name || 'Not Assigned'}</p>
                      <p className="text-gray-600">{profile.department?.name || 'No Department'}</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <StarIcon className="h-8 w-8 text-green-600 mr-3" />
                        <h4 className="text-lg font-semibold text-gray-800">Salary</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(profile.basicSalary)}</p>
                      <p className="text-gray-600">Basic Salary (Monthly)</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <CalendarIcon className="h-8 w-8 text-purple-600 mr-3" />
                        <h4 className="text-lg font-semibold text-gray-800">Joining Date</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {profile.dateJoined ? new Date(profile.dateJoined).toLocaleDateString() : 'Not Available'}
                      </p>
                      <p className="text-gray-600">Employment Start</p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <ShieldCheckIcon className="h-8 w-8 text-yellow-600 mr-3" />
                        <h4 className="text-lg font-semibold text-gray-800">Role</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 capitalize">{profile.role}</p>
                      <p className="text-gray-600">System Role</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact & Emergency */}
              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800">Contact & Emergency Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <div className="relative">
                        <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone || ''}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="+880 1XXXXXXXXX"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          disabled={true} // Email should not be editable
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                      <div className="relative">
                        <HeartIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          name="emergencyContact"
                          value={profile.emergencyContact || ''}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="Emergency contact name and phone number"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder sections */}
              {['security', 'documents', 'benefits', 'settings'].includes(activeSection) && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {(() => {
                      const section = sidebarSections.find(s => s.key === activeSection);
                      const IconComponent = section?.icon || QuestionMarkCircleIcon;
                      return <IconComponent className="h-12 w-12 text-gray-400" />;
                    })()}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {sidebarSections.find(s => s.key === activeSection)?.label}
                  </h3>
                  <p className="text-gray-600">This section is coming soon...</p>
                </div>
              )}
            </main>
          </div>
        </div>
        
        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 