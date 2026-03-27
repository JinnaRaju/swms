
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  occupation: string;
  registrationDate: string;
  profilePictureUrl: string;
}

export enum ComplaintStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Complaint {
  id: string;
  description: string;
  submissionDate: string;
  status: ComplaintStatus;
  location: string;
  imageUrl?: string;
  resolutionTimeEstimate: string;
  assignedOfficer: {
    name: string;
    contact: string;
  };
}

export enum AwardLevel {
    Bronze = 'Bronze',
    Silver = 'Silver',
    Gold = 'Gold',
    Platinum = 'Platinum'
}

export interface Contributor {
    name: string;
    location: string;
    uploads: number;
    avatarUrl: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  imageUrl?: string;
}
