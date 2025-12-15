/**
 * Instagram Public Profile Fetcher
 * 
 * ⚠️ IMPORTANT PRODUCTION NOTICE:
 * This implementation uses Instagram's undocumented public endpoints for development/proof-of-concept.
 * 
 * LIMITATIONS:
 * - May break if Instagram changes their HTML structure or endpoints
 * - Subject to rate limiting and potential IP blocking
 * - May violate Instagram's Terms of Service for production use
 * - Not suitable for commercial applications
 * 
 * RECOMMENDED FOR PRODUCTION:
 * Replace this with Instagram's official APIs:
 * 1. Instagram Basic Display API - for personal accounts
 *    https://developers.facebook.com/docs/instagram-basic-display-api
 * 2. Instagram Graph API - for business/creator accounts
 *    https://developers.facebook.com/docs/instagram-api
 * 
 * Official APIs provide:
 * - Stable, documented endpoints
 * - Proper authentication and authorization
 * - Rate limiting transparency
 * - Compliance with Instagram Platform Policy
 * - Webhooks for real-time updates
 * 
 * See README.md for detailed migration instructions.
 */

const axios = require('axios');

// Cache for Instagram data to avoid excessive requests
const instagramCache = new Map();
const CACHE_DURATION = parseInt(process.env.INSTAGRAM_CACHE_DURATION, 10) || 3600000; // 1 hour default

/**
 * Fetches public Instagram profile data
 * @param {string} username - Instagram username
 * @returns {Promise<Object>} - Profile data including images
 */
async function fetchInstagramProfile(username) {
  // Check cache first
  const cacheKey = username.toLowerCase();
  const cached = instagramCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Attempt to fetch public profile data
    // Note: Instagram's public endpoints can change, so this is a best-effort approach
    // For production use, consider implementing Instagram's official Basic Display API or Graph API
    // which provides more reliable and compliant data access
    const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000
    });

    // Parse the response and extract image data
    const profileData = parseInstagramResponse(response.data, username);
    
    // Cache the result
    instagramCache.set(cacheKey, {
      data: profileData,
      timestamp: Date.now()
    });

    return profileData;
  } catch (error) {
    console.error(`Error fetching Instagram profile for ${username}:`, error.message);
    
    // If API method fails, return mock data structure for demonstration
    // In production, you would implement proper error handling or use Instagram's official API
    return createFallbackData(username);
  }
}

/**
 * Parses Instagram API response to extract relevant data
 * @param {Object} data - Raw Instagram response
 * @param {string} username - Instagram username
 * @returns {Object} - Parsed profile data
 */
function parseInstagramResponse(data, username) {
  try {
    // Instagram's response structure may vary
    const user = data?.graphql?.user || data?.user;
    
    if (!user) {
      return createFallbackData(username);
    }

    // Check if profile is public
    if (user.is_private) {
      return {
        username: username,
        isPublic: false,
        images: [],
        error: 'Profile is private'
      };
    }

    // Extract recent posts
    const edges = user.edge_owner_to_timeline_media?.edges || [];
    const images = edges.slice(0, 12).map(edge => ({
      id: edge.node.id,
      url: edge.node.display_url,
      thumbnail: edge.node.thumbnail_src,
      caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || '',
      likes: edge.node.edge_liked_by?.count || 0,
      timestamp: edge.node.taken_at_timestamp
    }));

    return {
      username: user.username,
      fullName: user.full_name,
      biography: user.biography,
      profilePicUrl: user.profile_pic_url,
      isPublic: !user.is_private,
      followers: user.edge_followed_by?.count || 0,
      images: images
    };
  } catch (error) {
    console.error('Error parsing Instagram response:', error.message);
    return createFallbackData(username);
  }
}

/**
 * Creates fallback data structure when Instagram data cannot be fetched
 * @param {string} username - Instagram username
 * @returns {Object} - Fallback data structure
 */
function createFallbackData(username) {
  // Return sample/placeholder images for demonstration
  // In production, this could show a message to the user
  return {
    username: username,
    isPublic: true,
    images: [
      {
        id: 'sample1',
        url: `https://via.placeholder.com/400x400/e94560/ffffff?text=${username}+1`,
        thumbnail: `https://via.placeholder.com/200x200/e94560/ffffff?text=${username}+1`,
        caption: 'Sample Instagram post 1',
        likes: 0,
        timestamp: Date.now() / 1000
      },
      {
        id: 'sample2',
        url: `https://via.placeholder.com/400x400/d4af37/ffffff?text=${username}+2`,
        thumbnail: `https://via.placeholder.com/200x200/d4af37/ffffff?text=${username}+2`,
        caption: 'Sample Instagram post 2',
        likes: 0,
        timestamp: Date.now() / 1000
      },
      {
        id: 'sample3',
        url: `https://via.placeholder.com/400x400/16213e/ffffff?text=${username}+3`,
        thumbnail: `https://via.placeholder.com/200x200/16213e/ffffff?text=${username}+3`,
        caption: 'Sample Instagram post 3',
        likes: 0,
        timestamp: Date.now() / 1000
      }
    ],
    fallback: true,
    message: 'Using placeholder images. Configure Instagram API for live data.'
  };
}

/**
 * Clears the cache for a specific username or all cache
 * @param {string} username - Optional username to clear specific cache
 */
function clearCache(username = null) {
  if (username) {
    instagramCache.delete(username.toLowerCase());
  } else {
    instagramCache.clear();
  }
}

module.exports = {
  fetchInstagramProfile,
  clearCache
};
