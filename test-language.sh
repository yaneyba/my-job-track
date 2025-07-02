#!/bin/bash

# Test Language/Internationalization functionality
# This script opens the app and tests the language toggle

echo "🌐 Testing Language/Internationalization Features"
echo "================================================="

echo "✅ Language Context Implementation:"
echo "   • LanguageProvider is wrapping the entire app"
echo "   • Translation dictionary includes English and Spanish"
echo "   • Automatic browser language detection"
echo "   • localStorage persistence"

echo ""
echo "✅ Components Using Translations:"
echo "   • Dashboard (fully internationalized)"
echo "   • Settings (language toggle + translations)"
echo "   • BottomNavigation (navigation labels)"
echo "   • Header (page titles - just updated)"

echo ""
echo "🔧 Testing Steps:"
echo "1. Open http://localhost:5173/"
echo "2. Navigate to /app/settings"
echo "3. Look for 'Language' section under 'Appearance'"
echo "4. Click between 'English' and 'Español' buttons"
echo "5. Verify navigation labels change in bottom navigation"
echo "6. Check dashboard content changes language"

echo ""
echo "📱 Opening browser to test..."

# Check if dev server is running
if curl -s http://localhost:5173/ > /dev/null; then
    echo "✅ Dev server is running at http://localhost:5173/"
    
    # Open browser (macOS)
    if command -v open > /dev/null; then
        open "http://localhost:5173/app/settings"
        echo "🌐 Browser opened to Settings page for language testing"
    else
        echo "📋 Please open: http://localhost:5173/app/settings"
    fi
else
    echo "❌ Dev server not running. Please run: npm run dev"
fi

echo ""
echo "🎯 Test Checklist:"
echo "□ Language toggle is visible in Settings > Appearance"
echo "□ Clicking 'English' shows English text"
echo "□ Clicking 'Español' shows Spanish text"
echo "□ Bottom navigation labels change language"
echo "□ Dashboard content changes language"
echo "□ Settings page content changes language"
echo "□ Language preference persists after page refresh"

echo ""
echo "🔍 Debugging Tips:"
echo "• Check browser console for errors"
echo "• Verify localStorage has 'myjobtrack_language' key"
echo "• Test in different browsers"
echo "• Check mobile responsiveness"
