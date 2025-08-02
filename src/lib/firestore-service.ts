import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  enableNetwork,
  disableNetwork,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

export interface AppData {
  id?: string;
  userId: string;
  content: any;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  offlineMode: boolean;
  dataSync: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  profileImage?: string;
  emailVerified: boolean;
  preferences: UserPreferences;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  authProvider: 'email' | 'google' | 'anonymous';
}

export class FirestoreService {
  // Generic CRUD operations
  async create<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  async createWithId<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: T
  ): Promise<void> {
    try {
      await setDoc(doc(db, collectionName, id), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      throw new Error(`Failed to create document with ID: ${error.message}`);
    }
  }

  async upsert<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: T
  ): Promise<void> {
    try {
      await setDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: Timestamp.now(),
      }, { merge: true });
    } catch (error: any) {
      throw new Error(`Failed to upsert document: ${error.message}`);
    }
  }

  async read<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error: any) {
      throw new Error(`Failed to read document: ${error.message}`);
    }
  }

  async update<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error: any) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  // Query operations
  async query<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error: any) {
      throw new Error(`Failed to query documents: ${error.message}`);
    }
  }

  // Real-time listeners
  onSnapshot<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    constraints: QueryConstraint[] = []
  ): () => void {
    const q = query(collection(db, collectionName), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      callback(data);
    }, (error) => {
      console.error('Snapshot listener error:', error);
    });
  }

  onDocumentSnapshot<T>(
    collectionName: string,
    id: string,
    callback: (data: T | null) => void
  ): () => void {
    const docRef = doc(db, collectionName, id);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Document snapshot listener error:', error);
    });
  }

  // User-specific operations
  async createUserProfile(userId: string, profileData: Omit<UserProfile, 'id'>): Promise<void> {
    await this.createWithId('users', userId, profileData);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.read<UserProfile>('users', userId);
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    await this.update('users', userId, updates);
  }

  async getUserData(userId: string): Promise<AppData[]> {
    return this.query<AppData>('appData', [
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    ]);
  }

  async createUserData(userId: string, content: any): Promise<string> {
    const data: Omit<AppData, 'id'> = {
      userId,
      content,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      syncStatus: 'synced',
    };
    return this.create('appData', data);
  }

  async updateUserData(dataId: string, content: any): Promise<void> {
    await this.update('appData', dataId, {
      content,
      syncStatus: 'synced',
    });
  }

  async deleteUserData(dataId: string): Promise<void> {
    await this.delete('appData', dataId);
  }

  // Offline support
  async enableOfflinePersistence(): Promise<void> {
    try {
      // Offline persistence is enabled by default in v9
      // This method is kept for compatibility and future enhancements
      console.log('Offline persistence is enabled by default');
    } catch (error: any) {
      console.error('Failed to enable offline persistence:', error);
    }
  }

  async goOffline(): Promise<void> {
    try {
      await disableNetwork(db);
    } catch (error: any) {
      throw new Error(`Failed to go offline: ${error.message}`);
    }
  }

  async goOnline(): Promise<void> {
    try {
      await enableNetwork(db);
    } catch (error: any) {
      throw new Error(`Failed to go online: ${error.message}`);
    }
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();