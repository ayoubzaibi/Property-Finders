import {
  AuthError,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../app/config/firebase";

// Types
export interface AuthErrorType {
  code: string;
  message: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: AuthErrorType;
}

// Authentication Service Class
export class AuthService {
  private auth = auth;

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: {
          code: authError.code,
          message: authError.message,
        },
      };
    }
  }

  /**
   * Create new user with email and password
   */
  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(this.auth, email, password);

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: {
          code: authError.code,
          message: authError.message,
        },
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      await firebaseSignOut(this.auth);
      return {
        success: true,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: {
          code: authError.code,
          message: authError.message,
        },
      };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export individual functions for convenience
export const signIn = (email: string, password: string) =>
  authService.signIn(email, password);
export const signUp = (email: string, password: string) =>
  authService.signUp(email, password);
export const signOut = () => authService.signOut();
export const getCurrentUser = () => authService.getCurrentUser();
export const onAuthStateChange = (callback: (user: User | null) => void) =>
  authService.onAuthStateChange(callback);
export const isAuthenticated = () => authService.isAuthenticated();
