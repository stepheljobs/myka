import { AuthService } from '../auth-service';

// Mock Firebase Auth
jest.mock('../firebase', () => ({
  auth: {
    currentUser: null,
    config: { emulator: null },
  },
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updatePassword: jest.fn(),
  updateProfile: jest.fn(),
  deleteUser: jest.fn(),
  sendEmailVerification: jest.fn(),
  applyActionCode: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is authenticated', () => {
      const result = authService.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user is authenticated', () => {
      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('getAuthErrorMessage', () => {
    it('should return appropriate error messages for known error codes', () => {
      const authServiceAny = authService as any;
      
      expect(authServiceAny.getAuthErrorMessage('auth/user-not-found'))
        .toBe('No account found with this email address.');
      
      expect(authServiceAny.getAuthErrorMessage('auth/wrong-password'))
        .toBe('Incorrect password. Please try again.');
      
      expect(authServiceAny.getAuthErrorMessage('auth/email-already-in-use'))
        .toBe('An account with this email already exists.');
      
      expect(authServiceAny.getAuthErrorMessage('unknown-error'))
        .toBe('An error occurred. Please try again.');
    });
  });

  describe('mapFirebaseUser', () => {
    it('should correctly map Firebase user to AuthUser', () => {
      const authServiceAny = authService as any;
      const mockFirebaseUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
      };

      const result = authServiceAny.mapFirebaseUser(mockFirebaseUser);

      expect(result).toEqual({
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
      });
    });
  });
});