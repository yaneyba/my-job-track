#!/bin/bash

# Script to set up Slack webhook URL as a secret in both development and production environments

WEBHOOK_URL="https://hooks.slack.com/services/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"

echo "Setting up Slack webhook URL as a secret..."

# Set for development environment
echo "Setting secret for development environment..."
echo "$WEBHOOK_URL" | npx wrangler secret put SLACK_WEBHOOK_URL --env development

# Set for production environment  
echo "Setting secret for production environment..."
echo "$WEBHOOK_URL" | npx wrangler secret put SLACK_WEBHOOK_URL --env production

# Set for default environment (no --env flag)
echo "Setting secret for default environment..."
echo "$WEBHOOK_URL" | npx wrangler secret put SLACK_WEBHOOK_URL

echo "✅ Slack webhook URL has been set as a secret for all environments"
echo "🚀 You can now deploy the API and Slack notifications will be sent for new waitlist signups"
