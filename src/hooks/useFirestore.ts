'use client';

import { useState, useEffect } from 'react';
import { FirestoreService, AppData } from '@/lib/firestore-service';
import { useAuth } from '@/contexts/AuthContext';
import { where, orderBy } from 'firebase/firestore';

export function useFirestore() {
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleError = (error: any) => {
    const message = error.message || 'An error occurred';
    setError(message);
    console.error('Firestore error:', error);
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
      const id = await firestoreService.createUserData(authState.user.uid, content);
      return id;
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

export function useRealtimeData() {
  const { state: authState } = useAuth();
  const [data, setData] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authState.user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const firestoreService = new FirestoreService();
    
    const unsubscribe = firestoreService.onSnapshot<AppData>(
      'appData',
      (newData) => {
        setData(newData);
        setLoading(false);
      },
      [
        where('userId', '==', authState.user.uid),
        orderBy('updatedAt', 'desc')
      ]
    );

    return () => unsubscribe();
  }, [authState.user]);

  return { data, loading, error };
}