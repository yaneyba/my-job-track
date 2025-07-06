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
      
      // Create user
      const userId = generateId();
      const now = getCurrentTimestamp();
      
      await this.db
        .prepare(`
          INSERT INTO users (id, email, name, businessName, passwordHash, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(userId, userData.email, userData.name, userData.businessName || null, passwordHash, now, now)
        .run();

      // Get the created user (without password hash)
      const user = await this.db
        .prepare('SELECT id, email, name, businessName, createdAt, updatedAt FROM users WHERE id = ?')
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
      // Get user with password hash
      const user = await this.db
        .prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first();

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
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

      // Store session
      await this.db
        .prepare(`
          INSERT INTO sessions (id, userId, token, expiresAt, createdAt)
          VALUES (?, ?, ?, ?, ?)
        `)
        .bind(sessionId, user.id, token, expiresAt, now)
        .run();

      // Clean up expired sessions for this user
      await this.cleanupExpiredSessions(user.id);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          businessName: user.businessName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
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

  async logout(token: string): Promise<boolean> {
    try {
      await this.db
        .prepare('DELETE FROM sessions WHERE token = ?')
        .bind(token)
        .run();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  async validateToken(token: string): Promise<Omit<User, 'passwordHash'> | null> {
    try {
      const session = await this.db
        .prepare(`
          SELECT s.*, u.id as userId, u.email, u.name, u.businessName, u.createdAt, u.updatedAt
          FROM sessions s
          JOIN users u ON s.userId = u.id
          WHERE s.token = ?
        `)
        .bind(token)
        .first();

      if (!session) {
        return null;
      }

      // Check if token is expired
      if (isTokenExpired(session.expiresAt)) {
        // Clean up expired session
        await this.db
          .prepare('DELETE FROM sessions WHERE token = ?')
          .bind(token)
          .run();
        return null;
      }

      return {
        id: session.userId,
        email: session.email,
        name: session.name,
        businessName: session.businessName,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  private async cleanupExpiredSessions(userId: string): Promise<void> {
    try {
      const now = getCurrentTimestamp();
      await this.db
        .prepare('DELETE FROM sessions WHERE userId = ? AND expiresAt < ?')
        .bind(userId, now)
        .run();
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }

  async refreshToken(oldToken: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      // Validate current token
      const user = await this.validateToken(oldToken);
      if (!user) {
        return { success: false, error: 'Invalid token' };
      }

      // Generate new token
      const newToken = generateToken();
      const expiresAt = getTokenExpiry(24);

      // Update session with new token
      await this.db
        .prepare('UPDATE sessions SET token = ?, expiresAt = ? WHERE token = ?')
        .bind(newToken, expiresAt, oldToken)
        .run();

      return { success: true, token: newToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: 'Failed to refresh token' };
    }
  }
}
