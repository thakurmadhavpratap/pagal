/**
 * NoidaGym Marketplace - Production Build & Validation Script
 * Prepares the project for deployment (Vercel, Node.js standalone, static hosting).
 * Zero external dependencies.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('====================================================');
console.log(' [BUILD] Starting NoidaGym Marketplace Production Build');
console.log('====================================================\n');

let hasErrors = false;

// Step 1: Validate Dataset Schema & Integrity
console.log('Step 1: Validating dataset integrity...');
try {
  const { NOIDA_GYMS, NOIDA_SECTORS, NOIDA_LANDMARKS } = require(path.join(PUBLIC_DIR, 'js', 'data.js'));

  if (!Array.isArray(NOIDA_GYMS) || NOIDA_GYMS.length === 0) {
    throw new Error('NOIDA_GYMS must be a non-empty array');
  }
  if (!Array.isArray(NOIDA_SECTORS) || NOIDA_SECTORS.length === 0) {
    throw new Error('NOIDA_SECTORS must be a non-empty array');
  }
  if (!NOIDA_LANDMARKS || typeof NOIDA_LANDMARKS !== 'object') {
    throw new Error('NOIDA_LANDMARKS must be a valid mapping object');
  }

  let invalidGyms = [];
  NOIDA_GYMS.forEach((g, i) => {
    if (!g.id || !g.name || !g.sector || !g.coordinates?.lat || !g.coordinates?.lng || !g.plans?.length) {
      invalidGyms.push(`Gym #${i} (${g.name || 'unnamed'}) failed validation`);
    }
  });

  if (invalidGyms.length > 0) {
    throw new Error(invalidGyms.join('; '));
  }

  console.log(`  ✓ Verified ${NOIDA_GYMS.length} curated Noida gyms and ${NOIDA_SECTORS.length} sector regions.`);
} catch (err) {
  console.error('  ✗ Dataset validation failed:', err.message);
  hasErrors = true;
}

// Step 2: Validate JavaScript syntax across all files
console.log('\nStep 2: Validating JavaScript syntax...');
const jsFilesToCheck = [
  'server.js',
  path.join('api', 'index.js'),
  path.join('public', 'js', 'app.js'),
  path.join('public', 'js', 'data.js'),
  path.join('public', 'js', 'search.js'),
  path.join('public', 'js', 'map.js'),
  path.join('public', 'js', 'gym-detail.js'),
  path.join('public', 'js', 'checkout.js'),
  path.join('public', 'js', 'list-gym.js'),
  path.join('public', 'js', 'account.js'),
  path.join('public', 'js', 'theme.js'),
  path.join('public', 'js', 'location.js')
];

jsFilesToCheck.forEach(relPath => {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (fs.existsSync(fullPath)) {
    try {
      execSync(`node -c "${fullPath}"`, { stdio: 'pipe' });
      console.log(`  ✓ Syntax OK: ${relPath}`);
    } catch (e) {
      console.error(`  ✗ Syntax Error in: ${relPath}`);
      hasErrors = true;
    }
  } else {
    console.error(`  ✗ Missing required file: ${relPath}`);
    hasErrors = true;
  }
});

// Step 3: Validate Vercel Deployment Configuration
console.log('\nStep 3: Validating Vercel deployment configuration...');
const vercelJsonPath = path.join(ROOT_DIR, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  try {
    const raw = fs.readFileSync(vercelJsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.rewrites || !Array.isArray(parsed.rewrites)) {
      throw new Error('vercel.json must specify rewrites array');
    }
    console.log(`  ✓ vercel.json is valid with ${parsed.rewrites.length} rewrite rules.`);
  } catch (err) {
    console.error('  ✗ vercel.json validation failed:', err.message);
    hasErrors = true;
  }
} else {
  console.error('  ✗ vercel.json is missing.');
  hasErrors = true;
}

// Step 4: Synchronize root-level static mirrors (for direct CDN root serving)
console.log('\nStep 4: Synchronizing distribution assets for multi-environment deployment...');
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  // Mirror index.html to root
  fs.copyFileSync(path.join(PUBLIC_DIR, 'index.html'), path.join(ROOT_DIR, 'index.html'));
  // Mirror css to root css
  copyRecursive(path.join(PUBLIC_DIR, 'css'), path.join(ROOT_DIR, 'css'));
  // Mirror js to root js
  copyRecursive(path.join(PUBLIC_DIR, 'js'), path.join(ROOT_DIR, 'js'));
  console.log('  ✓ Static assets mirrored to root for zero-config static hosting.');
} catch (err) {
  console.error('  ✗ Failed to mirror static assets:', err.message);
  hasErrors = true;
}

console.log('\n====================================================');
if (hasErrors) {
  console.error(' [BUILD FAILED] Please resolve the errors above.');
  console.log('====================================================');
  process.exit(1);
} else {
  console.log(' [BUILD SUCCESSFUL] NoidaGym Marketplace is ready for Vercel! 🚀');
  console.log('====================================================');
  process.exit(0);
}
