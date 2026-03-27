import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserCircleIcon, ListBulletIcon, DocumentPlusIcon, ClockIcon, QuestionMarkCircleIcon, TrophyIcon, ArrowRightIcon, BellAlertIcon, CheckCircleIcon, InformationCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { useComplaints } from '../context/ComplaintContext';
import { ComplaintStatus } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();

  const completedCount = complaints.filter(c => c.status === ComplaintStatus.Completed).length;
  const recentComplaint = complaints.length > 0 ? complaints[0] : null;

  const menuItems = [
    { name: 'New Complaint', path: '/complaint', icon: DocumentPlusIcon, color: 'from-emerald-500 to-green-600', description: 'Report a new waste issue in your area.' },
    { name: 'Profile', path: '/profile', icon: UserCircleIcon, color: 'from-slate-500 to-gray-600', description: 'View your contributions and details.' },
    { name: 'Status Tracking', path: '/status', icon: ListBulletIcon, color: 'from-sky-500 to-blue-600', description: 'Check the progress of your reports.' },
    { name: 'History', path: '/history', icon: ClockIcon, color: 'from-indigo-500 to-violet-600', description: 'View all your past submissions.' },
    { name: 'Awards', path: '/awards', icon: TrophyIcon, color: 'from-amber-400 to-yellow-500', description: 'See your achievements and rank.' },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon, color: 'from-rose-500 to-pink-600', description: 'Manage your account and preferences.' },
  ];

  const newComplaintItem = menuItems[0];
  const otherMenuItems = menuItems.slice(1);

  const getStatusInfo = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.Pending:
        return { icon: <BellAlertIcon className="w-6 h-6" />, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/50", borderColor: "border-yellow-500", text: "Is Pending Review" };
      case ComplaintStatus.InProgress:
        return { icon: <InformationCircleIcon className="w-6 h-6" />, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/50", borderColor: "border-blue-500", text: "Is In Progress" };
      case ComplaintStatus.Completed:
        return { icon: <CheckCircleIcon className="w-6 h-6" />, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/50", borderColor: "border-green-500", text: "Has Been Completed" };
      default:
        return { icon: <InformationCircleIcon className="w-6 h-6" />, color: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-700", borderColor: "border-gray-500", text: "Status Unknown" };
    }
  };
  
  const recentStatusInfo = recentComplaint ? getStatusInfo(recentComplaint.status) : null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-800 p-6 text-white shadow-xl">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-green-500/20 opacity-50 blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-500/20 opacity-50 blur-2xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <img src={user?.profilePictureUrl} alt="Profile" className="w-20 h-20 rounded-full border-4 border-green-400 object-cover mb-4 sm:mb-0"/>
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h2>
                <p className="mt-1 max-w-2xl text-lg text-gray-300">
                  You've helped resolve <span className="font-bold text-green-400">{completedCount}</span> issues. Your contributions make our city cleaner.
                </p>
            </div>
        </div>
      </div>

      {/* Main Action: New Complaint */}
      <Link
        to={newComplaintItem.path}
        className={`group relative flex w-full flex-col items-start justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${newComplaintItem.color} p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/20 p-3 transition-transform duration-300 group-hover:scale-110">
            <newComplaintItem.icon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{newComplaintItem.name}</h3>
            <p className="text-green-100">{newComplaintItem.description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-green-700 transition-colors duration-300 group-hover:bg-white sm:mt-0">
          Report Now <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>

      {/* Other Menu Items */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {otherMenuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className={`inline-block rounded-lg bg-gradient-to-br p-3 text-white ${item.color}`}>
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-gray-100">{item.name}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            </div>
            <ArrowRightIcon className="absolute right-6 top-6 h-6 w-6 text-gray-300 dark:text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
          </Link>
        ))}
      </div>
      
      {/* Recent Activity Section */}
      {recentComplaint && recentStatusInfo && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h3>
          <Link to="/status" className="block group">
            <div className={`rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md transition duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-green-500 border-l-4 ${recentStatusInfo.borderColor}`}>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 rounded-full p-3 ${recentStatusInfo.bgColor} ${recentStatusInfo.color}`}>
                            {recentStatusInfo.icon}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100">
                                Complaint <span className="font-mono text-green-600 dark:text-green-400">{recentComplaint.id}</span> {recentStatusInfo.text}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{recentComplaint.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300 self-end sm:self-center">
                        View Details
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;