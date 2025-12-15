/**
 * Instagram URL Validator
 * Validates Instagram profile URLs and extracts usernames
 */

/**
 * Validates if a URL is a valid Instagram profile URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid Instagram URL, false otherwise
 */
function isValidInstagramUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Regular expression to match Instagram profile URLs
  const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?$/;
  return instagramUrlPattern.test(url.trim());
}

/**
 * Extracts username from Instagram URL
 * @param {string} url - The Instagram URL
 * @returns {string|null} - Username or null if invalid
 */
function extractInstagramUsername(url) {
  if (!isValidInstagramUrl(url)) {
    return null;
  }

  const match = url.trim().match(/instagram\.com\/([a-zA-Z0-9._]+)/);
  return match ? match[1] : null;
}

/**
 * Normalizes Instagram URL to consistent format
 * @param {string} url - The Instagram URL
 * @returns {string|null} - Normalized URL or null if invalid
 */
function normalizeInstagramUrl(url) {
  const username = extractInstagramUsername(url);
  if (!username) {
    return null;
  }
  return `https://www.instagram.com/${username}`;
}

module.exports = {
  isValidInstagramUrl,
  extractInstagramUsername,
  normalizeInstagramUrl
};
