# Waitlist Testing System

## Overview

The waitlist testing system allows users to sign up for early access and immediately test the Job Track app with full functionality, except for QR scanning. All data is stored locally in the browser's localStorage.

## Features

### For Users:
- **Instant Access**: Sign up for the waitlist and immediately start testing
- **Full Functionality**: Access all app features except QR scanning
- **Local Data Storage**: All test data persists in the browser
- **Sample Data**: Starts with sample customers and jobs for immediate testing
- **Mock QR Codes**: Generate and view QR codes (scanning disabled)

### For Developers:
- **Easy Integration**: Simple components and data provider
- **Type Safety**: Full TypeScript support
- **Clean Architecture**: Separate data provider for local storage
- **Analytics Ready**: Hooks for tracking waitlist signups

## Implementation

### Core Components

1. **LocalStorageDataProvider**: Handles all CRUD operations with localStorage
2. **WaitlistSignup**: React component for capturing signups
3. **WaitlistTestBanner**: Banner showing test mode status
4. **DataProviderFactory**: Updated to detect and route waitlisted users

### Key Files

- `src/data/providers/LocalStorageDataProvider.ts` - Main data provider
- `src/components/Landing/WaitlistSignup.tsx` - Signup form
- `src/components/UI/WaitlistTestBanner.tsx` - Test mode banner
- `src/data/providers/DataProviderFactory.ts` - Provider factory (updated)
- `src/contexts/AuthContext.tsx` - Authentication context (updated)

## Usage

### For Waitlisted Users

1. **Signup**: Visit the landing page and click "Join Waitlist & Test Now"
2. **Enter Details**: Provide email and optional business type
3. **Start Testing**: Click "Test the App Now" to enter the app
4. **Full Access**: Use all features except QR scanning
5. **Data Persistence**: Data is saved locally and persists across sessions

### For Developers

#### Detecting Waitlisted Users

```typescript
import { LocalStorageDataProvider } from '@/data/providers/LocalStorageDataProvider';

// Check if email is waitlisted
const isWaitlisted = LocalStorageDataProvider.isWaitlistedUser('user@example.com');

// Check current user
const { user } = useAuth();
const isTestMode = user?.isWaitlisted === true;
```

#### Adding Waitlist Integration

```tsx
import WaitlistSignup from '@/components/Landing/WaitlistSignup';

function YourComponent() {
  const handleSuccess = (email: string) => {
    console.log('User joined waitlist:', email);
    // Add tracking/analytics
  };

  return (
    <WaitlistSignup 
      onSuccess={handleSuccess}
      onError={(error) => console.error(error)}
    />
  );
}
```

## Storage Structure

### localStorage Keys

- `jobtrack_waitlist_customers` - Customer data
- `jobtrack_waitlist_jobs` - Job data  
- `jobtrack_waitlist_user` - Current user session
- `jobtrack_waitlist_emails` - List of waitlisted emails

### Data Format

```typescript
// Waitlisted user session
{
  id: 'waitlist-user',
  email: 'user@example.com',
  name: 'Test User',
  businessName: 'Test Business',
  createdAt: '2025-01-01T00:00:00.000Z',
  isWaitlisted: true
}
```

## Features & Limitations

### ✅ Available in Test Mode

- Create, read, update, delete customers
- Schedule and manage jobs
- View dashboard statistics
- Generate QR codes (mock)
- Export/import data
- All UI features
- Dark/light theme
- Responsive design

### ❌ Disabled in Test Mode

- QR code scanning (camera access)
- Cloud synchronization
- Real-time collaboration
- Push notifications
- Cross-device access

## Migration Path

When users upgrade to the full version:

1. **Data Export**: Use the export feature to download test data
2. **Account Creation**: Create a full account
3. **Data Import**: Import the exported data
4. **Full Features**: Access all features including QR scanning

## Technical Notes

### Performance
- localStorage has ~5-10MB limit (varies by browser)
- Data is stored as JSON strings
- Automatic cleanup on logout
- Storage size tracking available

### Browser Compatibility
- Requires localStorage support (IE8+)
- Modern browsers recommended for best experience
- Graceful degradation for older browsers

### Security
- No sensitive data stored
- Local-only storage (no network transmission)
- Auto-cleanup on storage errors
- Session expiration after 30 days

## Analytics Integration

Track waitlist signups and usage:

```typescript
// In WaitlistSignup component
const handleSuccess = (email: string) => {
  // Your analytics tracking
  analytics.track('waitlist_signup', {
    email,
    timestamp: Date.now(),
    source: 'landing_page'
  });
};

// Track test mode usage
const handleTestStart = () => {
  analytics.track('test_mode_started', {
    userType: 'waitlisted'
  });
};
```

## Troubleshooting

### Common Issues

1. **Data Not Persisting**
   - Check browser's localStorage settings
   - Ensure cookies/storage allowed
   - Check for incognito/private mode

2. **Storage Full**
   - Monitor storage usage
   - Implement data cleanup
   - Guide users to export data

3. **Session Expired**
   - Sessions expire after 30 days
   - Users need to sign up again
   - Consider extending session length

### Debugging

```typescript
// Check storage usage
const storageSize = LocalStorageDataProvider.getWaitlistStorageSize();
console.log('Storage used:', storageSize);

// Verify user is waitlisted
const isWaitlisted = LocalStorageDataProvider.isWaitlistedUser(email);
console.log('User waitlisted:', isWaitlisted);

// Check data provider mode
const isWaitlistMode = DataProviderFactory.isWaitlistMode();
console.log('Waitlist mode active:', isWaitlistMode);
```
