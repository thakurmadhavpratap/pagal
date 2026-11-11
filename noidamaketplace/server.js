/**
 * NoidaGym Marketplace - Node.js HTTP Server & API
 * Provides REST endpoints for gym discovery, filtering, booking, and gym-owner onboarding.
 * Zero external dependencies. Uses Node.js native http, fs, path, url modules.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// Resolve the base public directory across standard and serverless runtime environments
function resolvePublicDir() {
  const candidates = [
    path.join(__dirname, 'public'),
    path.join(process.cwd(), 'public'),
    path.join(__dirname),
    path.join(process.cwd())
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'index.html')) || fs.existsSync(path.join(dir, 'js', 'data.js'))) {
      return dir;
    }
  }
  return path.join(__dirname, 'public');
}

const PUBLIC_DIR = resolvePublicDir();

// Load initial sample data with reliable absolute path resolution across environments
let dataModule = null;
const candidateDataPaths = [
  path.join(__dirname, 'public', 'js', 'data.js'),
  path.join(process.cwd(), 'public', 'js', 'data.js'),
  path.join(__dirname, 'js', 'data.js'),
  path.join(process.cwd(), 'js', 'data.js')
];

const dataLoadErrors = [];
for (const dataPath of candidateDataPaths) {
  try {
    if (fs.existsSync(dataPath)) {
      dataModule = require(dataPath);
      if (dataModule && Array.isArray(dataModule.NOIDA_GYMS)) {
        break;
      }
    }
  } catch (err) {
    dataLoadErrors.push({ path: dataPath, error: err.message });
  }
}

// Fallback to relative require if path-based require did not resolve
if (!dataModule || !Array.isArray(dataModule.NOIDA_GYMS)) {
  try {
    dataModule = require('./public/js/data.js');
  } catch (err) {
    dataLoadErrors.push({ path: './public/js/data.js', error: err.message });
  }
}

// If dataModule still failed to load, log detailed diagnostics and provide safe empty schema
if (!dataModule || !Array.isArray(dataModule.NOIDA_GYMS)) {
  console.error('[NoidaGym Server] Critical: Failed to load dataset from any candidate location.');
  console.error('[NoidaGym Server] Attempted paths & errors:', JSON.stringify(dataLoadErrors, null, 2));
  console.error('[NoidaGym Server] Environment info: __dirname =', __dirname, ', cwd =', process.cwd());
  dataModule = {
    NOIDA_GYMS: [],
    NOIDA_SECTORS: [
      { id: 'all', name: 'All Noida' }
    ],
    NOIDA_LANDMARKS: {}
  };
}

const { NOIDA_GYMS = [], NOIDA_SECTORS = [], NOIDA_LANDMARKS = {} } = dataModule;

// In-memory runtime collections for demo requests and gym listings
let registeredGyms = [...NOIDA_GYMS];
let trialBookings = [];
let membershipBookings = [];
let ownerSubmissions = [];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// Haversine formula to calculate distance in km between two lat/lng points
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function parseJsonBody(req) {
  // If request body was already parsed by Vercel Serverless runtime or middleware
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return Promise.resolve(req.body);
    if (typeof req.body === 'string') {
      try {
        if (!req.body.trim()) return Promise.resolve({});
        return Promise.resolve(JSON.parse(req.body));
      } catch (err) {
        return Promise.reject(new Error('Invalid JSON format'));
      }
    }
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 2 * 1024 * 1024) { // 2MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        if (!body.trim()) return resolve({});
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  if (res.headersSent) return;
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Request dispatcher
async function handleRequest(req, res) {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  
  // Resolve effective path (supports Vercel proxy headers and ?_path= rewrite parameter)
  let pathname = reqUrl.pathname;
  const matchedHeader = req.headers['x-matched-path'] || req.headers['x-invoke-path'];
  if (matchedHeader && (matchedHeader.startsWith('/api') || matchedHeader.startsWith('api'))) {
    const rawPath = matchedHeader.startsWith('/') ? matchedHeader : `/${matchedHeader}`;
    pathname = rawPath.split('?')[0];
  } else if (reqUrl.searchParams.get('_path')) {
    const sub = reqUrl.searchParams.get('_path');
    pathname = sub.startsWith('/') ? `/api${sub}` : `/api/${sub}`;
  }

  const method = req.method;

  if (method === 'OPTIONS') {
    if (!res.headersSent) {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
    }
    return;
  }

  // --- API ROUTES ---

  // GET /api or /api/
  if ((pathname === '/api' || pathname === '/api/') && method === 'GET') {
    return sendJson(res, 200, {
      service: 'NoidaGym Marketplace API',
      status: 'ok',
      timestamp: new Date().toISOString(),
      activeGyms: registeredGyms.length,
      endpoints: [
        'GET /api/health',
        'GET /api/sectors',
        'GET /api/gyms',
        'GET /api/gyms/:id',
        'POST /api/trials',
        'POST /api/memberships',
        'POST /api/gym-onboarding'
      ]
    });
  }

  // GET /api/health
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'NoidaGym Marketplace API',
      timestamp: new Date().toISOString(),
      activeGyms: registeredGyms.length,
      demoMode: true
    });
  }

  // GET /api/sectors
  if (pathname === '/api/sectors' && method === 'GET') {
    return sendJson(res, 200, NOIDA_SECTORS);
  }

  // GET /api/gyms
  if (pathname === '/api/gyms' && method === 'GET') {
    const q = (reqUrl.searchParams.get('q') || '').trim().toLowerCase();
    const sector = (reqUrl.searchParams.get('sector') || '').trim().toLowerCase();
    const facility = (reqUrl.searchParams.get('facility') || '').trim();
    const open24 = reqUrl.searchParams.get('open24') === 'true';
    const womenOnly = reqUrl.searchParams.get('womenOnly') === 'true';
    const minPriceParam = reqUrl.searchParams.get('minPrice');
    const maxPriceParam = reqUrl.searchParams.get('maxPrice');
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : null;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : null;
    const sort = reqUrl.searchParams.get('sort') || 'recommended';
    const latParam = reqUrl.searchParams.get('lat');
    const lngParam = reqUrl.searchParams.get('lng');
    const userLat = latParam ? parseFloat(latParam) : null;
    const userLng = lngParam ? parseFloat(lngParam) : null;
    const maxDistParam = reqUrl.searchParams.get('maxDistance');
    const maxDistance = maxDistParam ? parseFloat(maxDistParam) : null;

    let results = registeredGyms.map(gym => {
      let distance = null;
      if (userLat && userLng && gym.coordinates) {
        distance = calculateDistance(userLat, userLng, gym.coordinates.lat, gym.coordinates.lng);
      }
      return { ...gym, distance };
    });

    // Query filter (search term in name, address, landmark, sector, facilities)
    if (q) {
      results = results.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.sector.toLowerCase().includes(q) ||
        g.landmark.toLowerCase().includes(q) ||
        g.address.toLowerCase().includes(q) ||
        (g.facilities && g.facilities.some(f => f.toLowerCase().includes(q))) ||
        (g.classes && g.classes.some(c => c.toLowerCase().includes(q)))
      );
    }

    // Sector filter
    if (sector && sector !== 'all') {
      results = results.filter(g =>
        g.sectorId === sector ||
        g.sector.toLowerCase().replace(/\s+/g, '-').includes(sector)
      );
    }

    // Facility filter
    if (facility) {
      results = results.filter(g =>
        g.facilityTags && g.facilityTags.includes(facility.toLowerCase())
      );
    }

    // 24 Hours filter
    if (open24) {
      results = results.filter(g => g.openingHours && g.openingHours.is24Hours);
    }

    // Women-only timings filter
    if (womenOnly) {
      results = results.filter(g =>
        g.facilityTags && g.facilityTags.includes('women-timings')
      );
    }

    // Price range filter
    if (minPrice !== null && !isNaN(minPrice)) {
      results = results.filter(g => g.startingPrice !== null && g.startingPrice >= minPrice);
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      results = results.filter(g => g.startingPrice !== null && g.startingPrice <= maxPrice);
    }

    // Max distance filter
    if (maxDistance !== null && !isNaN(maxDistance)) {
      results = results.filter(g => g.distance !== null && g.distance <= maxDistance);
    }

    // Sorting
    if (sort === 'nearest') {
      results.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    } else if (sort === 'price-low') {
      results.sort((a, b) => {
        const pA = a.startingPrice || 999999;
        const pB = b.startingPrice || 999999;
        return pA - pB;
      });
    } else if (sort === 'price-high') {
      results.sort((a, b) => {
        const pA = a.startingPrice || -1;
        const pB = b.startingPrice || -1;
        return pB - pA;
      });
    } else if (sort === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return sendJson(res, 200, {
      total: results.length,
      userLocationActive: Boolean(userLat && userLng),
      gyms: results
    });
  }

  // GET /api/gyms/:id
  const gymDetailMatch = pathname.match(/^\/api\/gyms\/([a-zA-Z0-9_-]+)$/);
  if (gymDetailMatch && method === 'GET') {
    const gymId = gymDetailMatch[1];
    const gym = registeredGyms.find(g => g.id === gymId);
    if (!gym) {
      return sendJson(res, 404, { error: 'Gym listing not found' });
    }
    return sendJson(res, 200, gym);
  }

  // POST /api/trials - Request or book a trial pass
  if (pathname === '/api/trials' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { gymId, gymName, customerName, phone, email, date, timeSlot } = body;

      if (!customerName || !phone || !gymId) {
        return sendJson(res, 400, {
          error: 'Please provide full name, contact phone number, and selected gym.'
        });
      }

      // Format validation
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        return sendJson(res, 400, {
          error: 'Please enter a valid 10-digit Indian phone number.'
        });
      }

      const bookingRef = 'NOIDA-TRIAL-' + Math.floor(100000 + Math.random() * 900000);
      const newTrial = {
        id: bookingRef,
        gymId,
        gymName: gymName || 'Noida Partner Gym',
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: (email || '').trim(),
        date: date || new Date().toISOString().split('T')[0],
        timeSlot: timeSlot || 'Morning (8:00 AM - 10:00 AM)',
        status: 'Confirmed Pass (Demo)',
        createdAt: new Date().toISOString(),
        instructions: 'Please show this pass reference code at the gym reception with a valid photo ID (Aadhaar/Driving License) and sports shoes.'
      };

      trialBookings.unshift(newTrial);
      return sendJson(res, 201, {
        success: true,
        message: 'Trial pass successfully issued!',
        booking: newTrial
      });
    } catch (err) {
      return sendJson(res, 400, { error: err.message || 'Invalid trial request' });
    }
  }

  // POST /api/memberships - Join gym / demo checkout
  if (pathname === '/api/memberships' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const {
        gymId,
        gymName,
        planId,
        planName,
        planDuration,
        totalAmount,
        customerName,
        phone,
        email,
        startDate,
        paymentMode
      } = body;

      if (!customerName || !phone || !gymId || !planId) {
        return sendJson(res, 400, {
          error: 'Please fill out required customer information and select a membership plan.'
        });
      }

      const membershipRef = 'NOIDA-MEM-' + Math.floor(100000 + Math.random() * 900000);
      const newMembership = {
        id: membershipRef,
        gymId,
        gymName: gymName || 'Noida Partner Gym',
        planId,
        planName: planName || 'Standard Membership',
        planDuration: planDuration || '1 Month',
        totalAmount: totalAmount || 0,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: (email || '').trim(),
        startDate: startDate || new Date().toISOString().split('T')[0],
        paymentMode: paymentMode || 'Demo Payment (Simulated)',
        paymentStatus: 'Paid (Demo Gateway)',
        createdAt: new Date().toISOString(),
        supportContact: 'support@noidagym.demo.in'
      };

      membershipBookings.unshift(newMembership);
      return sendJson(res, 201, {
        success: true,
        message: 'Membership request confirmed! Voucher generated.',
        membership: newMembership
      });
    } catch (err) {
      return sendJson(res, 400, { error: err.message || 'Invalid membership submission' });
    }
  }

  // POST /api/gym-onboarding - "List your gym" submission
  if (pathname === '/api/gym-onboarding' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const {
        gymName,
        sector,
        address,
        landmark,
        contactName,
        contactPhone,
        contactEmail,
        facilities,
        weekdayHours,
        weekendHours,
        is24Hours,
        womenOnlyTimings,
        monthlyStartingPrice,
        trialAvailable
      } = body;

      if (!gymName || !sector || !address || !contactName || !contactPhone) {
        return sendJson(res, 400, {
          error: 'Please provide Gym Name, Sector, Full Address, Contact Name, and Phone Number.'
        });
      }

      const submissionId = 'GYM-REG-' + Math.floor(100000 + Math.random() * 900000);
      const slug = gymName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const newListing = {
        id: `${slug}-${submissionId.toLowerCase()}`,
        submissionId,
        name: gymName.trim(),
        tagline: 'Newly submitted gym listing awaiting verification',
        type: 'Independent Gym',
        sector: sector.trim(),
        sectorId: sector.toLowerCase().replace(/\s+/g, '-'),
        landmark: (landmark || '').trim(),
        address: address.trim(),
        coordinates: { lat: 28.5355, lng: 77.3644 }, // default Noida midpoint coords
        rating: 5.0,
        reviewCount: 0,
        isSample: true,
        isPartner: false,
        statusBadge: 'Under Verification',
        startingPrice: monthlyStartingPrice ? parseInt(monthlyStartingPrice, 10) : null,
        hasPriceOnContact: !monthlyStartingPrice,
        trialAvailable: Boolean(trialAvailable),
        trialType: trialAvailable ? 'Trial on Request' : 'No Free Trial',
        trialFee: 0,
        dayPassFee: null,
        openingHours: {
          weekday: weekdayHours || '6:00 AM - 10:00 PM',
          weekend: weekendHours || '7:00 AM - 9:00 PM',
          is24Hours: Boolean(is24Hours),
          womenOnlyTimings: womenOnlyTimings || 'None'
        },
        images: [
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'
        ],
        facilities: Array.isArray(facilities) && facilities.length ? facilities : ['General Fitness Equipment', 'Locker & Changing Area'],
        facilityTags: Array.isArray(facilities) ? facilities.map(f => f.toLowerCase().replace(/[^a-z0-9]/g, '-')) : ['strength'],
        classes: ['General Fitness Training'],
        plans: [
          {
            id: `plan-${submissionId}`,
            name: 'Standard Monthly Membership',
            duration: '1 Month',
            months: 1,
            basePrice: monthlyStartingPrice ? parseInt(monthlyStartingPrice, 10) : 2500,
            gstRate: 0.18,
            joiningFee: 0,
            totalPrice: monthlyStartingPrice ? Math.round(parseInt(monthlyStartingPrice, 10) * 1.18) : 2950,
            features: ['Full gym access', 'Locker facilities', 'Basic trainer orientation'],
            pausePolicy: 'As per gym policy',
            refundPolicy: 'Subject to gym terms'
          }
        ],
        equipment: ['Standard cardio and strength line'],
        contact: {
          phone: contactPhone.trim(),
          email: (contactEmail || '').trim(),
          manager: contactName.trim()
        },
        description: `Owner submitted gym located at ${address}, ${sector}, Noida. Onboarding verification pending.`,
        submittedAt: new Date().toISOString()
      };

      ownerSubmissions.unshift(newListing);
      // Also add to active listing for instant MVP visual feedback
      registeredGyms.unshift(newListing);

      return sendJson(res, 201, {
        success: true,
        submissionId,
        message: 'Gym listing submitted successfully! Our Noida operations team will contact you within 24-48 hours.',
        previewGym: newListing
      });
    } catch (err) {
      return sendJson(res, 400, { error: err.message || 'Onboarding submission failed' });
    }
  }

  // If requesting an unknown /api/* route, return JSON 404 instead of falling back to static files
  if (pathname.startsWith('/api')) {
    return sendJson(res, 404, {
      error: 'Not Found',
      message: `The API endpoint ${method} ${pathname} does not exist.`
    });
  }

  // --- STATIC FILE SERVING WITH SPA FALLBACK ---

  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const activePublicDir = resolvePublicDir();
  let filePath = path.join(activePublicDir, safePath === '/' ? 'index.html' : safePath);

  return new Promise(resolve => {
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        stream.on('end', () => resolve());
        stream.on('error', streamErr => {
          console.error('[NoidaGym Server] Error streaming static file:', filePath, streamErr.message);
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('500 Internal Server Error');
          } else {
            res.end();
          }
          resolve();
        });
        return;
      }

      // Check root directory fallback if file was mirrored or deployed to root
      const rootCandidate = path.join(process.cwd(), safePath === '/' ? 'index.html' : safePath);
      if (rootCandidate !== filePath && fs.existsSync(rootCandidate)) {
        try {
          const statsRoot = fs.statSync(rootCandidate);
          if (statsRoot.isFile()) {
            const ext = path.extname(rootCandidate).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            const stream = fs.createReadStream(rootCandidate);
            stream.pipe(res);
            stream.on('end', () => resolve());
            stream.on('error', streamErr => {
              console.error('[NoidaGym Server] Error streaming root file:', rootCandidate, streamErr.message);
              if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Internal Server Error');
              } else {
                res.end();
              }
              resolve();
            });
            return;
          }
        } catch (e) {
          // Fall through to SPA fallback
        }
      }

      // SPA fallback: return index.html for client-side routing
      const indexCandidates = [
        path.join(activePublicDir, 'index.html'),
        path.join(__dirname, 'public', 'index.html'),
        path.join(process.cwd(), 'public', 'index.html'),
        path.join(process.cwd(), 'index.html'),
        path.join(__dirname, 'index.html')
      ];

      let chosenIndexPath = null;
      for (const cand of indexCandidates) {
        if (fs.existsSync(cand)) {
          chosenIndexPath = cand;
          break;
        }
      }

      if (!chosenIndexPath) {
        console.error('[NoidaGym Server] 404: Neither requested file nor index.html could be found. Attempted paths:', indexCandidates);
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found - NoidaGym Platform');
        resolve();
        return;
      }

      fs.readFile(chosenIndexPath, (readErr, content) => {
        if (readErr) {
          console.error('[NoidaGym Server] Error reading index.html from:', chosenIndexPath, readErr.message);
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Internal Server Error - NoidaGym Platform');
          resolve();
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
        resolve();
      });
    });
  });
}

// Create server instance
const server = http.createServer(handleRequest);

// Export request handler for Vercel Serverless Functions
module.exports = handleRequest;
module.exports.server = server;
module.exports.default = handleRequest;

// Only bind to network port when executed directly as standalone script (e.g. node server.js)
if (require.main === module) {
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[NoidaGym Server Error] Port ${PORT} is already in use by another application or server instance.`);
      console.error(`To run on another port, set the PORT environment variable. Example:\n  $env:PORT=3001; node server.js\n  or set PORT=3001 && node server.js\n`);
      process.exit(1);
    } else {
      console.error('[NoidaGym Server Error]', err);
    }
  });

  const HOST = process.env.HOST;
  const listenArgs = HOST ? [PORT, HOST] : [PORT];

  server.listen(...listenArgs, () => {
    const displayHost = HOST || 'localhost';
    console.log(`[NoidaGym Server] Online at http://${displayHost}:${PORT}`);
    console.log(`[NoidaGym Server] Running in Noida marketplace mode with ${registeredGyms.length} initial gyms`);
  });

  // Process signal & error handling
  process.on('uncaughtException', err => console.error('[Uncaught]', err));
  process.on('unhandledRejection', reason => console.error('[UnhandledRejection]', reason));
  process.on('SIGTERM', () => {
    console.log('[NoidaGym Server] Received SIGTERM');
    server.close();
  });
  process.on('SIGINT', () => {
    console.log('[NoidaGym Server] Received SIGINT');
    server.close();
  });
}
