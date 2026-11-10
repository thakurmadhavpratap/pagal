/**
 * NoidaGym Marketplace - Interactive Noida Map Component
 * Renders an interactive vector map of Noida sectors with dynamic pins,
 * popups, distance indicators, and direct navigation links.
 */

window.NoidaMap = (function () {
  let activeGyms = [];
  let selectedGymId = null;

  // Geographic bounds of Noida
  // Lat: 28.43 to 28.65, Lng: 77.28 to 77.48
  const MAP_BOUNDS = {
    minLat: 28.43,
    maxLat: 28.65,
    minLng: 77.29,
    maxLng: 77.47
  };

  function projectToSvg(lat, lng, width = 800, height = 550) {
    const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * (width - 100) + 50;
    // Invert Y because latitude increases northward (up) while SVG y increases downward
    const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * (height - 100) + 50;
    return { x: Math.round(x), y: Math.round(y) };
  }

  function render(gyms) {
    activeGyms = gyms || [];
    const container = document.getElementById('map-view-container');
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = 580;

    // Build Sector Region Shapes and Labels
    const sectorLabels = [
      { id: 'sec-62', name: 'Sec 62 (Electronic City)', lat: 28.6271, lng: 77.3629 },
      { id: 'sec-18', name: 'Sec 18 (Atta/Metro)', lat: 28.5708, lng: 77.3261 },
      { id: 'sec-38', name: 'Sec 38A (GIP Mall)', lat: 28.5672, lng: 77.3245 },
      { id: 'sec-50', name: 'Sec 50 (Central)', lat: 28.5750, lng: 77.3680 },
      { id: 'sec-76', name: 'Sec 76 (Metro Corridor)', lat: 28.5650, lng: 77.3850 },
      { id: 'sec-104', name: 'Sec 104 (Expressway)', lat: 28.5355, lng: 77.3644 },
      { id: 'sec-127', name: 'Sec 127 (Tech Boulevard)', lat: 28.5147, lng: 77.3820 },
      { id: 'sec-153', name: 'Sec 153 (Exp. Link)', lat: 28.4520, lng: 77.4480 }
    ];

    // Build Pins for active gyms
    const pinsHtml = activeGyms.map(gym => {
      if (!gym.coordinates) return '';
      const pt = projectToSvg(gym.coordinates.lat, gym.coordinates.lng, width, height);
      const isSelected = gym.id === selectedGymId;
      const fillColor = isSelected ? 'var(--accent-lime)' : '#202522';
      const strokeColor = isSelected ? '#151816' : '#B7F34A';

      return `
        <g class="map-gym-pin" data-gym-id="${gym.id}" style="cursor: pointer;" transform="translate(${pt.x}, ${pt.y})">
          <circle r="${isSelected ? 16 : 12}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
          <path d="M-4 -3 L-2 -3 L-2 3 L-4 3 Z M-1 -1.5 L1 -1.5 L1 1.5 L-1 1.5 Z M2 -3 L4 -3 L4 3 L2 3 Z" fill="${isSelected ? '#151816' : '#FFFFFF'}" />
          <text y="-18" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text-primary)" style="text-shadow: 0 1px 3px rgba(0,0,0,0.6); pointer-events: none;">
            ${escapeHtml(gym.name.split(' ')[0])}
          </text>
        </g>
      `;
    }).join('');

    // Sector markers
    const sectorsHtml = sectorLabels.map(sec => {
      const pt = projectToSvg(sec.lat, sec.lng, width, height);
      return `
        <g class="map-sector-zone" transform="translate(${pt.x}, ${pt.y})">
          <circle r="28" fill="var(--bg-card-subtle)" stroke="var(--border-subtle)" stroke-dasharray="4 2" stroke-width="1.5" opacity="0.6" />
          <text y="38" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
            ${sec.name}
          </text>
        </g>
      `;
    }).join('');

    // Major Noida Road Artery: Noida-Greater Noida Expressway line
    const expStart = projectToSvg(28.5708, 77.3261, width, height);
    const expMid1 = projectToSvg(28.5355, 77.3644, width, height);
    const expMid2 = projectToSvg(28.5147, 77.3820, width, height);
    const expEnd = projectToSvg(28.4520, 77.4480, width, height);

    const expresswayPath = `M ${expStart.x} ${expStart.y} Q ${expMid1.x} ${expMid1.y} ${expMid2.x} ${expMid2.y} T ${expEnd.x} ${expEnd.y}`;

    // User location pin if active
    let userPinHtml = '';
    const userCoords = window.NoidaLocation ? window.NoidaLocation.getUserCoordinates() : null;
    if (userCoords) {
      const userPt = projectToSvg(userCoords.lat, userCoords.lng, width, height);
      userPinHtml = `
        <g transform="translate(${userPt.x}, ${userPt.y})">
          <circle r="18" fill="rgba(183, 243, 74, 0.25)">
            <animate attributeName="r" values="12;26;12" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="8" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2" />
          <text y="-14" text-anchor="middle" font-size="11" font-weight="700" fill="#3B82F6">Your Location</text>
        </g>
      `;
    }

    container.innerHTML = `
      <div style="position: absolute; top: 14px; left: 16px; z-index: 10; background: var(--bg-card); padding: 8px 14px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm); font-size: 0.85rem; font-weight: 600;">
        📍 Interactive Noida Map • <span style="color: var(--text-muted);">${activeGyms.length} gyms pinned</span>
      </div>

      <svg class="interactive-map-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="noidaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-subtle)" stroke-width="0.5" stroke-opacity="0.5" />
          </pattern>
        </defs>

        <!-- Background grid -->
        <rect width="${width}" height="${height}" fill="var(--bg-page)" />
        <rect width="${width}" height="${height}" fill="url(#noidaGrid)" />

        <!-- Noida expressway corridor -->
        <path d="${expresswayPath}" fill="none" stroke="var(--border-strong)" stroke-width="6" stroke-linecap="round" opacity="0.4" />
        <path d="${expresswayPath}" fill="none" stroke="var(--accent-lime)" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 4" opacity="0.8" />
        <text x="${(expMid1.x + expMid2.x) / 2 + 10}" y="${(expMid1.y + expMid2.y) / 2}" font-size="10" font-weight="700" fill="var(--text-muted)" transform="rotate(32, ${(expMid1.x + expMid2.x) / 2}, ${(expMid1.y + expMid2.y) / 2})">
          Noida - Gr. Noida Expressway
        </text>

        <!-- Sector clusters -->
        ${sectorsHtml}

        <!-- User Pin -->
        ${userPinHtml}

        <!-- Gym Pins -->
        ${pinsHtml}
      </svg>

      <div id="map-preview-popup" class="map-floating-card" style="display: none;"></div>
    `;

    // Attach pin click handlers
    container.querySelectorAll('.map-gym-pin').forEach(pinGroup => {
      pinGroup.addEventListener('click', () => {
        const gymId = pinGroup.getAttribute('data-gym-id');
        selectGym(gymId);
      });
    });

    // Auto-select first gym if none selected
    if (activeGyms.length > 0 && !selectedGymId) {
      selectGym(activeGyms[0].id);
    } else if (selectedGymId) {
      selectGym(selectedGymId);
    }
  }

  function selectGym(gymId) {
    selectedGymId = gymId;
    const gym = activeGyms.find(g => g.id === gymId);
    if (!gym) return;

    const popup = document.getElementById('map-preview-popup');
    if (!popup) return;

    popup.style.display = 'block';

    const priceText = gym.startingPrice
      ? `₹${gym.startingPrice.toLocaleString('en-IN')}/mo`
      : 'Contact for price';

    const distanceTag = gym.distance !== null
      ? `<span class="distance-tag">${gym.distance} km away</span>`
      : '';

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name + ' ' + gym.address)}`;

    popup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 8px;">
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 2px;">${escapeHtml(gym.name)}</h4>
          <p style="font-size: 0.82rem; color: var(--text-secondary);">${escapeHtml(gym.sector)} • ${escapeHtml(gym.landmark || 'Noida')}</p>
        </div>
        <button id="map-popup-close-btn" style="color: var(--text-muted); padding: 4px;">✕</button>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; font-size: 0.88rem;">
        <div>
          <strong>${priceText}</strong> • ⭐ ${gym.rating}
        </div>
        ${distanceTag}
      </div>

      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary btn-sm" id="map-popup-detail-btn" style="flex: 1;">
          View Details
        </button>
        <a class="btn btn-primary btn-sm" href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1;">
          Directions ↗
        </a>
      </div>
    `;

    document.getElementById('map-popup-close-btn').addEventListener('click', () => {
      popup.style.display = 'none';
      selectedGymId = null;
    });

    document.getElementById('map-popup-detail-btn').addEventListener('click', () => {
      window.NoidaApp.navigateTo('gym-detail', { id: gym.id });
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return {
    render,
    selectGym
  };
})();
