// Clear demo analytics data from localStorage
// This script can be run in the browser console to clear demo analytics

console.log('🧹 Clearing demo analytics data...');

// Clear demo analytics events
localStorage.removeItem('demo_analytics_events');
console.log('✅ Cleared demo_analytics_events');

// Clear demo analytics session
localStorage.removeItem('demo_analytics_session');
console.log('✅ Cleared demo_analytics_session');

// Clear any other analytics-related localStorage items
const keys = Object.keys(localStorage);
const analyticsKeys = keys.filter(key => key.includes('analytics') || key.includes('demo'));

analyticsKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Cleared ${key}`);
});

console.log('🎉 Demo analytics data cleared successfully!');
console.log('📊 Fresh analytics tracking will start on next page load.');
