import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/auth'; // Adjust the import based on your Firebase setup
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Check if the user is an admin (implement your own logic here)
        setIsAuthorizedAdmin(user.email === 'admin@example.com'); // Example admin check
      } else {
        setUser(null);
        setIsAuthorizedAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: user, user, loading, isAuthenticated: !!user, isAuthorizedAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};