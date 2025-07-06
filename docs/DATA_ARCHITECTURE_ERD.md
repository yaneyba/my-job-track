# MyJobTrack Data Architecture - Entity Relationship Diagram (ERD)

**Created:** July 6, 2025  
**Database:** Cloudflare D1 (SQLite)  
**Schema Version:** Production v1.0  

## 🏗️ Database Overview

MyJobTrack uses a **normalized relational database design** with four core entities optimized for service business management. The schema follows SQLite/D1 best practices with proper indexing and referential integrity.

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────┐
│             USERS               │
├─────────────────────────────────┤
│ id (TEXT) [PK]                 │
│ email (TEXT) [UNIQUE]          │
│ name (TEXT)                    │
│ business_name (TEXT)           │
│ password_hash (TEXT)           │
│ created_at (TEXT)              │
│ updated_at (TEXT)              │
└─────────────────┬───────────────┘
                  │
                  │ 1:N
                  │
         ┌────────▼────────┐               ┌─────────────────────────────────┐
         │                 │               │           SESSIONS              │
         │                 │               ├─────────────────────────────────┤
         ▼                 ▼               │ id (TEXT) [PK]                 │
┌─────────────────────────────────┐       │ user_id (TEXT) [FK→users.id]   │
│           CUSTOMERS             │       │ token (TEXT) [UNIQUE]          │
├─────────────────────────────────┤       │ expires_at (TEXT)              │
│ id (TEXT) [PK]                 │       │ created_at (TEXT)              │
│ user_id (TEXT) [FK→users.id]    │       └─────────────────────────────────┘
│ name (TEXT)                    │
│ email (TEXT)                   │                    ▲
│ phone (TEXT)                   │                    │
│ address (TEXT)                 │                    │ 1:N
│ business_name (TEXT)           │                    │
│ notes (TEXT)                   │       ┌────────────┘
│ created_at (TEXT)              │       │
│ updated_at (TEXT)              │       │
└─────────────────┬───────────────┘       │
                  │                       │
                  │ 1:N                   │
                  │              ┌────────┴────────┐
                  ▼              │                 │
