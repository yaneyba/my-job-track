import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Customer } from '../types';
import { DataProviderFactory } from '../data/DataProviderFactory';
import SearchBar from '../components/UI/SearchBar';
import CustomerCard from '../components/Customer/CustomerCard';
import QuickActionButton from '../components/UI/QuickActionButton';
import QRCodeDisplay from '../components/QR/QRCodeDisplay';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import { Plus, Users, CheckCircle, X } from 'lucide-react';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedQRCustomer, setSelectedQRCustomer] = useState<Customer | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const dataProvider = DataProviderFactory.getInstance();

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Customers', current: true }
  ];

  useEffect(() => {
    loadCustomers();
    
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after showing it
      window.history.replaceState({}, document.title);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [location.state]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = dataProvider.searchCustomers(searchQuery);
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers, dataProvider]);

  const loadCustomers = () => {
    setLoading(true);
    try {
      const customerData = dataProvider.getCustomers();
      setCustomers(customerData);
      setFilteredCustomers(customerData);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">
            {customers.length} customer{customers.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <QuickActionButton
          icon={Plus}
          label="Add Customer"
          onClick={() => navigate('/app/customers/new')}
          size="sm"
        />
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search customers by name, phone, or address..."
        className="mb-6"
      />

      {/* Customer List */}
      {filteredCustomers.length > 0 ? (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onClick={() => navigate(`/app/customers/${customer.id}`)}
              onQRCodeClick={() => setSelectedQRCustomer(customer)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'No customers found matching your search' : 'No customers yet'}
          </p>
          {!searchQuery && (
            <QuickActionButton
              icon={Plus}
              label="Add Your First Customer"
              onClick={() => navigate('/app/customers/new')}
              variant="primary"
            />
          )}
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQRCustomer && (
        <QRCodeDisplay
          type="customer"
          id={selectedQRCustomer.id}
          title={selectedQRCustomer.name}
          subtitle={`${selectedQRCustomer.serviceType} • ${selectedQRCustomer.phone}`}
          onClose={() => setSelectedQRCustomer(null)}
        />
      )}
    </div>
  );
};

export default Customers;