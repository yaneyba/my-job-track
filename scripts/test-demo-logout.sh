#!/bin/bash

# Test script to verify demo mode logout functionality
# This script checks that logging out from demo mode doesn't throw errors

echo "🧪 Testing Demo Mode Logout Functionality"
echo "=========================================="

# Check if environment is set up correctly
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    exit 1
fi

# Check if VITE_DEMO_MODE is set to true
if ! grep -q "VITE_DEMO_MODE=true" .env; then
    echo "❌ VITE_DEMO_MODE is not set to 'true' in .env"
    exit 1
fi

echo "✅ Demo mode is enabled in environment"

# Start the development server in the background
echo "🚀 Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 5

# Check if server is running
if ! curl -s "http://localhost:5173" > /dev/null; then
    echo "❌ Development server failed to start"
    kill $DEV_PID 2>/dev/null
    exit 1
fi

echo "✅ Development server is running"

# Test instructions
echo ""
echo "🔍 MANUAL TEST INSTRUCTIONS:"
echo "================================"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Click 'Try Demo Mode' to enter demo mode"
echo "3. Use the demo credentials:"
echo "   - Email: demo@myjobtrack.app"
echo "   - Password: DemoUser2025!"
echo "4. Once logged in, try logging out"
echo "5. Check the browser console for any errors"
echo ""
echo "✅ Expected behavior:"
echo "   - No 'Failed to refresh cache' errors in console"
echo "   - Clean logout without exceptions"
echo "   - Smooth transition back to landing page"
echo ""
echo "❌ If you see 'Failed to refresh cache' errors, the fix needs adjustment"
echo ""
echo "Press Ctrl+C to stop the development server when done testing"

# Wait for user to stop the server
trap "kill $DEV_PID 2>/dev/null; echo '🛑 Development server stopped'; exit 0" INT
wait $DEV_PID
