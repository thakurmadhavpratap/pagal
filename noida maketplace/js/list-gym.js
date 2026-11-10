/**
 * NoidaGym Marketplace - Gym Owner Listing & Onboarding Component
 */

window.NoidaListGym = (function () {
  function render() {
    const container = document.getElementById('list-gym-container');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="padding: 40px 20px 80px; max-width: 860px;">
        <button class="back-link" onclick="window.NoidaApp.navigateTo('home')">
          ← Back to Directory
        </button>

        <div style="text-align: center; margin-bottom: 36px;">
          <span class="hero-pill">
            <span class="hero-pill-dot"></span>
            Partner with Noida's Dedicated Fitness Marketplace
          </span>
          <h1 style="font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px;">
            List Your Gym in Noida
          </h1>
          <p style="color: var(--text-secondary); font-size: 1.05rem; max-width: 620px; margin: 0 auto; line-height: 1.6;">
            Connect directly with verified local fitness enthusiasts across Noida sectors. Fill your workout floors during off-peak hours and manage trial bookings transparently.
          </p>
        </div>

        <!-- How Partnering Works -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 40px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">1️⃣</div>
            <h4 style="font-weight: 700; margin-bottom: 4px;">Submit Listing</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Share your equipment list, facilities, pricing, and timing slots via this portal.</p>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">2️⃣</div>
            <h4 style="font-weight: 700; margin-bottom: 4px;">In-Person Verification</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Our Noida ground team visits your gym to confirm facilities and set up your partner dashboard.</p>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">3️⃣</div>
            <h4 style="font-weight: 700; margin-bottom: 4px;">Zero Upfront Fee</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">No subscription or listing charge. Transparent commission is finalized during partner agreement.</p>
          </div>
        </div>

        <!-- Onboarding Form -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-sm);">
          <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 8px;">Gym Submission Details</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 24px;">
            Fields marked with an asterisk (*) are required for listing verification.
          </p>

          <form id="owner-onboarding-form">
            <!-- Basic Details -->
            <div class="form-group">
              <label class="form-label" for="owner-gym-name">Gym / Fitness Center Name *</label>
              <input type="text" id="owner-gym-name" class="form-control" placeholder="e.g. IronPulse Fitness & Strength" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="owner-sector">Noida Sector *</label>
                <select id="owner-sector" class="form-control" required>
                  <option value="">Select Sector</option>
                  <option value="Sector 18">Sector 18</option>
                  <option value="Sector 38">Sector 38 / GIP</option>
                  <option value="Sector 50">Sector 50</option>
                  <option value="Sector 62">Sector 62</option>
                  <option value="Sector 76">Sector 76</option>
                  <option value="Sector 104">Sector 104</option>
                  <option value="Sector 127">Sector 127</option>
                  <option value="Sector 153">Sector 153</option>
                  <option value="Other Noida Sector">Other Noida Sector</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="owner-landmark">Nearby Landmark</label>
                <input type="text" id="owner-landmark" class="form-control" placeholder="e.g. Near Metro Station Gate 2" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="owner-address">Full Physical Address *</label>
              <textarea id="owner-address" class="form-control" rows="2" placeholder="Building name, Floor, Plot number, Block, Noida, UP" required></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="owner-name">Owner / Manager Name *</label>
                <input type="text" id="owner-name" class="form-control" placeholder="Primary contact person" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="owner-phone">Contact Mobile Number (+91) *</label>
                <input type="tel" id="owner-phone" class="form-control" placeholder="10-digit number" maxlength="10" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="owner-email">Business Email Address</label>
              <input type="email" id="owner-email" class="form-control" placeholder="for verification documentation" />
            </div>

            <!-- Facilities Checkboxes -->
            <div class="form-group" style="margin-top: 24px;">
              <label class="form-label">Key Facilities Available at Your Center</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 8px;">
                <label class="checkbox-label">
                  <input type="checkbox" name="owner-facility" value="Free Weights & Dumbbells" checked />
                  Free Weights (up to 50kg+)
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="owner-facility" value="CrossFit & Functional Rig" />
                  CrossFit Rig & Turf
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="owner-facility" value="Steam & Sauna Bath" />
                  Steam & Sauna
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="owner-facility" value="Swimming Pool" />
                  Swimming Pool
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="owner-facility" value="Personal Trainers" checked />
                  Certified Trainers
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="owner-facility" value="Valet & Member Parking" checked />
                  Member Parking
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="owner-facility" value="Locker & Shower Suites" checked />
                  Lockers & Showers
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="owner-facility" value="Air Conditioned" checked />
                  Air Conditioned
                </label>
              </div>
            </div>

            <!-- Operating Hours & Timings -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px;">
              <div class="form-group">
                <label class="form-label" for="owner-weekday-hours">Weekday Operating Hours</label>
                <input type="text" id="owner-weekday-hours" class="form-control" value="6:00 AM - 10:30 PM" />
              </div>

              <div class="form-group">
                <label class="form-label" for="owner-weekend-hours">Weekend Operating Hours</label>
                <input type="text" id="owner-weekend-hours" class="form-control" value="7:00 AM - 9:00 PM" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="owner-women-timings">Women-Only Batches (if any)</label>
                <input type="text" id="owner-women-timings" class="form-control" placeholder="e.g. 11:30 AM - 1:00 PM or None" />
              </div>

              <div class="form-group">
                <label class="form-label" for="owner-price">Starting Monthly Fee (₹)</label>
                <input type="number" id="owner-price" class="form-control" placeholder="e.g. 2500" min="500" />
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label" style="font-weight: 600;">
                <input type="checkbox" id="owner-trial-toggle" checked />
                Offer 1-Day Free Trial to verified NoidaGym marketplace users
              </label>
              <div class="form-hint" style="margin-left: 28px;">
                Gyms with free trials receive up to 3.8x more membership inquiries.
              </div>
            </div>

            <!-- Commission disclaimer -->
            <div style="background: var(--bg-card-subtle); padding: 14px 18px; border-radius: var(--radius-md); font-size: 0.84rem; color: var(--text-secondary); margin: 24px 0;">
              ℹ️ <strong>Marketplace Terms:</strong> NoidaGym connects gyms with members. Commission rates are not automated and will be mutually agreed in writing during onboarding. Submitting this form does not bind you to exclusivity.
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg" id="submit-owner-form-btn">
              Submit Gym for Verification
            </button>
          </form>
        </div>
      </div>
    `;

    // Attach submit event
    const form = document.getElementById('owner-onboarding-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const gymName = document.getElementById('owner-gym-name').value.trim();
      const sector = document.getElementById('owner-sector').value;
      const landmark = document.getElementById('owner-landmark').value.trim();
      const address = document.getElementById('owner-address').value.trim();
      const contactName = document.getElementById('owner-name').value.trim();
      const contactPhone = document.getElementById('owner-phone').value.trim();
      const contactEmail = document.getElementById('owner-email').value.trim();
      const weekdayHours = document.getElementById('owner-weekday-hours').value.trim();
      const weekendHours = document.getElementById('owner-weekend-hours').value.trim();
      const womenOnlyTimings = document.getElementById('owner-women-timings').value.trim();
      const monthlyStartingPrice = document.getElementById('owner-price').value.trim();
      const trialAvailable = document.getElementById('owner-trial-toggle').checked;

      const checkedFacilities = Array.from(document.querySelectorAll('input[name="owner-facility"]:checked')).map(cb => cb.value);

      const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.length !== 10) {
        alert('Please enter a valid 10-digit Indian phone number.');
        return;
      }

      const submitBtn = document.getElementById('submit-owner-form-btn');
      submitBtn.textContent = 'Submitting Listing...';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/gym-onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gymName,
            sector,
            landmark,
            address,
            contactName,
            contactPhone: cleanPhone,
            contactEmail,
            facilities: checkedFacilities,
            weekdayHours,
            weekendHours,
            womenOnlyTimings,
            monthlyStartingPrice,
            trialAvailable
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit onboarding');

        renderSubmissionSuccess(data);
      } catch (err) {
        alert(err.message || 'Error submitting listing. Please try again.');
        submitBtn.textContent = 'Submit Gym for Verification';
        submitBtn.disabled = false;
      }
    });
  }

  function renderSubmissionSuccess(data) {
    const container = document.getElementById('list-gym-container');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="padding: 60px 20px 100px; max-width: 680px; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">🏢</div>
        <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">Listing Submitted Successfully!</h2>
        <p style="color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 24px; line-height: 1.6;">
          Thank you for applying to join the NoidaGym marketplace network.
        </p>

        <div class="pass-receipt-box">
          <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Application Reference Ticket</span>
          <div class="pass-code-pill">${data.submissionId}</div>
          <div style="font-size: 1.1rem; font-weight: 700; margin-top: 6px;">
            ${escapeHtml(data.previewGym.name)} • ${escapeHtml(data.previewGym.sector)}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            Status: <span style="color: #CA8A04; font-weight: 600;">Pending In-Person Verification</span>
          </div>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; text-align: left; margin-bottom: 32px; font-size: 0.92rem;">
          <h4 style="font-weight: 700; margin-bottom: 8px;">What happens next:</h4>
          <ol style="padding-left: 20px; line-height: 1.7; color: var(--text-secondary);">
            <li>Our Noida merchant coordinator will call your provided number within 24-48 business hours.</li>
            <li>We schedule an on-site visit to inspect equipment, check hygiene standards, and photograph your center.</li>
            <li>Once approved, your listing becomes active with the <strong>Verified Marketplace Partner</strong> badge.</li>
          </ol>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-secondary" onclick="window.NoidaApp.navigateTo('gym-detail', { id: '${data.previewGym.id}' })">
            Preview Listing
          </button>
          <button class="btn btn-primary" onclick="window.NoidaApp.navigateTo('home')">
            Explore All Noida Gyms
          </button>
        </div>
      </div>
    `;
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
