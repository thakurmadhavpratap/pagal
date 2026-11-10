/**
 * NoidaGym Marketplace - Gym Detail Page Component
 */

window.NoidaGymDetail = (function () {
  function render(gymId, allGyms) {
    const container = document.getElementById('gym-detail-container');
    if (!container) return;

    const gym = allGyms.find(g => g.id === gymId);
    if (!gym) {
      container.innerHTML = `
        <div class="container" style="padding: 60px 20px; text-align: center;">
          <h2>Gym listing not found</h2>
          <p style="color: var(--text-muted); margin: 12px 0 24px;">The selected gym could not be located in our Noida directory.</p>
          <button class="btn btn-primary" onclick="window.NoidaApp.navigateTo('home')">Return to Gyms Directory</button>
        </div>
      `;
      return;
    }

    const savedGymIds = window.NoidaAccount ? window.NoidaAccount.getSavedGymIds() : [];
    const isSaved = savedGymIds.includes(gym.id);

    // Photos
    const images = gym.images && gym.images.length ? gym.images : [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'
    ];
    const mainImg = images[0];
    const thumbImages = images.slice(1);

    const thumbsHtml = thumbImages.map((img, i) => `
      <img class="gallery-thumb-img" src="${img}" alt="${escapeHtml(gym.name)} photo ${i + 2}" loading="lazy" />
    `).join('');

    // Status & Disclaimer Banner
    let bannerHtml = '';
    if (gym.isPartner) {
      bannerHtml = `
        <div style="background-color: var(--status-verified-bg); color: var(--status-verified-text); border: 1px solid rgba(0,0,0,0.06); padding: 12px 18px; border-radius: var(--radius-md); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; font-size: 0.9rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div><strong>Verified NoidaGym Partner:</strong> Membership plans, free trial access, and instant vouchers are verified and fulfilled directly through this center.</div>
        </div>
      `;
    } else {
      bannerHtml = `
        <div style="background-color: var(--status-demo-bg); color: var(--status-demo-text); border: 1px solid rgba(0,0,0,0.08); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 24px; font-size: 0.9rem;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 4px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Demo Listing / Research Reference (Details to be confirmed)
          </div>
          <p style="margin: 0; line-height: 1.5;">${gym.disclaimer || 'This is an independent demo listing provided for comparison purposes. NoidaGym does not imply partnership with this facility. Rates, amenities, and timings must be confirmed directly with the center desk.'}</p>
        </div>
      `;
    }

    // Google Maps link
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name + ' ' + gym.address)}`;

    // Operating hours
    const hoursHtml = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.9rem;">
        <div>
          <span style="color: var(--text-muted); display: block; font-size: 0.8rem;">Weekdays (Mon - Fri)</span>
          <strong>${gym.openingHours.weekday}</strong>
        </div>
        <div>
          <span style="color: var(--text-muted); display: block; font-size: 0.8rem;">Weekends (Sat - Sun)</span>
          <strong>${gym.openingHours.weekend}</strong>
        </div>
      </div>
      ${gym.openingHours.womenOnlyTimings && gym.openingHours.womenOnlyTimings !== 'None' ? `
        <div style="margin-top: 14px; padding: 10px 14px; background: var(--bg-card-subtle); border-radius: var(--radius-sm); font-size: 0.85rem;">
          👩 <strong style="color: var(--text-primary);">Women-Only Timings:</strong> ${gym.openingHours.womenOnlyTimings}
        </div>
      ` : ''}
    `;

    // Amenities
    const amenitiesHtml = (gym.facilities || []).map(f => `
      <div class="amenity-item">
        <div class="amenity-icon-box">✓</div>
        <span>${escapeHtml(f)}</span>
      </div>
    `).join('');

    // Equipment
    const equipmentHtml = (gym.equipment || []).map(e => `
      <li style="margin-bottom: 8px; color: var(--text-secondary); font-size: 0.92rem; display: flex; gap: 8px;">
        <span style="color: var(--accent-lime); font-weight: 800;">•</span> ${escapeHtml(e)}
      </li>
    `).join('');

    // Classes
    const classesHtml = (gym.classes || []).map(c => `
      <span class="facility-chip" style="font-size: 0.85rem; padding: 6px 14px;">${escapeHtml(c)}</span>
    `).join('');

    // Plans
    const plansHtml = (gym.plans || []).map(plan => {
      const isContactOnly = plan.isContactOnly || plan.totalPrice === 0;

      const priceBlock = isContactOnly
        ? `<div class="plan-price-large" style="font-size: 1.3rem;">Contact Desk</div><div class="plan-tax-note">Rack rate confirmed on inquiry</div>`
        : `
          <div class="plan-price-large">₹${plan.totalPrice.toLocaleString('en-IN')}</div>
          <div class="plan-tax-note">₹${plan.basePrice.toLocaleString('en-IN')} base + 18% GST (₹${Math.round(plan.basePrice * 0.18).toLocaleString('en-IN')})</div>
        `;

      const featuresList = (plan.features || []).map(feat => `
        <li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${escapeHtml(feat)}</span>
        </li>
      `).join('');

      return `
        <div class="plan-card ${plan.popular ? 'popular' : ''}">
          ${plan.popular ? '<span class="popular-badge">Most Popular</span>' : ''}
          <h4 class="plan-name">${escapeHtml(plan.name)}</h4>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${plan.duration}</span>

          <div class="plan-price-row">
            ${priceBlock}
          </div>

          <ul class="plan-features-list">
            ${featuresList}
          </ul>

          <div class="plan-policy-box">
            <div><strong>Pause Policy:</strong> ${escapeHtml(plan.pausePolicy || 'N/A')}</div>
            <div style="margin-top: 4px;"><strong>Refund / Cancel:</strong> ${escapeHtml(plan.refundPolicy || 'Terms apply')}</div>
          </div>

          <button class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} select-plan-btn" data-plan-id="${plan.id}">
            ${isContactOnly ? 'Inquire for Plan' : 'Select This Plan'}
          </button>
        </div>
      `;
    }).join('');

    // User distance tag
    let userDistanceTag = '';
    const userCoords = window.NoidaLocation ? window.NoidaLocation.getUserCoordinates() : null;
    if (userCoords && gym.coordinates) {
      const dist = window.NoidaLocation.getDistanceInKm(userCoords.lat, userCoords.lng, gym.coordinates.lat, gym.coordinates.lng);
      userDistanceTag = `<span class="distance-tag" style="font-size: 0.85rem;">📍 ${dist} km from you</span>`;
    }

    container.innerHTML = `
      <div class="container gym-detail-view">
        <button class="back-link" id="detail-back-btn">
          ← Back to All Noida Gyms
        </button>

        <!-- Media Gallery -->
        <div class="gallery-grid">
          <img class="gallery-main-img" src="${mainImg}" alt="${escapeHtml(gym.name)}" />
          <div class="gallery-thumbs">
            ${thumbsHtml || `<img class="gallery-thumb-img" src="${mainImg}" alt="${escapeHtml(gym.name)}" />`}
          </div>
        </div>

        ${bannerHtml}

        <div class="detail-layout">
          <!-- Main Details -->
          <div class="detail-main">
            <div class="detail-header-block">
              <h1 class="detail-name">${escapeHtml(gym.name)}</h1>
              <p class="detail-tagline">${escapeHtml(gym.tagline)}</p>

              <div class="detail-badges-row">
                <span class="status-badge ${gym.isPartner ? 'verified' : 'demo'}">${gym.statusBadge}</span>
                <span style="font-size: 0.9rem; font-weight: 600;">⭐ ${gym.rating} (${gym.reviewCount} reviews)</span>
                <span style="color: var(--text-muted); font-size: 0.9rem;">• ${escapeHtml(gym.sector)}</span>
                ${userDistanceTag}
              </div>
            </div>

            <!-- Description -->
            <div class="section-block">
              <h3 class="section-title">About this Facility</h3>
              <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.98rem;">
                ${escapeHtml(gym.description)}
              </p>
            </div>

            <!-- Facilities & Amenities -->
            <div class="section-block">
              <h3 class="section-title">Amenities & Facilities</h3>
              <div class="amenities-grid">
                ${amenitiesHtml}
              </div>
            </div>

            <!-- Group Classes -->
            <div class="section-block">
              <h3 class="section-title">Group Fitness & Classes</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${classesHtml}
              </div>
            </div>

            <!-- Equipment Highlights -->
            <div class="section-block">
              <h3 class="section-title">Equipment Highlights</h3>
              <ul style="list-style: none;">
                ${equipmentHtml}
              </ul>
            </div>

            <!-- Membership Plans Comparison -->
            <div class="section-block" id="membership-plans-section">
              <h3 class="section-title">Membership Plans & Pricing</h3>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 8px;">
                Transparent pricing with no hidden charges. All plans include 18% GST and clearly outlined pause & cancellation terms.
              </p>
              <div class="plans-grid">
                ${plansHtml}
              </div>
            </div>
          </div>

          <!-- Sticky Sidebar -->
          <aside class="detail-sidebar">
            <div class="detail-sidebar-card">
              <div style="margin-bottom: 20px;">
                <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Starting from</span>
                <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary);">
                  ${gym.startingPrice ? `₹${gym.startingPrice.toLocaleString('en-IN')}` : 'Contact for price'}
                  <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ month</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
                ${gym.trialAvailable ? `
                  <button class="btn btn-primary btn-full btn-lg" id="sidebar-book-trial-btn">
                    Book Free 1-Day Trial
                  </button>
                ` : ''}
                <button class="btn btn-secondary btn-full" id="sidebar-view-plans-btn">
                  View All Plans
                </button>
              </div>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 20px;">
                <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 14px;">Location & Contact</h4>

                <div class="sidebar-contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <strong>${escapeHtml(gym.address)}</strong>
                    <div style="color: var(--text-muted); font-size: 0.82rem; margin-top: 2px;">Landmark: ${escapeHtml(gym.landmark || 'Noida')}</div>
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600; font-size: 0.85rem; display: inline-block; margin-top: 4px;">
                      Open in Google Maps ↗
                    </a>
                  </div>
                </div>

                <div class="sidebar-contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <div>
                    <div>${escapeHtml(gym.contact.phone)}</div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Manager: ${escapeHtml(gym.contact.manager)}</span>
                  </div>
                </div>

                <div class="sidebar-contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div style="width: 100%;">
                    ${hoursHtml}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;

    // Bind Detail events
    document.getElementById('detail-back-btn').addEventListener('click', () => {
      window.NoidaApp.navigateTo('home');
    });

    const bookTrialBtn = document.getElementById('sidebar-book-trial-btn');
    if (bookTrialBtn) {
      bookTrialBtn.addEventListener('click', () => {
        if (window.NoidaCheckout) {
          window.NoidaCheckout.openTrialBookingModal(gym);
        }
      });
    }

    const viewPlansBtn = document.getElementById('sidebar-view-plans-btn');
    if (viewPlansBtn) {
      viewPlansBtn.addEventListener('click', () => {
        const sec = document.getElementById('membership-plans-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    container.querySelectorAll('.select-plan-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const planId = btn.getAttribute('data-plan-id');
        const plan = (gym.plans || []).find(p => p.id === planId);
        if (window.NoidaCheckout) {
          window.NoidaCheckout.openMembershipCheckoutModal(gym, plan);
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

  return {
    render
  };
})();
