# MyJobTrack Data Architecture - Clean Separation

## 🎯 **Architecture Overview**

We now have a **clean separation** between demo data and production data:

### **Production Database (API Mode)**
- **Purpose**: Real user data and production operations
- **Users**: Real users only (NO demo users)
- **Authentication**: Database-based via API
- **Data Operations**: Full CRUD operations
- **Mode**: `VITE_USE_API_PROVIDER=true`

### **Demo Mode (Static Data)**
- **Purpose**: Demonstrations, testing, offline use
- **Users**: Demo user from `demoUserTemplate` + environment variables
- **Authentication**: DemoDataProvider.authenticateUser()
- **Data Operations**: Read-only (writes disabled)
- **Mode**: `VITE_USE_API_PROVIDER=false`

## 🔧 **Implementation Details**

### **Database State**
```sql
-- Clean database with real users only
SELECT email, name FROM users;
-- Results: Only real users (test@example.com, etc.)
-- NO demo@myjobtrack.app
```

### **Demo User Creation**
```typescript
// Demo user created from:
// 1. demoUserTemplate (demo.json)
// 2. Environment variables (VITE_DEMO_EMAIL, VITE_DEMO_PASSWORD)
const demoUser = createDemoUser();
```

### **Data Provider Selection**
```typescript
// DataProviderFactory.ts
if (this.isDemoMode || import.meta.env.VITE_USE_API_PROVIDER !== 'true') {
  this.instance = new DemoDataProvider(); // Demo mode
} else {
  this.instance = new ApiDataProvider();  // Production mode
}
```

## 🎭 **Demo Mode Features**

### **Authentication**
- ✅ `DemoDataProvider.authenticateUser(email, password)`
- ✅ Validates against environment variables
- ✅ Returns demo user object on success
- ❌ No database interaction

### **Data Operations**
- ✅ **Read**: Customers, jobs, stats from demo.json
- ✅ **Search**: Filter demo data
- ✅ **QR Codes**: Generate QR codes for demo data
- ❌ **Write**: All disabled (throws errors)

### **Demo Data Sources**
- **demoUserTemplate**: Base user information
- **customers**: Static demo customers
- **jobs**: Static demo jobs  
- **notifications**: Static demo notifications
- **dashboardStats**: Static demo statistics

## 🚀 **Production Mode Features**

### **Authentication**
- ✅ Database authentication via API
- ✅ Real user accounts
- ✅ Session management
- ❌ No demo users in database

### **Data Operations**
- ✅ **Full CRUD**: All operations enabled
- ✅ **Real-time**: Live data from database
- ✅ **User isolation**: Each user sees only their data
- ✅ **Persistence**: Data saved to database

## 🔄 **Mode Switching**

### **To Demo Mode**
```bash
# Set environment variable
VITE_USE_API_PROVIDER=false

# Clear browser storage
localStorage.clear()

# Login with demo credentials
Email: demo@myjobtrack.app
Password: DemoUser2025!
```

### **To API Mode**
```bash
# Set environment variable  
VITE_USE_API_PROVIDER=true

# Clear browser storage
localStorage.clear()

# Login with real user credentials
Email: test@example.com
Password: [real password]
```

## ✅ **Benefits of Clean Separation**

1. **🔒 Security**: No demo data in production database
2. **🧪 Testing**: Reliable demo environment for presentations
3. **🚀 Performance**: No demo users cluttering production
4. **🔧 Maintenance**: Clear separation of concerns
5. **📊 Data Integrity**: Production data remains clean
6. **🎯 Flexibility**: Easy switching between modes

## 🛠️ **Development Guidelines**

### **Demo Mode**
- Use for presentations, testing, offline demos
- All write operations should be disabled
- Data comes from static demo.json file
- Authentication via DemoDataProvider

### **API Mode**
- Use for production, development with backend
- Full CRUD operations enabled
- Data comes from database via API
- Authentication via database

### **Environment Management**
- **VITE_USE_API_PROVIDER**: Controls mode selection
- **VITE_DEMO_EMAIL/PASSWORD**: Demo credentials
- **VITE_API_URL**: Production API endpoint

This architecture ensures a clean, maintainable separation between demo and production environments.
