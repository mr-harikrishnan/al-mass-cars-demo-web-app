import React, { createContext, useState, useEffect } from 'react';
import { getFromStorage, setToStorage, KEYS } from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getFromStorage(KEYS.SESSION, null);
    setCurrentUser(session);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and Password are required");
    }
    
    const users = getFromStorage(KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || user.password !== password) {
      throw new Error("Invalid email or password. Please verify and try again.");
    }
    
    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at
    };
    
    setToStorage(KEYS.SESSION, session);
    setCurrentUser(session);
    return session;
  };

  const signup = async (userData) => {
    const { name, email, phone, password, confirmPassword } = userData;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      throw new Error("All registration fields are required");
    }
    
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }

    const users = getFromStorage(KEYS.USERS, []);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("This email is already registered");
    }

    const newUser = {
      id: `usr${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      phone,
      password,
      role: 'user',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    setToStorage(KEYS.USERS, users);

    const session = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      created_at: newUser.created_at
    };
    
    setToStorage(KEYS.SESSION, session);
    setCurrentUser(session);
    return session;
  };

  const logout = () => {
    setToStorage(KEYS.SESSION, null);
    setCurrentUser(null);
  };

  const updateProfile = async (updatedData) => {
    if (!currentUser) {
      throw new Error("No active session");
    }
    
    const { name, phone, email } = updatedData;
    if (!name || !phone || !email) {
      throw new Error("Name, Phone, and Email are required");
    }

    const users = getFromStorage(KEYS.USERS, []);
    
    const emailConflict = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== currentUser.id);
    if (emailConflict) {
      throw new Error("This email is already taken by another account");
    }

    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      throw new Error("User record not found");
    }

    users[userIndex] = {
      ...users[userIndex],
      name,
      phone,
      email
    };
    setToStorage(KEYS.USERS, users);

    const updatedSession = {
      ...currentUser,
      name,
      phone,
      email
    };
    setToStorage(KEYS.SESSION, updatedSession);
    setCurrentUser(updatedSession);
    
    return updatedSession;
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
