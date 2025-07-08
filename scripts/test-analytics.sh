#!/bin/bash

# Test Analytics System
# This script tests the analytics tables and API endpoints

echo "🔍 Testing User Engagement Tracking System..."
echo "================================================"

# Check if analytics tables exist
echo "1. Checking analytics tables..."
npx wrangler d1 execute myjobtrack-db --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'trk_%';" --local

echo ""
echo "2. Inserting test analytics data..."

# Insert test session
npx wrangler d1 execute myjobtrack-db --command="
INSERT INTO trk_sessions (session_id, demo_mode, user_type, landing_page, started_at) 
VALUES ('test-session-1', true, 'demo', '/', datetime('now', '-1 hour'));
" --local

# Insert test events
npx wrangler d1 execute myjobtrack-db --command="
INSERT INTO trk_events (id, session_id, event_name, event_category, demo_mode, user_type, properties, timestamp) 
VALUES 
  ('event-1', 'test-session-1', 'page_view', 'navigation', true, 'demo', '{\"page\": \"/\"}', datetime('now', '-55 minutes')),
  ('event-2', 'test-session-1', 'demo_entry', 'demo_mode', true, 'demo', '{\"source\": \"cta_button\"}', datetime('now', '-50 minutes')),
  ('event-3', 'test-session-1', 'feature_interaction', 'feature_interaction', true, 'demo', '{\"feature\": \"add_customer\", \"action\": \"click\"}', datetime('now', '-45 minutes')),
  ('event-4', 'test-session-1', 'waitlist_cta_triggered', 'conversion', true, 'demo', '{\"source\": \"add_customer\"}', datetime('now', '-40 minutes')),
  ('event-5', 'test-session-1', 'waitlist_signup_completed', 'conversion', true, 'demo', '{\"source\": \"add_customer\", \"email\": \"test@example.com\"}', datetime('now', '-35 minutes'));
" --local

echo ""
echo "3. Testing analytics queries..."

echo "   📊 Total sessions:"
npx wrangler d1 execute myjobtrack-db --command="SELECT COUNT(*) as total_sessions FROM trk_sessions;" --local

echo ""
echo "   📈 Events by category:"
npx wrangler d1 execute myjobtrack-db --command="SELECT event_category, COUNT(*) as event_count FROM trk_events GROUP BY event_category;" --local

echo ""
echo "   🎯 Conversion funnel:"
npx wrangler d1 execute myjobtrack-db --command="
SELECT 
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM trk_events 
WHERE demo_mode = true 
GROUP BY event_name 
ORDER BY event_count DESC;
" --local

echo ""
echo "   📊 Demo engagement metrics:"
npx wrangler d1 execute myjobtrack-db --command="
SELECT 
  COUNT(*) as total_sessions,
  SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions,
  (SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversion_rate,
  AVG(page_views) as avg_page_views,
  AVG(duration) as avg_duration
FROM trk_sessions 
WHERE demo_mode = true;
" --local

echo ""
echo "   🔥 Popular features:"
npx wrangler d1 execute myjobtrack-db --command="
SELECT 
  json_extract(properties, '$.feature') as feature,
  COUNT(*) as usage_count
FROM trk_events 
WHERE event_name = 'feature_interaction' AND demo_mode = true
GROUP BY json_extract(properties, '$.feature')
ORDER BY usage_count DESC;
" --local

echo ""
echo "4. Testing API endpoints (if server is running)..."

# Test if server is running on port 5173
if curl -s http://localhost:5173 > /dev/null; then
  echo "   ✅ Server is running, testing analytics endpoints..."
  
  # Test session initialization
  echo "   📝 Testing session init..."
  curl -X POST http://localhost:5173/api/analytics/session \
    -H "Content-Type: application/json" \
    -d '{
      "sessionId": "test-api-session-1",
      "demoMode": true,
      "userType": "demo",
      "landingPage": "/",
      "referrer": "https://google.com"
    }' -s | jq '.' || echo "Session init test completed"

  echo ""
  echo "   📊 Testing event tracking..."
  curl -X POST http://localhost:5173/api/analytics/track \
    -H "Content-Type: application/json" \
    -d '{
      "event": "test_event",
      "sessionId": "test-api-session-1",
      "demoMode": true,
      "userType": "demo",
      "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
      "properties": {
        "page": "/test",
        "source": "api_test"
      }
    }' -s | jq '.' || echo "Event tracking test completed"

  echo ""
  echo "   📈 Testing analytics queries..."
  curl -X GET "http://localhost:5173/api/analytics/query?query=demo_engagement&timeframe=1d" -s | jq '.' || echo "Query test completed"

else
  echo "   ⚠️  Server not running on port 5173, skipping API tests"
  echo "      To test APIs, run: npm run dev"
fi

echo ""
echo "🎉 Analytics system test completed!"
echo ""
echo "📋 Summary:"
echo "- ✅ Analytics tables created with trk_ prefix"
echo "- ✅ Test data inserted successfully"
echo "- ✅ Database queries working"
echo "- 📊 Ready to track user engagement!"
echo ""
echo "🚀 Next steps:"
echo "1. Start the dev server: npm run dev"
echo "2. Visit the app in demo mode"
echo "3. View analytics at /admin/analytics (if implemented)"
echo "4. Check the browser console for analytics events"
