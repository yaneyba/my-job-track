/**
 * Email validation utilities for spam prevention
 */

/**
 * Expanded list of disposable email domains
 * Updated regularly to include new temporary email services
 */
export const DISPOSABLE_EMAIL_DOMAINS = [
  // Popular disposable email services
  '10minutemail.com', '10minutemail.net', '20minutemail.com',
  'tempmail.org', 'temp-mail.org', 'temp-mail.io',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'mailinator.com', 'mailinator2.com', 'mailinator.net',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'throwaway.email', 'throwawaymail.com',
  'dispostable.com', 'disposablemail.com',
  
  // Numeric and short domains
  '0-mail.com', '1-mail.net', '33mail.com',
  'smellfear.com', 'tmail.com', 'tmailinator.com',
  'trashmail.com', 'trashmail.net', 'trashmail.org',
  
  // Common temporary services
  'getnada.com', 'tempinbox.com', 'emailondeck.com',
  'maildrop.cc', 'sharklasers.com', 'grr.la',
  'guerrillamail.de', 'pokemail.net', 'spam4.me',
  
  // Recently discovered services
  'mohmal.com', 'mailnesia.com', 'mailcatch.com',
  'mytrashmail.com', 'tempail.com', 'tempemail.net',
  'fakeinbox.com', 'spamgourmet.com', 'jetable.org',
  
  // Single-use and burner services
  'burnthisemail.com', 'deadaddress.com', 'emailtemporaneo.com',
  'fakemailgenerator.com', 'hidemail.de', 'incognitomail.org',
  'mintemail.com', 'mytemp.email', 'ninja-email.com',
  'nomail.xl.cx', 'nwldx.com', 'objectmail.com',
  'oneoffmail.com', 'pookmail.com', 'quickinbox.com',
  'rcpt.at', 'recode.me', 'recursor.net',
  'safe-mail.net', 'selfdestructingmail.com', 'sneakemail.com',
  'sogetthis.com', 'soodonims.com', 'tagyourself.com',
  'talkinator.com', 'temporaryemail.net', 'temporaryforwarding.com',
  'thanksnospam.info', 'thisisnotmyrealemail.com', 'tmailinator.com',
  'tradermail.info', 'trash2009.com', 'trash-amil.com',
  'trashdevil.com', 'trashymail.com', 'tyldd.com',
  'uggsrock.com', 'walkmail.net', 'wetrainbayarea.com',
  'wronghead.com', 'wuzup.net', 'xoxy.net',
  'yogamail.com', 'yuurok.com', 'zehnminutenmail.de',
  'zetmail.com', 'zoemail.org'
];

/**
 * Check if an email domain is a known disposable/temporary email service
 * @param email Email address to check
 * @returns true if disposable, false otherwise
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

/**
 * Advanced email validation beyond basic regex
 * @param email Email address to validate
 * @returns object with validation results
 */
export function validateEmailAdvanced(email: string): {
  isValid: boolean;
  isDisposable: boolean;
  isSuspicious: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  let isValid = true;
  let isSuspicious = false;
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    isValid = false;
    warnings.push('Invalid email format');
  }
  
  const [localPart, domain] = email.split('@');
  
  // Check for suspicious patterns in local part
  if (localPart) {
    // Too many consecutive numbers
    if (/\d{6,}/.test(localPart)) {
      isSuspicious = true;
      warnings.push('Unusual number sequence in email');
    }
    
    // Too many consecutive characters
    if (/(.)\1{4,}/.test(localPart)) {
      isSuspicious = true;
      warnings.push('Repeated characters in email');
    }
    
    // Random-looking patterns
    if (localPart.length > 15 && !/[aeiou]/i.test(localPart)) {
      isSuspicious = true;
      warnings.push('Potentially random email address');
    }
  }
  
  // Check domain
  if (domain) {
    // Very short domains (excluding valid ones like qq.com)
    if (domain.length < 4 && !['qq.com', 'me.com'].includes(domain)) {
      isSuspicious = true;
      warnings.push('Unusually short domain');
    }
    
    // Domains with excessive hyphens or numbers
    if ((domain.match(/-/g) || []).length > 2) {
      isSuspicious = true;
      warnings.push('Domain contains many hyphens');
    }
  }
  
  const isDisposable = isDisposableEmail(email);
  if (isDisposable) {
    warnings.push('Disposable email address detected');
  }
  
  return {
    isValid,
    isDisposable,
    isSuspicious,
    warnings
  };
}

/**
 * User agent validation patterns
 */
export const SUSPICIOUS_USER_AGENT_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i, 
  /python/i, /java/i, /perl/i, /php/i, /ruby/i,
  /http/i, /request/i, /client/i, /library/i,
  /automated/i, /script/i, /tool/i, /utility/i,
  /test/i, /check/i, /monitor/i, /scan/i
];

/**
 * Check if user agent appears to be from a bot or automated tool
 * @param userAgent User agent string
 * @returns true if suspicious, false otherwise
 */
export function isSuspiciousUserAgent(userAgent: string): boolean {
  if (!userAgent || userAgent.length < 10) return true;
  
  return SUSPICIOUS_USER_AGENT_PATTERNS.some(pattern => pattern.test(userAgent));
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  // Max submissions per IP per time period
  SUBMISSIONS_PER_HOUR: 3,
  SUBMISSIONS_PER_DAY: 10,
  
  // Max unique emails per IP per time period
  UNIQUE_EMAILS_PER_IP_PER_DAY: 5,
  
  // Max similar emails (same local part) per time period
  SIMILAR_EMAILS_PER_DAY: 3,
  
  // Cooldown periods (in milliseconds)
  SHORT_COOLDOWN: 5 * 60 * 1000, // 5 minutes
  LONG_COOLDOWN: 60 * 60 * 1000,  // 1 hour
  
  // Time windows (in milliseconds)
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000
};
