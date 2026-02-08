import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveUserProfile,
  getUserProfile,
  saveGroupId,
  getGroupId,
  clearAllData,
} from '../services/localStorage';
import { initializeFirebase } from '../services/firebase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function loadSavedState() {
      try {
        const profile = await getUserProfile();
        const savedGroupId = await getGroupId();
        if (profile) {
          setUser(profile);
          setMembers(profile.members || []);
        }
        if (savedGroupId) setGroupId(savedGroupId);
      } catch (error) {
        console.warn('Error loading saved state:', error);
      }
      setLoading(false);
    }
    loadSavedState();
  }, []);

  const login = async (name, groupMembers) => {
    const profile = { name, members: groupMembers, createdAt: new Date().toISOString() };
    await saveUserProfile(profile);
    setUser(profile);
    setMembers(groupMembers);
  };

  const joinGroup = async (id) => {
    await saveGroupId(id);
    setGroupId(id);
  };

  const connectFirebase = (config) => {
    const success = initializeFirebase(config);
    setIsFirebaseConnected(success);
    return success;
  };

  const logout = async () => {
    await clearAllData();
    setUser(null);
    setGroupId(null);
    setMembers([]);
    setIsFirebaseConnected(false);
  };

  const updateMembers = async (newMembers) => {
    setMembers(newMembers);
    if (user) {
      const updated = { ...user, members: newMembers };
      await saveUserProfile(updated);
      setUser(updated);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        groupId,
        isFirebaseConnected,
        loading,
        members,
        login,
        joinGroup,
        connectFirebase,
        logout,
        updateMembers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
