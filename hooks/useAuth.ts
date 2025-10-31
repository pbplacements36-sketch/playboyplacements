import { useState, useEffect } from 'react';

export interface User {
  id: string;
  membershipType: 'inactive' | 'STANDARD' | 'PREMIUM';
  // Add other user properties as needed
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateMembership = (type: 'inactive' | 'STANDARD' | 'PREMIUM') => {
    if (user) {
      const updatedUser = { ...user, membershipType: type };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    updateMembership
  };
};