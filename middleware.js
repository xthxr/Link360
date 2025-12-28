import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Paths that should bypass the redirect logic
const BYPASS_PATHS = [
  '/api',
  '/js',
  '/css',
  '/assets',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

// File extensions that should bypass redirect
const BYPASS_EXTENSIONS = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.geojson',
  '.json',
  '.xml',
  '.txt',
];

/**
 * Checks if the path should bypass the redirect logic
 */
function shouldBypass(pathname) {
  // Check if path starts with any bypass path
  if (BYPASS_PATHS.some(path => pathname.startsWith(path))) {
    return true;
  }

  // Check if path has a bypass extension
  if (BYPASS_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return true;
  }

  // Bypass root path
  if (pathname === '/') {
    return true;
  }

  // Bypass specific pages
  if (pathname === '/index.html' || 
      pathname === '/landing.html' || 
      pathname === '/bio.html' ||
      pathname === '/home' ||
      pathname === '/bio-link' ||
      pathname === '/qr-generator' ||
      pathname === '/analytics' ||
      pathname === '/profile') {
    return true;
  }

  return false;
}

/**
 * Extract shortCode from pathname
 */
function extractShortCode(pathname) {
  // Remove leading slash and any trailing slashes
  const code = pathname.replace(/^\/+|\/+$/g, '');
  
  // Return null if empty or contains invalid characters for shortCode
  if (!code || code.includes(' ')) {
    return null;
  }
  
  return code;
}

/**
 * Edge Middleware for URL Redirection
 * Runs at Vercel Edge Network for sub-50ms latency
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip bypass paths
  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  // Extract potential shortCode
  const shortCode = extractShortCode(pathname);
  
  if (!shortCode) {
    return NextResponse.next();
  }

  try {
    // Perform Redis lookup at the edge
    // Use a namespace to separate link data
    const linkKey = `link:${shortCode}`;
    const linkData = await redis.get(linkKey);

    if (linkData && linkData.destination) {
      // Extract geolocation data for analytics
      const geoData = extractGeoData(request);
      const analyticsPayload = {
        shortCode,
        timestamp: Date.now(),
        userAgent: request.headers.get('user-agent') || 'unknown',
        referer: request.headers.get('referer') || 'direct',
        ip: request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        geo: geoData,
        acceptLanguage: request.headers.get('accept-language') || 'unknown',
        platform: request.headers.get('sec-ch-ua-platform') || 'unknown',
      };

      // Send analytics to internal API in non-blocking way
      // Fire-and-forget: no await, redirect happens immediately
      const apiUrl = new URL('/api/track-edge', request.url);
      fetch(apiUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Request': 'true',
        },
        body: JSON.stringify(analyticsPayload),
      }).catch(err => console.error('Analytics tracking failed:', err));

      // ROCKET SPEED: Redirect happens immediately, no waiting for database
      return NextResponse.redirect(linkData.destination, {
        status: 307, // Temporary redirect preserves method
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300',
          'X-Redirect-By': 'edge-middleware',
          'X-Short-Code': shortCode,
        },
      });
    }

    // No match found, continue to origin server
    // The server will handle 404 or further logic
    return NextResponse.next();

  } catch (error) {
    console.error('Edge middleware error:', error);
    // On error, fail open and let request continue to origin
    return NextResponse.next();
  }
}

/**
 * Extract geolocation data from Vercel's built-in geo object and headers
 * No external API calls - all data from edge request
 */
function extractGeoData(request) {
  // Primary: Use Vercel's built-in geo object
  const geo = {
    country: request.geo?.country || request.headers.get('x-vercel-ip-country') || 'unknown',
    countryCode: request.geo?.countryCode || request.headers.get('x-vercel-ip-country') || 'unknown',
    region: request.geo?.region || request.headers.get('x-vercel-ip-country-region') || 'unknown',
    city: request.geo?.city || request.headers.get('x-vercel-ip-city') || 'unknown',
    latitude: request.geo?.latitude || request.headers.get('x-vercel-ip-latitude') || null,
    longitude: request.geo?.longitude || request.headers.get('x-vercel-ip-longitude') || null,
    timezone: request.geo?.timezone || request.headers.get('x-vercel-ip-timezone') || 'unknown',
  };

  return geo;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api (API routes)
     * - /js (JavaScript files)
     * - /css (CSS files)
     * - /assets (static assets)
     * - /_next (Next.js internals)
     * - Static files (ico, png, jpg, etc.)
     */
    '/((?!api|js|css|assets|_next|favicon.ico|.*\\..*$).*)',
  ],
};