┌─────────────────────────────────┐       │
│              JOBS               │       │
├─────────────────────────────────┤       │
│ id (TEXT) [PK]                 │       │
│ user_id (TEXT) [FK→users.id]    │◄──────┘
│ customer_id (TEXT) [FK→customers.id]│
│ title (TEXT)                   │
│ description (TEXT)             │
│ status (TEXT) ['pending'|'in_progress'|'completed'|'cancelled']
│ estimated_cost (REAL)          │
│ actual_cost (REAL)             │
│ estimated_hours (REAL)         │
│ actual_hours (REAL)            │
│ due_date (TEXT)                │
│ paid (BOOLEAN)                 │
│ completed_at (TEXT)            │
│ created_at (TEXT)              │
│ updated_at (TEXT)              │
└─────────────────────────────────┘
```

## 🔗 Relationship Details

### 1. Users ↔ Customers (One-to-Many)
- **Relationship:** One user can have many customers
- **Foreign Key:** `customers.user_id → users.id`
- **Cascade:** DELETE CASCADE (when user is deleted, all their customers are removed)
- **Business Logic:** Each service provider manages their own customer list

### 2. Users ↔ Jobs (One-to-Many)
- **Relationship:** One user can have many jobs
- **Foreign Key:** `jobs.user_id → users.id`
- **Cascade:** DELETE CASCADE (when user is deleted, all their jobs are removed)
- **Business Logic:** Each service provider owns their job records

### 3. Customers ↔ Jobs (One-to-Many)
- **Relationship:** One customer can have many jobs
- **Foreign Key:** `jobs.customer_id → customers.id`
- **Cascade:** DELETE CASCADE (when customer is deleted, all their jobs are removed)
- **Business Logic:** Track multiple jobs per customer over time

### 4. Users ↔ Sessions (One-to-Many)
- **Relationship:** One user can have multiple active sessions
- **Foreign Key:** `sessions.user_id → users.id`
- **Cascade:** DELETE CASCADE (when user is deleted, all their sessions are removed)
- **Business Logic:** Support multiple device logins with JWT tokens

## 📋 Table Specifications

### USERS Table
```sql
┌─────────────────┬──────────┬─────────────┬─────────────────────┐
│ Column          │ Type     │ Constraints │ Purpose             │
├─────────────────┼──────────┼─────────────┼─────────────────────┤
│ id              │ TEXT     │ PRIMARY KEY │ Unique identifier   │
│ email           │ TEXT     │ UNIQUE, NOT NULL │ Login credential    │
│ name            │ TEXT     │ NOT NULL    │ User's full name    │
│ business_name   │ TEXT     │ NULL        │ Optional business   │
│ password_hash   │ TEXT     │ NOT NULL    │ Hashed password     │
│ created_at      │ TEXT     │ NOT NULL    │ Registration time   │
│ updated_at      │ TEXT     │ NOT NULL    │ Last modification   │
└─────────────────┴──────────┴─────────────┴─────────────────────┘
```

### CUSTOMERS Table
```sql
┌─────────────────┬──────────┬─────────────┬─────────────────────┐
│ Column          │ Type     │ Constraints │ Purpose             │
├─────────────────┼──────────┼─────────────┼─────────────────────┤
│ id              │ TEXT     │ PRIMARY KEY │ Unique identifier   │
│ user_id         │ TEXT     │ FK, NOT NULL│ Owner reference     │
│ name            │ TEXT     │ NOT NULL    │ Customer name       │
│ email           │ TEXT     │ NULL        │ Contact email       │
│ phone           │ TEXT     │ NULL        │ Contact phone       │
│ address         │ TEXT     │ NULL        │ Service address     │
│ business_name   │ TEXT     │ NULL        │ Customer business   │
│ notes           │ TEXT     │ NULL        │ Additional info     │
│ created_at      │ TEXT     │ NOT NULL    │ Creation time       │
│ updated_at      │ TEXT     │ NOT NULL    │ Last modification   │
└─────────────────┴──────────┴─────────────┴─────────────────────┘
```

### JOBS Table
```sql
┌─────────────────┬──────────┬─────────────┬─────────────────────┐
│ Column          │ Type     │ Constraints │ Purpose             │
├─────────────────┼──────────┼─────────────┼─────────────────────┤
│ id              │ TEXT     │ PRIMARY KEY │ Unique identifier   │
│ user_id         │ TEXT     │ FK, NOT NULL│ Owner reference     │
│ customer_id     │ TEXT     │ FK, NOT NULL│ Customer reference  │
│ title           │ TEXT     │ NOT NULL    │ Job title/type      │
│ description     │ TEXT     │ NULL        │ Job details         │
│ status          │ TEXT     │ DEFAULT 'pending' │ Job status    │
│ estimated_cost  │ REAL     │ NULL        │ Quote amount        │
│ actual_cost     │ REAL     │ NULL        │ Final billing       │
│ estimated_hours │ REAL     │ NULL        │ Time estimate       │
│ actual_hours    │ REAL     │ NULL        │ Time spent          │
│ due_date        │ TEXT     │ NULL        │ Completion deadline │
│ paid            │ BOOLEAN  │ DEFAULT FALSE │ Payment status    │
│ completed_at    │ TEXT     │ NULL        │ Completion time     │
│ created_at      │ TEXT     │ NOT NULL    │ Creation time       │
│ updated_at      │ TEXT     │ NOT NULL    │ Last modification   │
└─────────────────┴──────────┴─────────────┴─────────────────────┘
```

### SESSIONS Table
```sql
┌─────────────────┬──────────┬─────────────┬─────────────────────┐
│ Column          │ Type     │ Constraints │ Purpose             │
├─────────────────┼──────────┼─────────────┼─────────────────────┤
│ id              │ TEXT     │ PRIMARY KEY │ Session identifier  │
│ user_id         │ TEXT     │ FK, NOT NULL│ User reference      │
│ token           │ TEXT     │ UNIQUE, NOT NULL │ JWT token      │
│ expires_at      │ TEXT     │ NOT NULL    │ Token expiration    │
│ created_at      │ TEXT     │ NOT NULL    │ Login time          │
└─────────────────┴──────────┴─────────────┴─────────────────────┘
```

## ⚡ Performance Optimizations

### Indexes
```sql
-- Customer lookups by user
CREATE INDEX idx_customers_user_id ON customers(user_id);

