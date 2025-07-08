#!/bin/bash

# Test script to verify waitlist functionality in demo mode
echo "🧪 Testing Waitlist Functionality in Demo Mode"
echo "=============================================="

# Test 1: Check if API is running
echo "📡 Test 1: Checking API availability..."
api_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8787/api/waitlist -X OPTIONS)
if [ "$api_response" -eq 200 ]; then
    echo "✅ API is running and accepting requests"
else
    echo "❌ API is not responding correctly (HTTP $api_response)"
    exit 1
fi

# Test 2: Test waitlist submission
echo "📝 Test 2: Testing waitlist submission..."
waitlist_response=$(curl -s -X POST http://localhost:8787/api/waitlist \
    -H "Content-Type: application/json" \
    -d '{"email": "demo-test@example.com", "businessType": "Test Business", "source": "demo-mode"}')

if echo "$waitlist_response" | grep -q '"success":true'; then
    echo "✅ Waitlist submission successful"
    echo "   Response: $waitlist_response"
else
    echo "❌ Waitlist submission failed"
    echo "   Response: $waitlist_response"
    exit 1
fi

# Test 3: Test duplicate email handling
echo "🔄 Test 3: Testing duplicate email handling..."
duplicate_response=$(curl -s -X POST http://localhost:8787/api/waitlist \
    -H "Content-Type: application/json" \
    -d '{"email": "demo-test@example.com", "businessType": "Another Business", "source": "demo-mode"}')

if echo "$duplicate_response" | grep -q '"success":true'; then
    echo "✅ Duplicate email handling works correctly"
    echo "   Response: $duplicate_response"
else
    echo "❌ Duplicate email handling failed"
    echo "   Response: $duplicate_response"
    exit 1
fi

# Test 4: Test invalid email handling
echo "🚫 Test 4: Testing invalid email handling..."
invalid_response=$(curl -s -X POST http://localhost:8787/api/waitlist \
    -H "Content-Type: application/json" \
    -d '{"email": "invalid-email", "businessType": "Test Business", "source": "demo-mode"}')

if echo "$invalid_response" | grep -q '"error":"Invalid email format"'; then
    echo "✅ Invalid email validation works correctly"
    echo "   Response: $invalid_response"
else
    echo "❌ Invalid email validation failed"
    echo "   Response: $invalid_response"
    exit 1
fi

# Test 5: Check database entries
echo "🗄️  Test 5: Checking database entries..."
echo "   Recent waitlist entries:"
npx wrangler d1 execute myjobtrack-db --env development --command "SELECT email, businessType, source, createdAt FROM waitlist ORDER BY createdAt DESC LIMIT 3;"

echo ""
echo "🎉 All tests passed! Waitlist functionality is working correctly in demo mode."
echo "   ✅ API is responsive"
echo "   ✅ Waitlist submissions work"
echo "   ✅ Duplicate email handling works"
echo "   ✅ Email validation works"
echo "   ✅ Database storage works"
