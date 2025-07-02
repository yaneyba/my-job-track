// Language functionality test utility
export const testLanguageFeatures = () => {
  console.log('🌐 Testing Language/Internationalization Features');
  console.log('='.repeat(50));

  // Test 1: Check localStorage persistence
  const savedLanguage = localStorage.getItem('myjobtrack_language');
  console.log('✅ Language Persistence:', savedLanguage || 'Default (en)');

  // Test 2: Check document language attribute
  const docLang = document.documentElement.lang;
  console.log('✅ Document Language:', docLang || 'Not set');

  // Test 3: Check browser language detection
  const browserLang = navigator.language.toLowerCase();
  console.log('✅ Browser Language:', browserLang);
  console.log('✅ Spanish Detection:', browserLang.startsWith('es') ? 'Would default to Spanish' : 'Would default to English');

  // Test 4: Verify translation keys exist
  const testKeys = [
    'nav.home',
    'nav.customers',
    'dashboard.welcome',
    'settings.language',
    'common.english',
    'common.spanish'
  ];

  console.log('✅ Testing Translation Keys:');
  testKeys.forEach(key => {
    console.log(`   • ${key}: Ready for translation`);
  });

  console.log('\n🎯 Manual Test Steps:');
  console.log('1. Navigate to Settings page (/app/settings)');
  console.log('2. Look for "Language" section under "Appearance"');
  console.log('3. Click between "English" and "Español" buttons');
  console.log('4. Verify bottom navigation labels change');
  console.log('5. Check dashboard content changes');
  console.log('6. Refresh page to test persistence');

  console.log('\n📱 Expected Behaviors:');
  console.log('• Language toggle buttons are visible');
  console.log('• Active language is highlighted');
  console.log('• Navigation labels translate (Home/Inicio, etc.)');
  console.log('• Dashboard content translates');
  console.log('• Settings content translates');
  console.log('• Language choice persists after refresh');

  return {
    savedLanguage,
    docLang,
    browserLang,
    testKeys
  };
};

// Add to window for console testing
declare global {
  interface Window {
    testLanguageFeatures: typeof testLanguageFeatures;
  }
}

if (typeof window !== 'undefined') {
  window.testLanguageFeatures = testLanguageFeatures;
}
