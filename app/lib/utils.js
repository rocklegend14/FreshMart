/**
 * Format a price with INR currency symbol
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  return `₹${price}`;
}

/**
 * Format date to readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Truncate text to a specific length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length of the returned string
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
} 