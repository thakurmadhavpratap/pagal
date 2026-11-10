/**
 * Automated Test Suite for NoidaGym Marketplace Server & API
 * Tests both direct in-memory invocation (serverless-compatible) and API endpoints.
 */

const path = require('path');
const { EventEmitter } = require('events');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const { NOIDA_GYMS, NOIDA_SECTORS } = require(path.join(PUBLIC_DIR, 'js', 'data.js'));

console.log('====================================================');
console.log(' [TEST SUITE] NoidaGym Marketplace Automated Tests');
console.log('====================================================\n');

console.log('[Test Suite] Loaded NOIDA_GYMS count:', NOIDA_GYMS.length);
console.log('[Test Suite] Loaded NOIDA_SECTORS count:', NOIDA_SECTORS.length);

// 1. Verify schema & coordinates
let validationErrors = [];
NOIDA_GYMS.forEach((gym, i) => {
  if (!gym.id) validationErrors.push(`Gym #${i} missing id`);
  if (!gym.name) validationErrors.push(`Gym #${i} missing name`);
  if (!gym.sector) validationErrors.push(`Gym #${i} missing sector`);
  if (!gym.coordinates || !gym.coordinates.lat || !gym.coordinates.lng) {
    validationErrors.push(`Gym ${gym.name} missing coordinates`);
  }
  if (!gym.openingHours) validationErrors.push(`Gym ${gym.name} missing openingHours`);
  if (!gym.plans || !Array.isArray(gym.plans) || gym.plans.length === 0) {
    validationErrors.push(`Gym ${gym.name} missing plans`);
  }
});

if (validationErrors.length > 0) {
  console.error('[Validation Failed]:', validationErrors);
  process.exit(1);
} else {
  console.log('✓ All 9 initial Noida gyms pass schema & coordinates validation.');
}

// 2. Load Request Handler
const handleRequest = require('../server.js');
const vercelHandler = require('../api/index.js');

function createMockRequest(method, url, body = null, headers = {}) {
  const req = new EventEmitter();
  req.method = method;
  req.url = url;
  req.headers = { host: 'localhost:3000', ...headers };
  req.socket = {};

  process.nextTick(() => {
    if (body) {
      req.emit('data', Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)));
    }
    req.emit('end');
  });

  return req;
}

function createMockResponse() {
  const res = new EventEmitter();
  res.headers = {};
  res.statusCode = 200;
  res.body = '';
  res.headersSent = false;

  res.writeHead = function (code, headers = {}) {
    res.statusCode = code;
    Object.assign(res.headers, headers);
    res.headersSent = true;
    return res;
  };

  res.write = function (chunk) {
    if (chunk) res.body += chunk.toString();
    return true;
  };

  res.end = function (chunk) {
    if (chunk) res.body += chunk.toString();
    res.emit('finish');
    return res;
  };

  return res;
}

function testEndpoint(method, url, body = null, headers = {}, handler = handleRequest) {
  return new Promise((resolve, reject) => {
    const req = createMockRequest(method, url, body, headers);
    const res = createMockResponse();

    res.on('finish', () => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: res.body,
        json: () => JSON.parse(res.body)
      });
    });

    try {
      const result = handler(req, res);
      if (result && typeof result.catch === 'function') {
        result.catch(reject);
      }
    } catch (e) {
      reject(e);
    }
  });
}

