import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { MapPinIcon, CalendarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useComplaints } from '../context/ComplaintContext';

const StatusTrackingPage: React.FC = () => {
  type FilterType = 'All' | 'Active' | ComplaintStatus;
  const { complaints } = useComplaints();
  const [filter, setFilter] = useState<FilterType>('Active');

  const filteredComplaints = useMemo(() => {
    switch (filter) {
      case 'Active':
        return complaints.filter(c => c.status !== ComplaintStatus.Completed);
      case ComplaintStatus.Pending:
      case ComplaintStatus.InProgress:
      case ComplaintStatus.Completed:
        return complaints.filter(c => c.status === filter);
      case 'All':
      default:
        return complaints;
    }
  }, [complaints, filter]);

  const getStatusInfo = (status: ComplaintStatus): { color: string, progress: number } => {
    switch (status) {
      case ComplaintStatus.Pending:
        return { color: 'bg-yellow-500', progress: 25 };
      case ComplaintStatus.InProgress:
        return { color: 'bg-blue-500', progress: 66 };
      case ComplaintStatus.Completed:
        return { color: 'bg-green-500', progress: 100 };
      default:
        return { color: 'bg-gray-500', progress: 0 };
    }
  };

  const ComplaintCard: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
    const statusInfo = getStatusInfo(complaint.status);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden transform hover:scale-105 transition-transform duration-300">
        {complaint.imageUrl && <img src={complaint.imageUrl} alt="Complaint" className="w-full h-40 object-cover" />}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg text-gray-800">{complaint.id}</p>
              <p className="text-gray-600">{complaint.description}</p>
            </div>
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-white ${statusInfo.color}`}>
              {complaint.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-gray-400" /> {complaint.location}</div>
            <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-400" /> Submitted: {complaint.submissionDate}</div>
            <div className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-400" /> Officer: {complaint.assignedOfficer.name} ({complaint.assignedOfficer.contact})</div>
             {complaint.status !== ComplaintStatus.Completed && <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-gray-400" /> ETA: {complaint.resolutionTimeEstimate}</div>}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`${statusInfo.color} h-2.5 rounded-full`} style={{ width: `${statusInfo.progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const FilterButton: React.FC<{ label: string; value: FilterType }> = ({ label, value }) => {
    const isActive = filter === value;
    return (
      <button
        onClick={() => setFilter(value)}
        className={`px-4 py-2 text-sm font-semibold rounded-full focus:outline-none transition-colors duration-300 ${
          isActive ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Track Complaints</h2>
      
      <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-full">
        <FilterButton label="Active" value="Active" />
        <FilterButton label="All" value="All" />
        <FilterButton label="Pending" value={ComplaintStatus.Pending} />
        <FilterButton label="In Progress" value={ComplaintStatus.InProgress} />
        <FilterButton label="Completed" value={ComplaintStatus.Completed} />
      </div>

      {filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-600">No complaints found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default StatusTrackingPage;