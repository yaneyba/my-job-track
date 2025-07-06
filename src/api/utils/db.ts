// Database utility functions

export function generateId(): string {
  return crypto.randomUUID();
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return crypto.subtle.digest('SHA-256', data).then(buffer => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function getTokenExpiry(hours: number = 24): string {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry.toISOString();
}

export function isTokenExpired(expiryDate: string): boolean {
  return new Date(expiryDate) < new Date();
}

// SQL helper functions
export function buildWhereClause(conditions: Record<string, any>): { where: string; values: any[] } {
  const keys = Object.keys(conditions).filter(key => conditions[key] !== undefined);
  if (keys.length === 0) {
    return { where: '', values: [] };
  }

  const where = 'WHERE ' + keys.map(key => `${key} = ?`).join(' AND ');
  const values = keys.map(key => conditions[key]);
  
  return { where, values };
}

export function buildUpdateClause(data: Record<string, any>): { set: string; values: any[] } {
  const keys = Object.keys(data).filter(key => data[key] !== undefined);
  if (keys.length === 0) {
    throw new Error('No data to update');
  }

  const set = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => data[key]);
  
  return { set, values };
}

// D1 Database utility functions
export async function executeQuery(db: any, query: string, params: any[] = []): Promise<any> {
  try {
    const stmt = db.prepare(query);
    if (params.length > 0) {
      return await stmt.bind(...params).all();
    }
    return await stmt.all();
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getFirstRow(db: any, query: string, params: any[] = []): Promise<any> {
  try {
    const stmt = db.prepare(query);
    if (params.length > 0) {
      return await stmt.bind(...params).first();
    }
    return await stmt.first();
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function executeNonQuery(db: any, query: string, params: any[] = []): Promise<any> {
  try {
    const stmt = db.prepare(query);
    if (params.length > 0) {
      return await stmt.bind(...params).run();
    }
    return await stmt.run();
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
