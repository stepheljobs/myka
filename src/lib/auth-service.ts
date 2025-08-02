import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  updateProfile as firebaseUpdateProfile,
  deleteUser,
  sendEmailVerification as firebaseSendEmailVerification,
  applyActionCode,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export class AuthService {
  // Email/Password Authentication
  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signUp(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification after successful signup
      await this.sendEmailVerification();
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.mapFirebaseUser(user) : null;
  }

  // Password Management
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      await firebaseUpdatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Profile Management
  async updateProfile(displayName?: string, photoURL?: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      const updates: { displayName?: string; photoURL?: string } = {};
      if (displayName !== undefined) updates.displayName = displayName;
      if (photoURL !== undefined) updates.photoURL = photoURL;
      
      await firebaseUpdateProfile(user, updates);
    } catch (error: any) {
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  async deleteAccount(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      await deleteUser(user);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Authentication State
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (user) => {
      callback(user ? this.mapFirebaseUser(user) : null);
    });
  }

  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  // Email Verification
  async sendEmailVerification(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      await firebaseSendEmailVerification(user);
    } catch (error: any) {
      throw new Error('Failed to send verification email. Please try again.');
    }
  }

  async verifyEmail(code: string): Promise<void> {
    try {
      await applyActionCode(auth, code);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Helper Methods
  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }

  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/requires-recent-login':
        return 'Please sign in again to complete this action.';
      case 'auth/invalid-action-code':
        return 'Invalid or expired verification code.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

// Export singleton instance
export const authService = new AuthService();