/**
 * Security utilities for frontend input validation and sanitization.
 *
 * These functions provide client-side security measures as a first line of defense.
 * Always validate and sanitize on the backend as well - never trust client-side only.
 */

/**
 * Maximum lengths for various input types
 */
export const INPUT_LIMITS = {
  SEARCH: 100,
  TITLE: 255,
  CATEGORY: 50,
  MEDIUM: 100,
  DESCRIPTION: 5000,
} as const;

/**
 * Characters to strip from user input to prevent injection attacks.
 * These are removed before sending to the API.
 */
const DANGEROUS_CHARS_REGEX = /[<>"'%;()&+\\]/g;

/**
 * Sanitize user input by removing potentially dangerous characters.
 *
 * @param input - Raw user input
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string or null if input is invalid
 */
export function sanitizeInput(input: string | null | undefined, maxLength: number): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Trim whitespace
  let sanitized = input.trim();

  // Check if empty after trim
  if (sanitized.length === 0) {
    return null;
  }

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove dangerous characters
  sanitized = sanitized.replace(DANGEROUS_CHARS_REGEX, '');

  // Check if empty after sanitization
  if (sanitized.length === 0) {
    return null;
  }

  return sanitized;
}

/**
 * Escape HTML entities to prevent XSS when displaying user content.
 * Use this when inserting dynamic content into the DOM.
 *
 * @param text - Text to escape
 * @returns HTML-escaped string
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, char => htmlEntities[char] || char);
}

/**
 * Validate that a URL is safe (not javascript:, data:, etc.)
 *
 * @param url - URL to validate
 * @returns true if URL is safe
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      return false;
    }
  }

  // Allow relative URLs and safe protocols
  if (trimmed.startsWith('/') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('mailto:')) {
    return true;
  }

  // Block unknown protocols
  if (trimmed.includes(':')) {
    return false;
  }

  return true;
}

/**
 * Sanitize a URL for safe use in href attributes.
 * Returns empty string if URL is not safe.
 *
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!isSafeUrl(url)) {
    console.warn('Blocked unsafe URL:', url);
    return '';
  }
  return url!.trim();
}

/**
 * Validate that a value is a positive integer (for IDs).
 *
 * @param value - Value to validate
 * @returns true if value is a positive integer
 */
export function isValidId(value: unknown): value is number {
  return typeof value === 'number' &&
         Number.isInteger(value) &&
         value > 0;
}

/**
 * Rate limit function calls to prevent abuse.
 * Returns a debounced version of the function.
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

