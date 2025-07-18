import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AnalyticsProvider from '@/contexts/AnalyticsContext';
import { useDemo } from '@/contexts/DemoContext';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Layout from '@/components/Layout/Layout';
import WaitlistModal from '@/components/UI/WaitlistModal';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import AddCustomer from '@/pages/AddCustomer';
import CustomerDetails from '@/pages/CustomerDetails';
import Jobs from '@/pages/Jobs';
import AddJob from '@/pages/AddJob';
import JobDetails from '@/pages/JobDetails';
import Payments from '@/pages/Payments';
import ScanQR from '@/pages/ScanQR';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import QRDemo from '@/pages/QRDemo';
import { useSampleData } from '@/hooks/useSampleData';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AnalyticsProvider>
              <AppContent />
            </AnalyticsProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

function AppContent() {
  // Initialize sample data on first load
  useSampleData();
  const { isDemoMode, showWaitlistModal, setShowWaitlistModal } = useDemo();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {/* Only show signup route when not in Demo mode */}
        {!isDemoMode && <Route path="/signup" element={<Signup />} />}
        
        {/* Protected Routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<AddCustomer />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/new" element={<AddJob />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="payments" element={<Payments />} />
          <Route path="scan" element={<ScanQR />} />
          <Route path="settings" element={<Settings />} />
          <Route path="qr-demo" element={<QRDemo />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Legacy routes for backward compatibility - also protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/customers" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Customers />} />
        </Route>
        <Route path="/customers/new" element={
          <ProtectedRoute>
            <AddCustomer />
          </ProtectedRoute>
        } />
        <Route path="/customers/:id" element={
          <ProtectedRoute>
            <CustomerDetails />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Jobs />} />
        </Route>
        <Route path="/jobs/new" element={
          <ProtectedRoute>
            <AddJob />
          </ProtectedRoute>
        } />
        <Route path="/jobs/:id" element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Payments />} />
        </Route>
        <Route path="/scan" element={
          <ProtectedRoute>
            <ScanQR />
            </ProtectedRoute>
          } />
        <Route path="/qr-demo" element={
            <ProtectedRoute>
              <QRDemo />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
      
      {/* Waitlist Modal for Demo Mode */}
      <WaitlistModal 
        isOpen={showWaitlistModal} 
        onClose={() => setShowWaitlistModal(false)} 
      />
    </div>
  );
}

export default App;