// Theme Debug and Reset Script
// Run this in the browser console to debug theme issues

console.log('=== MyJobTrack Theme Debug ===');

// Check current theme state
const currentTheme = localStorage.getItem('myjobtrack_theme');
console.log('Stored theme:', currentTheme);

// Check if dark class is applied
const hasDarkClass = document.documentElement.classList.contains('dark');
console.log('Document has dark class:', hasDarkClass);

// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log('System prefers dark mode:', prefersDark);

// Check for theme-related CSS
const computedStyle = getComputedStyle(document.documentElement);
console.log('Background color:', computedStyle.backgroundColor);

// Reset theme function
function resetTheme() {
  console.log('Resetting theme...');
  localStorage.removeItem('myjobtrack_theme');
  document.documentElement.classList.remove('dark');
  location.reload();
}

// Force dark mode function
function forceDarkMode() {
  console.log('Forcing dark mode...');
  localStorage.setItem('myjobtrack_theme', 'dark');
  document.documentElement.classList.add('dark');
  location.reload();
}

// Force light mode function
function forceLightMode() {
  console.log('Forcing light mode...');
  localStorage.setItem('myjobtrack_theme', 'light');
  document.documentElement.classList.remove('dark');
  location.reload();
}

console.log('Available functions:');
console.log('- resetTheme() - Clear theme and reload');
console.log('- forceDarkMode() - Force dark mode');
console.log('- forceLightMode() - Force light mode');

// Make functions available globally
window.resetTheme = resetTheme;
window.forceDarkMode = forceDarkMode;
window.forceLightMode = forceLightMode;
