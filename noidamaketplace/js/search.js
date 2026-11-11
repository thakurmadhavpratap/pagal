/**
 * NoidaGym Marketplace - Search, Filter & Discovery Engine
 */

window.NoidaSearch = (function () {
  let allGyms = [];
  let currentResults = [];
  let currentView = 'list'; // 'list' or 'map'

  const filters = {
    q: '',
    sector: 'all',
    maxDistance: null,
    minPrice: null,
    maxPrice: null,
    facilities: [],
    open24: false,
    womenOnly: false,
    sort: 'recommended'
  };

  function init(gyms) {
    allGyms = gyms || [];
    bindEvents();
    renderSectorPills();
    applyFiltersAndRender();
  }

  function setGyms(gyms) {
    allGyms = gyms || [];
    applyFiltersAndRender();
  }

  function bindEvents() {
    // Main search input
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
      input.addEventListener('input', e => {
        filters.q = e.target.value.trim().toLowerCase();
        // Sync any other search inputs
        searchInputs.forEach(other => {
          if (other !== input) other.value = e.target.value;
        });
        applyFiltersAndRender();
      });
    });

    // Sector dropdown in hero search
    const sectorSelects = document.querySelectorAll('.sector-dropdown');
    sectorSelects.forEach(select => {
      select.addEventListener('change', e => {
        filters.sector = e.target.value;
        updateSectorPillsActive();
        applyFiltersAndRender();
      });
    });

    // Location button
    const locationBtns = document.querySelectorAll('.location-btn');
    locationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (NoidaLocation.getUserCoordinates()) {
          // Toggle off
          NoidaLocation.clearUserLocation();
          showToast('Location disabled. Showing all Noida gyms.');
          applyFiltersAndRender();
        } else {
          NoidaLocation.requestUserLocation(
            coords => {
              showToast('Location enabled! Showing gyms nearest to you in Noida.');
              filters.sort = 'nearest';
              const sortSelect = document.getElementById('sort-select');
              if (sortSelect) sortSelect.value = 'nearest';
              applyFiltersAndRender();
            },
            err => {
              showToast(err, true);
            }
          );
        }
      });
    });

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', e => {
        filters.sort = e.target.value;
        applyFiltersAndRender();
      });
    }

    // View toggles (List vs Map)
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        switchView(view);
      });
    });

    // Filter checkboxes in sidebar and mobile sheet
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const key = cb.getAttribute('data-filter-key');
        const val = cb.getAttribute('data-filter-val');

        if (key === 'facility') {
          if (cb.checked) {
            if (!filters.facilities.includes(val)) filters.facilities.push(val);
          } else {
            filters.facilities = filters.facilities.filter(f => f !== val);
          }
        } else if (key === 'open24') {
          filters.open24 = cb.checked;
        } else if (key === 'womenOnly') {
          filters.womenOnly = cb.checked;
        }
        applyFiltersAndRender();
      });
    });

    // Price radio/select filters
    document.querySelectorAll('.price-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.price-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const max = btn.getAttribute('data-max');
        filters.maxPrice = max ? parseInt(max, 10) : null;
        applyFiltersAndRender();
      });
    });

    // Distance filter
    const distanceSelect = document.getElementById('filter-distance-select');
    if (distanceSelect) {
      distanceSelect.addEventListener('change', e => {
        const val = e.target.value;
        filters.maxDistance = val ? parseFloat(val) : null;
        if (filters.maxDistance && !NoidaLocation.getUserCoordinates()) {
          // Prompt for location if not yet granted
          NoidaLocation.requestUserLocation(
            () => applyFiltersAndRender(),
            () => {
              showToast('Location required to filter by distance radius.', true);
              distanceSelect.value = '';
              filters.maxDistance = null;
              applyFiltersAndRender();
            }
          );
        } else {
          applyFiltersAndRender();
        }
      });
    }

    // Clear filters button
    document.querySelectorAll('.clear-filters-btn').forEach(btn => {
      btn.addEventListener('click', resetFilters);
    });

    // Mobile filter drawer open/close
    const openMobileFilterBtn = document.getElementById('open-mobile-filter-btn');
    const closeMobileFilterBtn = document.getElementById('close-mobile-filter-btn');
    const mobileFilterDrawer = document.getElementById('mobile-filter-drawer');

    if (openMobileFilterBtn && mobileFilterDrawer) {
      openMobileFilterBtn.addEventListener('click', () => {
        mobileFilterDrawer.classList.add('open');
      });
    }
    if (closeMobileFilterBtn && mobileFilterDrawer) {
      closeMobileFilterBtn.addEventListener('click', () => {
        mobileFilterDrawer.classList.remove('open');
      });
    }
    if (mobileFilterDrawer) {
      mobileFilterDrawer.addEventListener('click', e => {
        if (e.target === mobileFilterDrawer) {
          mobileFilterDrawer.classList.remove('open');
        }
      });
    }
  }

  function resetFilters() {
    filters.q = '';
    filters.sector = 'all';
    filters.maxDistance = null;
    filters.minPrice = null;
    filters.maxPrice = null;
    filters.facilities = [];
    filters.open24 = false;
    filters.womenOnly = false;
    filters.sort = 'recommended';

    // Reset inputs
    document.querySelectorAll('.search-input').forEach(i => (i.value = ''));
    document.querySelectorAll('.sector-dropdown').forEach(s => (s.value = 'all'));
    document.querySelectorAll('.filter-checkbox').forEach(cb => (cb.checked = false));
    document.querySelectorAll('.price-filter-btn').forEach(b => b.classList.remove('active'));
    const allPriceBtn = document.querySelector('.price-filter-btn[data-max=""]');
    if (allPriceBtn) allPriceBtn.classList.add('active');

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'recommended';

    const distSelect = document.getElementById('filter-distance-select');
    if (distSelect) distSelect.value = '';

    updateSectorPillsActive();
    applyFiltersAndRender();
    showToast('Filters cleared');
  }

  function renderSectorPills() {
    const container = document.getElementById('sector-pills-container');
    if (!container) return;

    container.innerHTML = NOIDA_SECTORS.map(sec => {
      const activeClass = filters.sector === sec.id ? 'active' : '';
      return `
        <button class="sector-chip ${activeClass}" data-sector-id="${sec.id}">
          ${sec.name}
        </button>
      `;
    }).join('');

    container.querySelectorAll('.sector-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const secId = chip.getAttribute('data-sector-id');
        filters.sector = secId;
        updateSectorPillsActive();
        // Sync select dropdown
        document.querySelectorAll('.sector-dropdown').forEach(s => (s.value = secId));
        applyFiltersAndRender();
      });
    });
  }

  function updateSectorPillsActive() {
    document.querySelectorAll('.sector-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-sector-id') === filters.sector);
    });
  }

  function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });

    const gridContainer = document.getElementById('gym-grid-container');
    const mapContainer = document.getElementById('map-view-container');

    if (view === 'map') {
      if (gridContainer) gridContainer.style.display = 'none';
      if (mapContainer) {
        mapContainer.classList.add('active');
        if (window.NoidaMap) window.NoidaMap.render(currentResults);
      }
    } else {
      if (gridContainer) gridContainer.style.display = 'grid';
      if (mapContainer) mapContainer.classList.remove('active');
    }
  }

  function applyFiltersAndRender() {
    const userCoords = NoidaLocation.getUserCoordinates();

    // 1. Calculate distance for every gym
    let results = allGyms.map(gym => {
      let distance = null;
      if (userCoords && gym.coordinates) {
        distance = NoidaLocation.getDistanceInKm(
          userCoords.lat,
          userCoords.lng,
          gym.coordinates.lat,
          gym.coordinates.lng
        );
      }
      return { ...gym, distance };
    });

    // 2. Query filter
    if (filters.q) {
      const q = filters.q;
      results = results.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.sector.toLowerCase().includes(q) ||
        g.landmark.toLowerCase().includes(q) ||
        g.address.toLowerCase().includes(q) ||
        (g.facilities && g.facilities.some(f => f.toLowerCase().includes(q))) ||
        (g.classes && g.classes.some(c => c.toLowerCase().includes(q)))
      );
    }

    // 3. Sector filter
    if (filters.sector && filters.sector !== 'all') {
      results = results.filter(g =>
        g.sectorId === filters.sector ||
        g.sector.toLowerCase().replace(/\s+/g, '-').includes(filters.sector)
      );
    }

    // 4. Facility tags filter
    if (filters.facilities.length > 0) {
      results = results.filter(g => {
        if (!g.facilityTags) return false;
        return filters.facilities.every(requiredTag => g.facilityTags.includes(requiredTag));
      });
    }

    // 5. 24-hours access
    if (filters.open24) {
      results = results.filter(g => g.openingHours && g.openingHours.is24Hours);
    }

    // 6. Women-only timings
    if (filters.womenOnly) {
      results = results.filter(g => g.facilityTags && g.facilityTags.includes('women-timings'));
    }

    // 7. Max price
    if (filters.maxPrice !== null) {
      results = results.filter(g => g.startingPrice !== null && g.startingPrice <= filters.maxPrice);
    }

    // 8. Max distance
    if (filters.maxDistance !== null && userCoords) {
      results = results.filter(g => g.distance !== null && g.distance <= filters.maxDistance);
    }

    // 9. Sorting
    if (filters.sort === 'nearest') {
      results.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    } else if (filters.sort === 'price-low') {
      results.sort((a, b) => {
        const pA = a.startingPrice || 999999;
        const pB = b.startingPrice || 999999;
        return pA - pB;
      });
    } else if (filters.sort === 'price-high') {
      results.sort((a, b) => {
        const pA = a.startingPrice || -1;
        const pB = b.startingPrice || -1;
        return pB - pA;
      });
    } else if (filters.sort === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    currentResults = results;
    renderResults(results);

    // If map view active, update pins
    if (currentView === 'map' && window.NoidaMap) {
      window.NoidaMap.render(results);
    }
  }

  function renderResults(gyms) {
    const gridContainer = document.getElementById('gym-grid-container');
    const countTitle = document.getElementById('results-count-title');
    const resultsMeta = document.getElementById('results-meta');

    if (countTitle) {
      const sectorLabel = NOIDA_SECTORS.find(s => s.id === filters.sector)?.name || 'All Noida';
      countTitle.textContent = `${gyms.length} Gyms Available in ${sectorLabel}`;
    }

    if (resultsMeta) {
      const userCoords = NoidaLocation.getUserCoordinates();
      if (userCoords) {
        resultsMeta.textContent = `Sorted by distance from your current location in Noida`;
      } else {
        resultsMeta.textContent = `Showing verified partner clubs & sample reference listings`;
      }
    }

    if (!gridContainer) return;

    if (gyms.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="font-size: 2.4rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">No gyms found matching your criteria</h3>
          <p style="color: var(--text-muted); max-width: 440px; margin: 0 auto 20px;">
            Try clearing some filters, increasing the distance radius, or searching across all Noida sectors.
          </p>
          <button class="btn btn-primary clear-filters-btn">Clear All Filters</button>
        </div>
      `;
      gridContainer.querySelectorAll('.clear-filters-btn').forEach(b => b.addEventListener('click', resetFilters));
      return;
    }

    const savedGymIds = window.NoidaAccount ? window.NoidaAccount.getSavedGymIds() : [];

    gridContainer.innerHTML = gyms.map(gym => {
      const isSaved = savedGymIds.includes(gym.id);
      const mainImg = gym.images && gym.images[0] ? gym.images[0] : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';

      const distanceBadge = gym.distance !== null
        ? `<span class="distance-tag">${gym.distance} km away</span>`
        : '';

      const priceDisplay = gym.startingPrice
        ? `
          <div class="price-block">
            <span class="price-label">Starts at</span>
            <span class="price-amount">₹${gym.startingPrice.toLocaleString('en-IN')}</span>
            <span class="price-sub">/ month + GST</span>
          </div>
        `
        : `
          <div class="price-block">
            <span class="price-label">Pricing</span>
            <span class="price-amount" style="font-size: 0.98rem; font-weight: 600;">Contact gym for price</span>
            <span class="price-sub">Rack rate unverified</span>
          </div>
        `;

      const statusBadge = gym.isPartner
        ? `<span class="status-badge verified">Verified Partner</span>`
        : `<span class="status-badge demo">Demo Listing</span>`;

      const facilityPills = (gym.facilities || [])
        .slice(0, 3)
        .map(f => `<span class="facility-chip">${escapeHtml(f)}</span>`)
        .join('');

      const timingNote = gym.openingHours.is24Hours
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Open 24 Hours Daily`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${gym.openingHours.weekday}`;

      return `
        <article class="gym-card" data-gym-id="${gym.id}">
          <div class="card-media-wrap">
            <img class="card-img" src="${mainImg}" alt="${escapeHtml(gym.name)}" loading="lazy" />
            <div class="card-badges">
              ${statusBadge}
              <button class="save-btn ${isSaved ? 'saved' : ''}" data-gym-id="${gym.id}" title="${isSaved ? 'Remove from saved' : 'Save this gym'}" aria-label="Save gym">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="card-body">
            <div class="card-header-row">
              <h3 class="card-title">${escapeHtml(gym.name)}</h3>
              <div class="rating-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#EAB308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>${gym.rating.toFixed(1)}</span>
                <span style="font-weight: normal; color: var(--text-muted); font-size: 0.75rem;">(${gym.reviewCount})</span>
              </div>
            </div>

            <div class="card-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${escapeHtml(gym.sector)} • ${escapeHtml(gym.landmark || 'Noida')}</span>
              ${distanceBadge}
            </div>

            <div class="card-facilities">
              ${facilityPills}
            </div>

            <div class="card-timings-note">
              ${timingNote}
            </div>

            <div class="card-footer">
              ${priceDisplay}
              <div class="card-actions">
                <button class="btn btn-secondary btn-sm view-details-btn" data-gym-id="${gym.id}">
                  Details
                </button>
                <button class="btn btn-primary btn-sm book-trial-btn" data-gym-id="${gym.id}">
                  ${gym.trialAvailable ? 'Free Trial' : 'Join'}
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach event listeners to card buttons
    gridContainer.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const gymId = btn.getAttribute('data-gym-id');
        window.NoidaApp.navigateTo('gym-detail', { id: gymId });
      });
    });

    gridContainer.querySelectorAll('.book-trial-btn').forEach(btn => {
      e => {
        e.stopPropagation();
      }
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const gymId = btn.getAttribute('data-gym-id');
        const gym = allGyms.find(g => g.id === gymId);
        if (gym && window.NoidaCheckout) {
          window.NoidaCheckout.openTrialBookingModal(gym);
        }
      });
    });

    gridContainer.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const gymId = btn.getAttribute('data-gym-id');
        if (window.NoidaAccount) {
          const newState = window.NoidaAccount.toggleSaveGym(gymId);
          btn.classList.toggle('saved', newState);
          btn.setAttribute('fill', newState ? 'currentColor' : 'none');
          btn.querySelector('svg').setAttribute('fill', newState ? 'currentColor' : 'none');
          showToast(newState ? 'Gym saved to your favorites!' : 'Removed from saved gyms.');
        }
      });
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

  function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) {
      toast.style.borderLeftColor = 'var(--status-error-text)';
    }
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3500);
  }

  return {
    init,
    setGyms,
    applyFiltersAndRender,
    showToast,
    resetFilters
  };
})();
