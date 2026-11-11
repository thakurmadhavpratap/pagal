/**
 * NoidaGym Marketplace - Customer Account & Saved Passes Service
 */

window.NoidaAccount = (function () {
  const SAVED_GYMS_KEY = 'noidagym_saved_gyms';
  const TRIAL_PASSES_KEY = 'noidagym_trial_passes';
  const MEMBERSHIPS_KEY = 'noidagym_membership_bookings';
  const USER_PROFILE_KEY = 'noidagym_user_profile';

  function getSavedGymIds() {
    try {
      const data = localStorage.getItem(SAVED_GYMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function toggleSaveGym(gymId) {
    const list = getSavedGymIds();
    const idx = list.indexOf(gymId);
    let isSaved = false;
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(gymId);
      isSaved = true;
    }
    localStorage.setItem(SAVED_GYMS_KEY, JSON.stringify(list));
    updateSavedCountBadge();
    return isSaved;
  }

  function getTrialPasses() {
    try {
      const data = localStorage.getItem(TRIAL_PASSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveTrialPass(pass) {
    const list = getTrialPasses();
    list.unshift(pass);
    localStorage.setItem(TRIAL_PASSES_KEY, JSON.stringify(list));
    updateSavedCountBadge();
  }

  function getMembershipBookings() {
    try {
      const data = localStorage.getItem(MEMBERSHIPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveMembershipBooking(mem) {
    const list = getMembershipBookings();
    list.unshift(mem);
    localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(list));
    updateSavedCountBadge();
  }

  function getUserProfile() {
    try {
      const data = localStorage.getItem(USER_PROFILE_KEY);
      return data ? JSON.parse(data) : {
        name: 'Arjun Verma',
        phone: '9876543210',
        email: 'arjun.noida@example.com'
      };
    } catch (e) {
      return {};
    }
  }

  function saveUserProfile(profile) {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  }

  function updateSavedCountBadge() {
    const count = getSavedGymIds().length;
    document.querySelectorAll('.saved-gyms-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }

  function render(allGyms) {
    const container = document.getElementById('account-container');
    if (!container) return;

    const savedIds = getSavedGymIds();
    const savedGyms = allGyms.filter(g => savedIds.includes(g.id));
    const trialPasses = getTrialPasses();
    const memberships = getMembershipBookings();
    const profile = getUserProfile();

    const savedGymsHtml = savedGyms.length > 0 ? `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 14px;">
        ${savedGyms.map(gym => `
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column;">
            <div style="position: relative; height: 130px;">
              <img src="${gym.images && gym.images[0] ? gym.images[0] : ''}" alt="${gym.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <button class="save-btn saved" data-remove-id="${gym.id}" style="position: absolute; top: 8px; right: 8px;" title="Remove">✕</button>
            </div>
            <div style="padding: 14px; flex: 1; display: flex; flex-direction: column;">
              <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 4px;">${gym.name}</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">${gym.sector} • ${gym.landmark}</p>
              <div style="margin-top: auto; display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm" onclick="window.NoidaApp.navigateTo('gym-detail', { id: '${gym.id}' })" style="flex: 1;">
                  View
                </button>
                <button class="btn btn-primary btn-sm" onclick="window.NoidaCheckout.openTrialBookingModal(window.NoidaApp.getGymById('${gym.id}'))" style="flex: 1;">
                  Trial
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div style="padding: 24px; text-align: center; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); color: var(--text-muted);">
        No saved gyms yet. Click the heart icon on any gym card to save it here for comparison.
      </div>
    `;

    const passesHtml = (trialPasses.length > 0 || memberships.length > 0) ? `
      <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 14px;">
        ${memberships.map(mem => `
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-left: 4px solid var(--accent-lime); border-radius: var(--radius-md); padding: 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <span class="status-badge verified" style="font-size: 0.7rem;">Active Membership Pass</span>
              <h4 style="font-size: 1.1rem; font-weight: 700; margin-top: 4px;">${escapeHtml(mem.gymName)}</h4>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(mem.planName)} • Starts ${mem.startDate}</div>
              <div style="font-size: 0.78rem; font-family: monospace; color: var(--text-muted); margin-top: 2px;">Ref: ${mem.id}</div>
            </div>
            <div>
              <div style="font-size: 1.15rem; font-weight: 800; text-align: right;">₹${mem.totalAmount.toLocaleString('en-IN')}</div>
              <span style="font-size: 0.75rem; color: #16A34A; font-weight: 600;">✓ Confirmed (Demo)</span>
            </div>
          </div>
        `).join('')}

        ${trialPasses.map(t => `
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-left: 4px solid #3B82F6; border-radius: var(--radius-md); padding: 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <span class="status-badge" style="background: #EFF6FF; color: #1D4ED8; font-size: 0.7rem;">1-Day Free Trial Pass</span>
              <h4 style="font-size: 1.1rem; font-weight: 700; margin-top: 4px;">${escapeHtml(t.gymName)}</h4>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">Date: ${t.date} • ${t.timeSlot}</div>
              <div style="font-size: 0.78rem; font-family: monospace; color: var(--text-muted); margin-top: 2px;">Ref: ${t.id}</div>
            </div>
            <div style="text-align: right;">
              <span class="pass-code-pill" style="font-size: 0.9rem; padding: 4px 10px;">${t.id}</span>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Show at reception</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div style="padding: 24px; text-align: center; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); color: var(--text-muted);">
        No active trial passes or membership bookings yet.
      </div>
    `;

    container.innerHTML = `
      <div class="container" style="padding: 40px 20px 80px; max-width: 860px;">
        <button class="back-link" onclick="window.NoidaApp.navigateTo('home')">
          ← Back to Directory
        </button>

        <div style="margin-bottom: 32px;">
          <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 6px;">My Account & Passes</h1>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Manage your saved gyms, access your free trial passes, and view confirmed memberships.
          </p>
        </div>

        <!-- Profile Bar -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 32px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-lime); color: var(--accent-lime-fg); font-weight: 800; font-size: 1.2rem; display: grid; place-items: center;">
              ${(profile.name || 'A')[0].toUpperCase()}
            </div>
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 700;">${escapeHtml(profile.name || 'Noida Fitness Seeker')}</h3>
              <div style="font-size: 0.85rem; color: var(--text-muted);">+91 ${escapeHtml(profile.phone || '')} • ${escapeHtml(profile.email || '')}</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="edit-profile-btn">
            Edit Details
          </button>
        </div>

        <!-- Passes Section -->
        <div style="margin-bottom: 40px;">
          <h2 style="font-size: 1.3rem; font-weight: 700;">Active Passes & Bookings</h2>
          ${passesHtml}
        </div>

        <!-- Saved Gyms Section -->
        <div>
          <h2 style="font-size: 1.3rem; font-weight: 700;">Saved Gyms (${savedGyms.length})</h2>
          ${savedGymsHtml}
        </div>
      </div>
    `;

    // Attach remove handlers
    container.querySelectorAll('[data-remove-id]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.getAttribute('data-remove-id');
        toggleSaveGym(id);
        render(allGyms);
      });
    });

    // Edit profile dialog
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        const newName = prompt('Enter full name:', profile.name || '');
        if (newName === null) return;
        const newPhone = prompt('Enter 10-digit mobile number:', profile.phone || '');
        if (newPhone === null) return;
        const newEmail = prompt('Enter email address:', profile.email || '');
        if (newEmail === null) return;

        saveUserProfile({
          name: newName.trim(),
          phone: newPhone.replace(/[^0-9]/g, ''),
          email: newEmail.trim()
        });
        render(allGyms);
      });
    }
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

  // Update badge immediately on load
  document.addEventListener('DOMContentLoaded', updateSavedCountBadge);

  return {
    getSavedGymIds,
    toggleSaveGym,
    getTrialPasses,
    saveTrialPass,
    getMembershipBookings,
    saveMembershipBooking,
    getUserProfile,
    saveUserProfile,
    render,
    updateSavedCountBadge
  };
})();
