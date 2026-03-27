import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { User, AwardLevel } from '../types';
import { getAwardLevel } from '../constants';
import { PencilIcon, XMarkIcon, CheckIcon, CameraIcon, UserCircleIcon, ChartBarIcon, Cog6ToothIcon, BellIcon, ShieldCheckIcon, TrashIcon, TrophyIcon } from '@heroicons/react/24/solid';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { complaints } = useComplaints();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(user);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!profileData) return <div>Loading...</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPreviewUrl = URL.createObjectURL(file);
      setImagePreview(newPreviewUrl);
      setProfileData(prev => prev ? { ...prev, profilePictureUrl: newPreviewUrl } : null);
    }
  };

  const handleSave = () => {
    if (profileData) {
      updateUser(profileData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData(user);
    if(imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setIsEditing(false);
  };

  const calculateProfileCompleteness = useMemo(() => {
    if (!profileData) return 0;
    const fields = ['firstName', 'lastName', 'email', 'phone', 'dob', 'address', 'gender', 'occupation'];
    const filledFields = fields.filter(field => !!profileData[field as keyof User]).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [profileData]);

  const userAwardLevel = getAwardLevel(complaints.length);
  const awardInfo = {
    [AwardLevel.Bronze]: { color: 'text-yellow-600', name: 'Bronze' },
    [AwardLevel.Silver]: { color: 'text-gray-400', name: 'Silver' },
    [AwardLevel.Gold]: { color: 'text-yellow-400', name: 'Gold' },
    [AwardLevel.Platinum]: { color: 'text-blue-400', name: 'Platinum' },
  };

  // Mock data for the activity chart
  const activityData = [
    { month: 'Feb', reports: 3 }, { month: 'Mar', reports: 5 },
    { month: 'Apr', reports: 8 }, { month: 'May', reports: 4 },
    { month: 'Jun', reports: 7 }, { month: 'Jul', reports: complaints.length },
  ];
  const maxReports = Math.max(...activityData.map(d => d.reports), 1);


  const renderTabContent = () => {
    switch (activeTab) {
      case 'activity':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full"><ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{complaints.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full"><TrophyIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" /></div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Award</p>
                        <p className={`text-2xl font-bold ${userAwardLevel ? awardInfo[userAwardLevel].color : 'text-gray-800 dark:text-gray-100'}`}>{userAwardLevel ? awardInfo[userAwardLevel].name : 'N/A'}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full"><CheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Profile Complete</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{calculateProfileCompleteness}%</p>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Contribution History (Last 6 Months)</h3>
                <div className="flex justify-around items-end h-48 border-l border-b border-gray-200 dark:border-gray-700 p-4">
                    {activityData.map(data => (
                        <div key={data.month} className="flex flex-col items-center w-1/6">
                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{data.reports}</div>
                            <div className="w-1/2 bg-green-400 rounded-t-md hover:bg-green-500 transition-colors" style={{ height: `${(data.reports / maxReports) * 100}%` }}></div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.month}</div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );
      case 'personal':
      default:
        return (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md relative">
                <div className="absolute top-6 right-6 z-10">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md transition-transform hover:scale-105">
                            <PencilIcon className="w-4 h-4" /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-transform hover:scale-105">
                                <CheckIcon className="w-4 h-4" /> Save
                            </button>
                            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 shadow-md transition-transform hover:scale-105">
                                <XMarkIcon className="w-4 h-4" /> Cancel
                            </button>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InfoField label="First Name" name="firstName" value={profileData.firstName} onChange={handleInputChange} />
                    <InfoField label="Last Name" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                    <InfoField label="Email" name="email" value={profileData.email} onChange={handleInputChange} type="email" />
                    <InfoField label="Phone Number" name="phone" value={profileData.phone} onChange={handleInputChange} type="tel" />
                    <div className="md:col-span-2">
                        <InfoField label="Address" name="address" value={profileData.address} onChange={handleInputChange} />
                    </div>
                    <InfoField label="Occupation" name="occupation" value={profileData.occupation} onChange={handleInputChange} />
                    <InfoField label="Date of Birth" name="dob" value={profileData.dob} onChange={handleInputChange} type="date" />
                    <SelectField label="Gender" name="gender" value={profileData.gender} onChange={handleInputChange} options={['Male', 'Female', 'Other', 'Prefer not to say']} />
                </div>
            </div>
        );
    }
  };

  const InfoField: React.FC<{ label: string; value: string; name: keyof User; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = 
  ({ label, value, name, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-800/50 dark:disabled:text-gray-400 transition" />
    </div>
  );

  const SelectField: React.FC<{ label: string; value: string; name: keyof User; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = 
  ({ label, value, name, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <select name={name} value={value} onChange={onChange} disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-800/50 dark:disabled:text-gray-400 transition">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
  );
  
  const TabButton: React.FC<{ label: string; id: string; icon: React.ReactNode }> = ({label, id, icon}) => (
     <button onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === id ? 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-green-500 dark:hover:text-green-400 hover:border-gray-300 dark:hover:border-gray-600'}`}>
        {icon}
        {label}
     </button>
  );

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="p-8 rounded-lg shadow-lg bg-gradient-to-tr from-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="relative group">
            <img src={profileData.profilePictureUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-green-400 shadow-md" />
            {isEditing && (
              <label htmlFor="profile-pic-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraIcon className="w-8 h-8"/>
              </label>
            )}
            <input id="profile-pic-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-gray-300">ID: {profileData.id}</p>
            <p className="text-green-300 font-semibold mt-1">Joined: {new Date(profileData.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <nav className="flex border-b border-gray-200 dark:border-gray-700">
          <TabButton label="Personal Info" id="personal" icon={<UserCircleIcon className="w-5 h-5"/>}/>
          <TabButton label="Activity & Stats" id="activity" icon={<ChartBarIcon className="w-5 h-5"/>}/>
        </nav>
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;