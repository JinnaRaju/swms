
import { User, Complaint, ComplaintStatus, Contributor, AwardLevel } from './types';

export const MOCK_USER: User = {
  id: 'USR-001',
  firstName: 'Srikanth',
  lastName: 'Kumar',
  email: 'srikanth@example.com',
  phone: '+91 98765 43210',
  dob: '1995-08-15',
  address: '123 Greenway, Hyderabad, India',
  gender: 'Male',
  occupation: 'Student',
  registrationDate: '2023-01-10',
  profilePictureUrl: `https://picsum.photos/seed/srikanth/200`
};

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMPT-101',
    description: 'Overflowing public bins at City Park.',
    submissionDate: '2024-07-28',
    status: ComplaintStatus.InProgress,
    location: 'Jubilee Hills, Hyderabad',
    imageUrl: `https://picsum.photos/seed/overflowingbin/400/300`,
    resolutionTimeEstimate: '24 hours',
    assignedOfficer: { name: 'Rajesh Sharma', contact: '555-0101' },
  },
  {
    id: 'CMPT-102',
    description: 'Illegal dumping of construction debris.',
    submissionDate: '2024-07-27',
    status: ComplaintStatus.Pending,
    location: 'Banjara Hills, Hyderabad',
    imageUrl: `https://picsum.photos/seed/illegaldumping/400/300`,
    resolutionTimeEstimate: '72 hours',
    assignedOfficer: { name: 'Priya Singh', contact: '555-0102' },
  },
  {
    id: 'CMPT-103',
    description: 'Missed garbage collection for the entire street.',
    submissionDate: '2024-07-26',
    status: ComplaintStatus.Completed,
    location: 'Gachibowli, Hyderabad',
    imageUrl: `https://picsum.photos/seed/missedcollection/400/300`,
    resolutionTimeEstimate: 'N/A',
    assignedOfficer: { name: 'Anil Verma', contact: '555-0103' },
  },
  {
    id: 'CMPT-104',
    description: 'Hazardous medical waste found near clinic.',
    submissionDate: '2024-07-25',
    status: ComplaintStatus.Completed,
    location: 'Madhapur, Hyderabad',
    imageUrl: `https://picsum.photos/seed/hazardouswaste/400/300`,
    resolutionTimeEstimate: 'N/A',
    assignedOfficer: { name: 'Sunita Reddy', contact: '555-0104' },
  },
];

export const MOCK_CONTRIBUTORS: Contributor[] = [
    { name: 'Aarav Patel', location: 'Mumbai', uploads: 12500, avatarUrl: 'https://picsum.photos/seed/aarav/100' },
    { name: 'Priya Sharma', location: 'Delhi', uploads: 11200, avatarUrl: 'https://picsum.photos/seed/priya/100' },
    { name: 'Meera Iyer', location: 'Chennai', uploads: 8750, avatarUrl: 'https://picsum.photos/seed/meera/100' },
    { name: 'Vikram Singh', location: 'Bangalore', uploads: 7200, avatarUrl: 'https://picsum.photos/seed/vikram/100' },
];

export const TOTAL_COMPLAINTS_FOR_AWARD = 10000;

export const getAwardLevel = (uploads: number): AwardLevel | null => {
    if (uploads >= 10000) return AwardLevel.Platinum;
    if (uploads >= 7500) return AwardLevel.Gold;
    if (uploads >= 5000) return AwardLevel.Silver;
    if (uploads >= 2500) return AwardLevel.Bronze;
    return null;
}