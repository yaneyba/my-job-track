/**
 * Send Slack notification for waitlist signup
 * @param email User's email
 * @param businessType User's business type (optional)
 * @param source Source of the signup (optional)
 * @param webhookUrl Slack webhook URL
 * @returns Promise<boolean> indicating success
 */
export async function notifySlackOnWaitlistSignup(
  { email, businessType, source }: { email: string; businessType?: string; source?: string },
  webhookUrl: string
): Promise<boolean> {
  try {
    const message = {
      text: `🎉 *New My Job Track Waitlist Signup!*`,
      username: 'My Job Track Bot',
      icon_emoji: ':briefcase:',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎉 New My Job Track Waitlist Signup!',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Email:*\n${email}`
            },
            {
              type: 'mrkdwn',
              text: `*Business Type:*\n${businessType || 'Not specified'}`
            },
            {
              type: 'mrkdwn',
              text: `*Source:*\n${source || 'Demo Mode'}`
            },
            {
              type: 'mrkdwn',
              text: `*Date:*\n${new Date().toLocaleString()}`
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `� *Action Required:* Follow up with ${email} to provide updates on launch timeline.`
            }
          ]
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      console.error('Failed to send Slack notification:', response.status, response.statusText);
      return false;
    }

    console.log('Slack notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return false;
  }
}
