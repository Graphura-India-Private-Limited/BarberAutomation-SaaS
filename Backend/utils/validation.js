const dns = require("dns").promises;

/**
 * Validates a mobile number.
 * - Strips leading +91, 91, or 0.
 * - Ensures exactly 10 digits starting with 6, 7, 8, or 9.
 * - Rejects sequential or repeating dummy digits.
 */
function validateMobile(mobile) {
  if (!mobile) {
    return { valid: false, message: "Mobile number is required" };
  }

  // Convert to string and clean formatting
  let clean = String(mobile).replace(/[\s\-\+\(\)]/g, "");
  
  // Normalize Indian country code prefixes
  if (clean.startsWith("91") && clean.length === 12) {
    clean = clean.slice(2);
  } else if (clean.startsWith("0") && clean.length === 11) {
    clean = clean.slice(1);
  }

  // Ensure exactly 10 digits
  if (!/^\d{10}$/.test(clean)) {
    return { valid: false, message: "Mobile number must be a 10-digit number" };
  }

  // Validate start digit (6-9 for Indian mobile networks)
  if (!/^[6-9]/.test(clean)) {
    return { valid: false, message: "Mobile number must start with 6, 7, 8, or 9" };
  }

  // Reject repeating dummy digits (e.g. 9999999999, 0000000000)
  if (/^(\d)\1{9}$/.test(clean)) {
    return { valid: false, message: "Repeating dummy mobile numbers are not allowed" };
  }

  // Reject sequential dummy digits (e.g. 1234567890, 9876543210)
  const sequentialPatterns = [
    "0123456789", "1234567890", "9876543210", "8765432109", "2345678901", "0987654321"
  ];
  if (sequentialPatterns.includes(clean)) {
    return { valid: false, message: "Sequential dummy mobile numbers are not allowed" };
  }

  return { valid: true, clean };
}

/**
 * Validates an email address.
 * - Validates general format.
 * - Rejects disposable or test domains.
 * - Checks DNS MX records to verify domain capability to receive mails.
 */
async function validateEmailReal(email) {
  if (!email) {
    return { valid: true }; // Allow empty optional emails
  }

  const emailTrimmed = String(email).trim().toLowerCase();
  
  // 1. Format regex validation
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(emailTrimmed)) {
    return { valid: false, message: "Invalid email address format" };
  }

  const domain = emailTrimmed.split("@")[1];

  // Bypass DNS checks during local development, test suites, or for seed accounts
  if (
    process.env.NODE_ENV !== "production" || 
    emailTrimmed.startsWith("dummy_") || 
    emailTrimmed.startsWith("seed_") || 
    emailTrimmed.includes("barberpro.com") || 
    emailTrimmed.includes("royal.com") ||
    domain === "localhost"
  ) {
    return { valid: true };
  }

  // 2. Reject disposable / testing domains
  const blockedDomains = [
    "example.com", "test.com", "dummy.com", "foo.com", "bar.com", 
    "mailinator.com", "tempmail.com", "temp-mail.org", "yopmail.com", 
    "dispostable.com", "guerrillamail.com", "sharklasers.com"
  ];
  if (blockedDomains.includes(domain)) {
    return { valid: false, message: "Disposable or test email domains are not allowed" };
  }

  // 3. DNS MX records lookup
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, message: "Email domain does not have a valid mail server configured" };
    }
  } catch (err) {
    return { valid: false, message: "Email domain is inactive or does not exist" };
  }

  return { valid: true };
}

module.exports = { validateMobile, validateEmailReal };
