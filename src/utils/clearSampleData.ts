// Quick fix script to clear sample data and force API usage
// Add this to the AuthContext or run in browser console

export const clearSampleData = () => {
  // Clear all localStorage data related to the app
  localStorage.removeItem('myjobtrack_customers');
  localStorage.removeItem('myjobtrack_jobs');
  
  console.log('Sample data cleared. App will now use API data.');
};

// Auto-clear on app startup to fix data isolation
if (typeof window !== 'undefined') {
  // Clear sample data on page load
  clearSampleData();
}
