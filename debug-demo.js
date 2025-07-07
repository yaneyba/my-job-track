// Debug script to check demo data issues

console.log('=== Environment Variables ===');
console.log('VITE_USE_API_PROVIDER:', import.meta.env.VITE_USE_API_PROVIDER);
console.log('VITE_DEMO_EMAIL:', import.meta.env.VITE_DEMO_EMAIL);
console.log('VITE_DEMO_PASSWORD:', import.meta.env.VITE_DEMO_PASSWORD);

console.log('\n=== LocalStorage Data ===');
console.log('myJobTrack_users:', localStorage.getItem('myJobTrack_users'));
console.log('myJobTrack_currentUser:', localStorage.getItem('myJobTrack_currentUser'));

console.log('\n=== Clear localStorage to fix demo data ===');
console.log('To fix the issue, run: localStorage.clear() in browser console');
