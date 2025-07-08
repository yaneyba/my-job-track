#!/bin/bash

# Script to test the Slack integration with the waitlist

echo "🧪 Testing Slack integration with waitlist..."

# Test the waitlist endpoint with a test email
echo "📧 Testing waitlist submission with Slack notification..."

# Use curl to test the waitlist endpoint
curl -X POST https://myjobtrack.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-slack@example.com",
    "businessType": "Construction",
    "source": "Slack Integration Test"
  }' \
  -v

echo ""
echo "✅ Test completed!"
echo "🔍 Check your Slack channel for the notification"
echo "📝 Check the logs for any errors"

# Alternative: Test with local development
echo ""
echo "🛠️ To test with local development:"
echo "1. Run: wrangler dev"
echo "2. In another terminal, run:"
echo "   curl -X POST http://localhost:8787/api/waitlist \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\": \"test-local@example.com\", \"businessType\": \"Testing\", \"source\": \"Local Dev\"}'"