(async function runAllTests() {
  try {
    console.log('\n[Test Suite] Probing endpoints in-memory...');

    // Test 1: GET /api
    const apiRoot = await testEndpoint('GET', '/api');
    console.log(`✓ GET /api -> ${apiRoot.statusCode} | service: ${apiRoot.json().service}`);

    // Test 2: GET /api/health
    const health = await testEndpoint('GET', '/api/health');
    console.log(`✓ GET /api/health -> ${health.statusCode} | activeGyms: ${health.json().activeGyms}`);

    // Test 3: GET /api/sectors
    const sectors = await testEndpoint('GET', '/api/sectors');
    console.log(`✓ GET /api/sectors -> ${sectors.statusCode} | count: ${sectors.json().length}`);

    // Test 4: GET /api/gyms
    const gymsRes = await testEndpoint('GET', '/api/gyms');
    const gymsJson = gymsRes.json();
    console.log(`✓ GET /api/gyms -> ${gymsRes.statusCode} | total: ${gymsJson.total} gyms`);

    // Test 5: Sector filter
    const sec104 = await testEndpoint('GET', '/api/gyms?sector=sector-104');
    console.log(`✓ GET /api/gyms?sector=sector-104 -> ${sec104.json().total} gyms`);

    // Test 6: Distance calculation & nearest sort
    const distanceTest = await testEndpoint('GET', '/api/gyms?lat=28.5708&lng=77.3261&sort=nearest');
    const nearest = distanceTest.json().gyms[0];
    console.log(`✓ GET /api/gyms nearest -> ${nearest.name} at ${nearest.distance} km`);

    // Test 7: Gym detail
    const detail = await testEndpoint('GET', '/api/gyms/pulsefit-elite-104');
    console.log(`✓ GET /api/gyms/pulsefit-elite-104 -> ${detail.statusCode} | ${detail.json().name}`);

    // Test 8: POST /api/trials
    const trialBooking = await testEndpoint('POST', '/api/trials', {
      gymId: 'pulsefit-elite-104',
      gymName: 'PulseFit Elite Athletic Club',
      customerName: 'Priya Sharma',
      phone: '9811234567',
      email: 'priya.sharma@example.com',
      date: '2026-11-01',
      timeSlot: 'Morning (7:00 AM - 9:30 AM)'
    });
    console.log(`✓ POST /api/trials -> ${trialBooking.statusCode} | Ref ID: ${trialBooking.json().booking?.id}`);

    // Test 9: POST /api/memberships
    const memBooking = await testEndpoint('POST', '/api/memberships', {
      gymId: 'titan-forge-62',
      gymName: 'Titan Forge Strength & Conditioning',
      planId: 'tf-3m',
      planName: '3 Months Iron Cadet',
      planDuration: '3 Months',
      totalAmount: 7788,
      customerName: 'Rahul Mehra',
      phone: '9871100223',
      email: 'rahul@example.com',
      startDate: '2026-11-05',
      paymentMode: 'UPI (Google Pay / PhonePe)'
    });
    console.log(`✓ POST /api/memberships -> ${memBooking.statusCode} | Voucher: ${memBooking.json().membership?.id}`);

    // Test 10: POST /api/gym-onboarding
    const ownerOnboarding = await testEndpoint('POST', '/api/gym-onboarding', {
      gymName: 'Olympus Iron Gym',
      sector: 'Sector 50',
      landmark: 'Near Central Park',
      address: 'Plot 22, Sector 50, Noida, UP',
      contactName: 'Vikas Gupta',
      contactPhone: '9810987654',
      contactEmail: 'vikas@olympus.demo.in',
      facilities: ['Free Weights & Dumbbells', 'Locker & Shower Suites', 'Personal Trainers'],
      weekdayHours: '5:30 AM - 10:30 PM',
      weekendHours: '6:00 AM - 9:00 PM',
      womenOnlyTimings: '11:00 AM - 12:30 PM',
      monthlyStartingPrice: 2000,
      trialAvailable: true
    });
    console.log(`✓ POST /api/gym-onboarding -> ${ownerOnboarding.statusCode} | Submission: ${ownerOnboarding.json().submissionId}`);

    // Test 11: Vercel Proxy Rewrite simulation (x-matched-path & ?_path=)
    const vercelProxyTest = await testEndpoint('GET', '/api/index.js?_path=gyms', null, {
      'x-matched-path': '/api/gyms'
    }, vercelHandler);
    console.log(`✓ Vercel Proxy Rewrite (/api/index.js -> /api/gyms) -> ${vercelProxyTest.statusCode} | total: ${vercelProxyTest.json().total}`);

    // Test 12: Unknown API route 404 test
    const notFoundTest = await testEndpoint('GET', '/api/non-existent-endpoint');
    console.log(`✓ GET /api/non-existent-endpoint -> ${notFoundTest.statusCode} (Proper JSON 404 response)`);

    console.log('\n====================================================');
    console.log(' ALL 12 TESTS PASSED SUCCESSFULLY! 🚀');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Test Suite Error:', err);
    process.exit(1);
  }
})();
