'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FirestoreService, AppData } from '../lib/firestore-service';

export function useFirestore() {
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleError = (error: any) => {
    console.error('Firestore error:', error);
    setError(error.message || 'An error occurred');
  };

  const createData = async (content: any): Promise<string | null> => {
    if (!authState.user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      clearError();
      const firestoreService = new FirestoreService();
      const dataId = await firestoreService.createUserData(authState.user.uid, content);
      return dataId;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (dataId: string, content: any): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const firestoreService = new FirestoreService();
      await firestoreService.updateUserData(dataId, content);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (dataId: string): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const firestoreService = new FirestoreService();
      await firestoreService.deleteUserData(dataId);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async (): Promise<AppData[]> => {
    if (!authState.user) {
      setError('User not authenticated');
      return [];
    }

    try {
      setLoading(true);
      clearError();
      const firestoreService = new FirestoreService();
      const data = await firestoreService.getUserData(authState.user.uid);
      return data;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    clearError,
    createData,
    updateData,
    deleteData,
    getUserData,
  };
}