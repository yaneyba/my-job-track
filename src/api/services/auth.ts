import { User, LoginResponse, RegisterRequest, ApiResponse } from '../types';
import { generateId, getCurrentTimestamp, hashPassword, verifyPassword, generateToken, getTokenExpiry, isTokenExpired } from '../utils/db';

export class AuthService {
  constructor(private db: any) {}

  async register(userData: RegisterRequest): Promise<ApiResponse<Omit<User, 'password_hash'>>> {
    try {
      // Check if user already exists
      const existingUser = await this.db
        .prepare('SELECT id FROM users WHERE email = ?')
        .bind(userData.email)
        .first();

      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Hash password
      const passwordHash = await hashPassword(userData.password);
      
      // Generate user ID and timestamps
      const userId = generateId();
      const now = getCurrentTimestamp();
      
      // Create user
      await this.db
        .prepare(`
          INSERT INTO users (id, email, name, business_name, password_hash, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(userId, userData.email, userData.name, userData.business_name || null, passwordHash, now, now)
        .run();

      // Get the created user (without password hash)
      const user = await this.db
        .prepare('SELECT id, email, name, business_name, created_at, updated_at FROM users WHERE id = ?')
        .bind(userId)
        .first();

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Failed to register user'
      };
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Find user by email
      const user = await this.db
        .prepare('SELECT id, email, name, business_name, password_hash, created_at, updated_at FROM users WHERE email = ?')
        .bind(email)
        .first();

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Generate session token
      const token = generateToken();
      const sessionId = generateId();
      const expiresAt = getTokenExpiry(24); // 24 hours
      const now = getCurrentTimestamp();

      // Create session
      await this.db
        .prepare(`
          INSERT INTO sessions (id, user_id, token, expires_at, created_at)
          VALUES (?, ?, ?, ?, ?)
        `)
        .bind(sessionId, user.id, token, expiresAt, now)
        .run();

      // Return success response with token and user data (without password hash)
      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          business_name: user.business_name,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Failed to login'
      };
    }
  }

  async validateToken(token: string): Promise<Omit<User, 'password_hash'> | null> {
    try {
      // Find session by token
      const session = await this.db
        .prepare(`
          SELECT s.*, u.id as user_id, u.email, u.name, u.business_name, u.created_at, u.updated_at
          FROM sessions s 
          JOIN users u ON s.user_id = u.id 
          WHERE s.token = ?
        `)
        .bind(token)
        .first();

      if (!session) {
        return null;
      }

      // Check if token is expired
      if (isTokenExpired(session.expires_at)) {
        // Clean up expired session
        await this.db
          .prepare('DELETE FROM sessions WHERE id = ?')
          .bind(session.id)
          .run();
        return null;
      }

      // Return user data
      return {
        id: session.user_id,
        email: session.email,
        name: session.name,
        business_name: session.business_name,
        created_at: session.created_at,
        updated_at: session.updated_at
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  async logout(token: string): Promise<ApiResponse<{ message: string }>> {
    try {
      // Delete session
      const result = await this.db
        .prepare('DELETE FROM sessions WHERE token = ?')
        .bind(token)
        .run();

      if (result.changes === 0) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      return {
        success: true,
        data: { message: 'Successfully logged out' }
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Failed to logout'
      };
    }
  }

  async refreshToken(oldToken: string): Promise<LoginResponse> {
    try {
      // Validate current token and get user
      const user = await this.validateToken(oldToken);
      if (!user) {
        return {
          success: false,
          error: 'Invalid token'
        };
      }

      // Generate new token
      const newToken = generateToken();
      const expiresAt = getTokenExpiry(24); // 24 hours
      const now = getCurrentTimestamp();

      // Update existing session with new token
      await this.db
        .prepare(`
          UPDATE sessions 
          SET token = ?, expires_at = ?, created_at = ?
          WHERE token = ?
        `)
        .bind(newToken, expiresAt, now, oldToken)
        .run();

      return {
        success: true,
        token: newToken,
        user
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Failed to refresh token'
      };
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = getCurrentTimestamp();
      await this.db
        .prepare('DELETE FROM sessions WHERE expires_at < ?')
        .bind(now)
        .run();
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }
}
