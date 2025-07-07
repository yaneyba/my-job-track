#!/bin/bash

# Script to verify API mode and demo mode configuration

echo "🔍 Verifying MyJobTrack Configuration..."
echo

echo "📋 Environment Variables:"
echo "VITE_USE_API_PROVIDER: $VITE_USE_API_PROVIDER"
echo "VITE_DEMO_EMAIL: $VITE_DEMO_EMAIL"
echo "VITE_DEMO_PASSWORD: $VITE_DEMO_PASSWORD"
echo "VITE_API_URL: $VITE_API_URL"
echo

echo "🗄️ Database Demo User Check:"
echo "Checking if demo user exists in database..."
npx wrangler d1 execute myjobtrack-db --command="SELECT email, name FROM users WHERE email = 'demo@myjobtrack.app';" --remote

echo
echo "🌐 API Endpoint Check:"
echo "Testing API connectivity..."
curl -s -o /dev/null -w "%{http_code}" "$VITE_API_URL/health" && echo " - API endpoint reachable" || echo " - API endpoint not reachable"

echo
echo "🎯 Current Mode:"
if [ "$VITE_USE_API_PROVIDER" = "true" ]; then
    echo "✅ API MODE - Using database for authentication and data"
    echo "   - Demo user: Database authentication"
    echo "   - Customer/Job data: API endpoints"
else
    echo "🎭 DEMO MODE - Using demo data provider"
    echo "   - Demo user: DemoDataProvider authentication"
    echo "   - Customer/Job data: demo.json file"
fi

echo
echo "✅ Next Steps:"
echo "1. Clear browser localStorage: localStorage.clear()"
echo "2. Refresh the application"
echo "3. Try logging in with demo@myjobtrack.app / DemoUser2025!"
echo
echo "🔄 To switch modes:"
echo "- API Mode: Set VITE_USE_API_PROVIDER=true"
echo "- Demo Mode: Set VITE_USE_API_PROVIDER=false"
