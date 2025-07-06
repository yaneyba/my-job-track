# Database

This folder contains all database-related files for the MyJobTrack application.

## Structure

### `/database/`
- `schema.sql` - Original database schema
- `schema-updated.sql` - Updated schema with user data isolation

### `/database/migrations/`
- `001_fix_data_isolation.sql` - Migration to add user_id columns for data isolation

### `/database/scripts/`
- `reset-database.sh` - Script to reset and recreate the database

## Usage

### Initialize Database
```bash
# Run the latest schema
wrangler d1 execute myjobtrack-db --file=database/schema-updated.sql

# Or reset and recreate
cd database/scripts
./reset-database.sh
```

### Apply Migrations
```bash
# Apply data isolation migration
wrangler d1 execute myjobtrack-db --file=database/migrations/001_fix_data_isolation.sql
```

## Database Configuration

The database is configured in `wrangler.toml`:
- Database Name: `myjobtrack-db`
- Database ID: `d729dbcd-e5de-4073-9bcb-7d9f1544729d`
