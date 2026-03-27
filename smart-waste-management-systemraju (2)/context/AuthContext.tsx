import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USER } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (userDetails?: Partial<User>) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userDetails?: Partial<User>) => {
    if (userDetails && userDetails.firstName && userDetails.email) {
      // This path is for new sign-ups. Create a new user object.
      const newUser: User = {
        id: `USR-${Math.floor(Math.random() * 9000) + 1000}`,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName || '',
        email: userDetails.email,
        phone: userDetails.phone || '',
        dob: userDetails.dob || '',
        address: '123 Greenway, Hyderabad, India', // default value
        gender: 'Not specified', // default value
        occupation: 'Contributor', // default value
        registrationDate: new Date().toISOString().split('T')[0],
        profilePictureUrl: `https://picsum.photos/seed/${userDetails.firstName.toLowerCase()}/200`,
      };
      setUser(newUser);
    } else {
      // This path is for the standard login, which uses the mock user.
      setUser(MOCK_USER);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
