import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import CustomerDetails from './pages/CustomerDetails';
import Jobs from './pages/Jobs';
import AddJob from './pages/AddJob';
import JobDetails from './pages/JobDetails';
import Payments from './pages/Payments';
import ScanQR from './pages/ScanQR';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { useSampleData } from './hooks/useSampleData';

function App() {
  // Initialize sample data on first load
  useSampleData();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}>
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
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Legacy routes for backward compatibility */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/customers" element={<Layout />}>
          <Route index element={<Customers />} />
        </Route>
        <Route path="/customers/new" element={<AddCustomer />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />
        <Route path="/jobs" element={<Layout />}>
          <Route index element={<Jobs />} />
        </Route>
        <Route path="/jobs/new" element={<AddJob />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/payments" element={<Layout />}>
          <Route index element={<Payments />} />
        </Route>
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;