-- Job lookups by user and customer
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);

-- Job filtering by status and date
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_due_date ON jobs(due_date);

-- Session authentication
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
```

### Triggers
```sql
-- Automatic timestamp updates
- update_users_updated_at
- update_customers_updated_at  
- update_jobs_updated_at
```

## 📊 Data Flow Patterns

### 1. User Registration & Authentication
```
1. User Registration → users table
2. Session Creation → sessions table  
3. Token-based Authentication → session validation
```

### 2. Customer Management
```
1. Add Customer → customers table (linked to user_id)
2. Update Customer → trigger updates updated_at
3. Delete Customer → CASCADE deletes all customer jobs
```

### 3. Job Lifecycle
```
1. Create Job → jobs table (linked to user_id + customer_id)
2. Update Status → 'pending' → 'in_progress' → 'completed'
3. Payment Tracking → paid boolean flag
4. Completion → completed_at timestamp
```

### 4. Business Intelligence Queries
```sql
-- Dashboard stats
SELECT COUNT(*), status FROM jobs WHERE user_id = ? GROUP BY status;

-- Revenue tracking  
SELECT SUM(actual_cost) FROM jobs WHERE user_id = ? AND paid = true;

-- Customer job history
SELECT * FROM jobs WHERE customer_id = ? ORDER BY created_at DESC;
```

## 🔒 Security Considerations

### Data Isolation
- **Row-level Security:** All tables include `user_id` for multi-tenant isolation
- **Cascade Deletes:** Proper cleanup when users/customers are removed
- **Foreign Key Constraints:** Data integrity enforcement

### Authentication Security
- **Password Storage:** SHA-256 hashed passwords (never stored plain text)
- **Session Management:** JWT tokens with configurable expiration
- **Token Uniqueness:** Unique constraints prevent token collision

### API Security
- **Authorization Checks:** All endpoints verify user ownership
- **Input Validation:** Parameterized queries prevent SQL injection
- **Rate Limiting:** Cloudflare Worker built-in protection

## 🎯 Business Logic Rules

### Job Status Workflow
```
pending → in_progress → completed
    ↓           ↓            ↓
 cancelled   cancelled   (final)
```

### Payment Tracking
- Jobs can be marked as `paid` regardless of status
- Revenue calculations only include `paid = true` jobs
- Cost tracking supports both estimates and actuals

### Customer Relationships
- Customers belong to specific users (no sharing)
- Customer deletion removes all associated jobs
- Customer data includes optional business information

## 📈 Scalability Design

### Current Limitations
- **Single Database:** All data in one D1 instance
- **Text-based IDs:** UUIDs for global uniqueness
- **DateTime Storage:** ISO string format for consistency

### Growth Considerations
- **Cloudflare D1:** Automatically scales with Cloudflare network
- **Index Strategy:** Optimized for common query patterns
- **Data Archival:** No current archival strategy (future enhancement)

## 🔄 Migration & Backup

### Schema Versioning
- **Current Version:** v1.0 (Production)
- **Migration Scripts:** Available in `/schema-updated.sql`
- **Backward Compatibility:** No breaking changes planned

### Backup Strategy
- **Cloudflare D1:** Automatic backups managed by platform
- **Data Export:** API endpoints support data export
- **Local Development:** Wrangler CLI for local schema management

---

**ERD Created:** July 6, 2025  
**Database Platform:** Cloudflare D1 (SQLite)  
**Schema Status:** ✅ Production Ready
