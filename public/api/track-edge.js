/**
 * Edge Analytics Tracking API
 * Receives analytics data from edge middleware and stores it
 * This endpoint handles the database writes asynchronously,
 * ensuring the redirect happens at rocket speed
 */

const admin = require('firebase-admin');
const redisUtils = require('../../src/utils/redis.utils');

// Helper to convert shortCode to Firestore-safe ID
function toFirestoreId(shortCode) {
  return shortCode.replace(/\//g, '_');
}

// Get Firestore instance
const db = admin.firestore();
const COLLECTIONS = {
  LINKS: 'links',
  ANALYTICS: 'analytics',
  USERS: 'users'
};

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify this is an internal request from our middleware
  const internalHeader = req.headers['x-internal-request'];
  if (internalHeader !== 'true') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const {
      shortCode,
      timestamp,
      userAgent,
      referer,
      ip,
      geo,
      acceptLanguage,
      platform,
    } = req.body;

    // Validate required fields
    if (!shortCode || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get Redis client
    const redis = redisUtils.getRedisClient();
    
    if (!redis) {
      console.warn('Redis not configured, skipping analytics storage');
      return res.status(200).json({ success: true, message: 'Analytics skipped (Redis not configured)' });
    }

    // Store analytics data with timestamp-based key
    const analyticsKey = `analytics:${shortCode}:${timestamp}`;
    const analyticsData = {
      timestamp,
      userAgent,
      referer,
      ip,
      geo,
      acceptLanguage,
      platform,
    };

    // Store with TTL of 90 days (in seconds)
    await redis.setex(analyticsKey, 60 * 60 * 24 * 90, analyticsData);

    // Increment click counter
    await redis.incr(`clicks:${shortCode}`);

    // Also increment daily counter for time-series analytics
    const dateKey = new Date(timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    await redis.incr(`clicks:${shortCode}:${dateKey}`);

    // Track unique countries
    if (geo.country !== 'unknown') {
      await redis.sadd(`countries:${shortCode}`, geo.country);
    }

    // Track unique cities
    if (geo.city !== 'unknown') {
      await redis.sadd(`cities:${shortCode}`, geo.city);
    }

    // Also store in Firestore sub-collection for long-term storage
    // Each click is a separate document to avoid 1MB document limit
    try {
      const firestoreId = toFirestoreId(shortCode);
      const analyticsRef = db.collection(COLLECTIONS.ANALYTICS).doc(firestoreId);
      
      // Parse device, browser, and other data from userAgent
      const deviceType = /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop';
      const browser = userAgent.match(/(Firefox|Chrome|Safari|Edge|Opera)\/[\d.]+/)?.[1] || 'Other';
      
      const clickData = {
        timestamp: new Date(timestamp).toISOString(),
        device: deviceType,
        browser,
        referrer: referer,
        userAgent,
        ip,
        location: {
          country: geo.country || 'unknown',
          city: geo.city || 'unknown',
          region: geo.region || 'unknown',
          latitude: geo.latitude || null,
          longitude: geo.longitude || null,
          timezone: geo.timezone || 'unknown'
        },
        platform,
        acceptLanguage
      };
      
      // Store click in sub-collection
      const clickRef = analyticsRef.collection('clicks').doc();
      await clickRef.set(clickData);
      
      // Update aggregate counters
      const locationKey = `${geo.city}, ${geo.region}`;
      await analyticsRef.update({
        clicks: admin.firestore.FieldValue.increment(1),
        [`devices.${deviceType}`]: admin.firestore.FieldValue.increment(1),
        [`browsers.${browser}`]: admin.firestore.FieldValue.increment(1),
        [`countries.${geo.country}`]: admin.firestore.FieldValue.increment(1),
        [`locations.${locationKey}`]: admin.firestore.FieldValue.increment(1),
        [`referrers.${referer}`]: admin.firestore.FieldValue.increment(1)
      });
    } catch (firestoreError) {
      console.warn('Firestore storage failed (non-critical):', firestoreError.message);
      // Don't fail the request if Firestore fails - Redis is primary
    }

    console.log(`✅ Analytics tracked for ${shortCode} from ${geo.city}, ${geo.country}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Analytics tracked successfully',
      shortCode,
    });

  } catch (error) {
    console.error('Error tracking analytics:', error);
    // Return success even on error to avoid blocking
    // Analytics failures shouldn't affect user experience
    return res.status(200).json({ 
      success: false, 
      error: 'Analytics tracking failed',
      message: error.message 
    });
  }
};
