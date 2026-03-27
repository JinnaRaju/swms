import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { MOCK_COMPLAINTS } from '../constants';

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (data: { description: string; location: string; imageUrl?: string }) => string;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);

  const addComplaint = (data: { description: string; location: string; imageUrl?: string }): string => {
    const newComplaint: Complaint = {
      id: `CMPT-${Math.floor(Math.random() * 900) + 100}`,
      description: data.description,
      location: data.location,
      imageUrl: data.imageUrl,
      submissionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      status: ComplaintStatus.Pending,
      resolutionTimeEstimate: '72 hours',
      assignedOfficer: { name: 'Priya Singh', contact: '555-0102' }, // Mock officer assignment
    };
    setComplaints(prevComplaints => [newComplaint, ...prevComplaints]);
    return newComplaint.id;
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = (): ComplaintContextType => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
