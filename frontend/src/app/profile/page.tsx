'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircleIcon, BellIcon, BriefcaseIcon, CalendarIcon, KeyIcon, DocumentTextIcon, ShieldCheckIcon, QuestionMarkCircleIcon, StarIcon, Cog6ToothIcon, InboxIcon, PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProfileData {
  avatar: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  jobRole: string;
  phone: string;
  email: string;
  dob: string;
  note?: string;
  available: boolean;
}

const initialProfileData: ProfileData = {
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Default avatar
  firstName: 'Oliver',
  lastName: 'Thompson',
  role: 'General manager',
  department: 'Research and Development',
  jobRole: 'Administrative staff',
  phone: '+1 (555) 789-0123',
  email: 'research@companyxyz.com',
  dob: '1986-12-12',
  note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  available: true,
};

const sidebarSections = [
  { key: 'personal', label: 'Personal', icon: UserCircleIcon },
  { key: 'job', label: 'Job details', icon: BriefcaseIcon },
  { key: 'timeoff', label: 'Time Off', icon: CalendarIcon },
  { key: 'notifications', label: 'Notifications', icon: BellIcon, badge: 3 },
  { key: 'permissions', label: 'Permissions', icon: ShieldCheckIcon },
  { key: 'security', label: 'Security', icon: KeyIcon },
  { key: 'questions', label: 'Questions', icon: QuestionMarkCircleIcon },
  { key: 'documents', label: 'Documents', icon: DocumentTextIcon },
  { key: 'benefits', label: 'Benefits', icon: StarIcon },
  { key: 'other', label: 'Other', icon: Cog6ToothIcon },
];

function formatDateForInput(dateStr: string) {
  const d = new Date(dateStr);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

function calculateAge(dob: string) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function AdminProfilePage() {
  const [activeSection, setActiveSection] = useState('personal');
  const [profile, setProfile] = useState<ProfileData>(initialProfileData);
  const router = useRouter();

  // Load profile data from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('adminProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Save profile data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminProfile', JSON.stringify(profile));
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleAvailabilityToggle = () => {
    setProfile((prevProfile) => ({ ...prevProfile, available: !prevProfile.available }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({ ...prevProfile, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Here you would typically send the updated profile data to your backend API
    console.log('Saving profile data:', profile);
    toast.success('Profile saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r flex flex-col py-6 px-4">
            <nav className="flex-1 space-y-1">
              {sidebarSections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition font-medium text-gray-700 hover:bg-blue-50 ${activeSection === section.key ? 'bg-blue-100 text-blue-700' : ''}`}
                >
                  <section.icon className="h-5 w-5 mr-3" />
                  {section.label}
                  {section.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{section.badge}</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {activeSection === 'personal' && (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Editable Info */}
                <div className="flex-1 bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-lg font-semibold text-gray-700">Personal Information</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Available</span>
                      <button
                        onClick={handleAvailabilityToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${profile.available ? 'bg-blue-600' : 'bg-gray-300'}`}
                        role="switch"
                        aria-checked={profile.available}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${profile.available ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="department" className="block text-xs text-gray-500 mb-1">Department</label>
                      <input type="text" id="department" name="department" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2" value={profile.department} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="jobRole" className="block text-xs text-gray-500 mb-1">Role</label>
                      <input type="text" id="jobRole" name="jobRole" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2" value={profile.jobRole} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="firstName" className="block text-xs text-gray-500 mb-1">First Name</label>
                      <input type="text" id="firstName" name="firstName" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2" value={profile.firstName} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs text-gray-500 mb-1">Last Name</label>
                      <input type="text" id="lastName" name="lastName" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2" value={profile.lastName} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs text-gray-500 mb-1">Phone Number</label>
                      <input type="text" id="phone" name="phone" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2" value={profile.phone} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs text-gray-500 mb-1">Email</label>
                      <input type="email" id="email" name="email" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2" value={profile.email} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="dob" className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <input type="date" id="dob" name="dob" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2" value={formatDateForInput(profile.dob)} onChange={handleInputChange} />
                        <span className="text-xs text-gray-400">{calculateAge(profile.dob)} y.o</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="note" className="block text-xs text-gray-500 mb-1">Note</label>
                      <textarea id="note" name="note" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2" rows={2} value={profile.note} onChange={handleInputChange} />
                    </div>
                  </form>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center md:w-80">
                  <div className="relative group mb-4">
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleAvatarChange}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <PencilIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</div>
                  <div className="text-sm text-gray-500 mb-2">{profile.role}</div>
                  <div className="text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Phone Number:</span> {profile.phone}
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    <span className="font-semibold">Email:</span> {profile.email}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <a href="#" className="text-gray-400 hover:text-blue-500"><svg width="18" height="18" fill="currentColor"><rect width="18" height="18" rx="4"/></svg></a>
                    <a href="#" className="text-gray-400 hover:text-blue-500"><svg width="18" height="18" fill="currentColor"><circle cx="9" cy="9" r="8"/></svg></a>
                    <a href="#" className="text-gray-400 hover:text-blue-500"><svg width="18" height="18" fill="currentColor"><rect width="18" height="10" y="4" rx="2"/></svg></a>
                  </div>
                </div>
              </div>
            )}
            {/* Placeholder for other sections */}
            {activeSection !== 'personal' && (
              <div className="flex items-center justify-center h-96 text-gray-400 text-lg font-medium">
                {sidebarSections.find((s) => s.key === activeSection)?.label} section coming soon...
              </div>
            )}
          </main>
        </div>
        {/* Back to Dashboard Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 