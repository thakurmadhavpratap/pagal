/**
 * NoidaGym Marketplace - Trial Pass & Membership Booking Flow
 */

window.NoidaCheckout = (function () {
  let selectedGym = null;
  let selectedPlan = null;
  let currentFlowType = 'trial'; // 'trial' or 'membership'

  function init() {
    const backdrop = document.getElementById('checkout-modal-backdrop');
    const closeBtn = document.getElementById('checkout-modal-close-btn');

    if (closeBtn && backdrop) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (backdrop) {
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) closeModal();
      });
    }
  }

  function closeModal() {
    const backdrop = document.getElementById('checkout-modal-backdrop');
    if (backdrop) backdrop.classList.remove('open');
  }

  function openTrialBookingModal(gym) {
    selectedGym = gym;
    selectedPlan = null;
    currentFlowType = 'trial';

    const modalBody = document.getElementById('checkout-modal-content');
    const modalTitle = document.getElementById('checkout-modal-title');
    const backdrop = document.getElementById('checkout-modal-backdrop');

    if (modalTitle) modalTitle.textContent = `Book Free Trial • ${gym.name}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    // Pre-populate if user has profile
    const profile = window.NoidaAccount ? window.NoidaAccount.getUserProfile() : {};

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px; background: var(--bg-card-subtle); padding: 14px 18px; border-radius: var(--radius-md);">
        <div style="font-weight: 700; font-size: 1.05rem;">${escapeHtml(gym.name)}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(gym.sector)} • ${escapeHtml(gym.address)}</div>
        <div style="margin-top: 8px; font-size: 0.82rem; color: var(--accent-lime-fg); background: var(--accent-lime); display: inline-block; padding: 2px 8px; border-radius: var(--radius-full); font-weight: 700;">
          Pass Fee: ₹0 (Complimentary First Visit)
        </div>
      </div>

      <form id="trial-booking-form">
        <div class="form-group">
          <label class="form-label" for="trial-name">Full Name *</label>
          <input type="text" id="trial-name" class="form-control" placeholder="Enter your full name" required value="${escapeHtml(profile.name || '')}" />
        </div>

        <div class="form-group">
          <label class="form-label" for="trial-phone">Mobile Number (+91) *</label>
          <input type="tel" id="trial-phone" class="form-control" placeholder="10-digit mobile number" maxlength="10" required value="${escapeHtml(profile.phone || '')}" />
          <div class="form-hint">A trial pass confirmation code will be issued instantly.</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="trial-email">Email Address (Optional)</label>
          <input type="email" id="trial-email" class="form-control" placeholder="For calendar invite and pass copy" value="${escapeHtml(profile.email || '')}" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label" for="trial-date">Preferred Date *</label>
            <input type="date" id="trial-date" class="form-control" required value="${defaultDate}" min="${new Date().toISOString().split('T')[0]}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="trial-slot">Time Slot *</label>
            <select id="trial-slot" class="form-control">
              <option value="Morning (7:00 AM - 9:30 AM)">Morning (7:00 AM - 9:30 AM)</option>
              <option value="Midday (11:30 AM - 1:30 PM)">Midday (11:30 AM - 1:30 PM)</option>
              <option value="Evening (5:30 PM - 8:30 PM)">Evening (5:30 PM - 8:30 PM)</option>
              <option value="Night (8:30 PM - 10:30 PM)">Night (8:30 PM - 10:30 PM)</option>
            </select>
          </div>
        </div>

        <div style="margin: 18px 0; font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
          ℹ️ By requesting this pass, you agree to follow the gym’s safety rules. Please carry clean training shoes and a government photo ID upon arrival.
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-lg" id="submit-trial-btn">
          Confirm Free 1-Day Trial Pass
        </button>
      </form>
    `;

    backdrop.classList.add('open');

    // Attach submit listener
    const form = document.getElementById('trial-booking-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('trial-name').value.trim();
      const phone = document.getElementById('trial-phone').value.trim();
      const email = document.getElementById('trial-email').value.trim();
      const date = document.getElementById('trial-date').value;
      const slot = document.getElementById('trial-slot').value;

      if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
      }

      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length !== 10) {
        alert('Please enter a valid 10-digit Indian phone number.');
        return;
      }

      const submitBtn = document.getElementById('submit-trial-btn');
      submitBtn.textContent = 'Issuing Trial Pass...';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/trials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gymId: gym.id,
            gymName: gym.name,
            customerName: name,
            phone: cleanPhone,
            email,
            date,
            timeSlot: slot
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to issue trial pass');

        // Save to user account storage
        if (window.NoidaAccount) {
          window.NoidaAccount.saveTrialPass(data.booking);
          window.NoidaAccount.saveUserProfile({ name, phone: cleanPhone, email });
        }

        renderTrialConfirmation(data.booking);
      } catch (err) {
        alert(err.message || 'Error booking trial. Please try again.');
        submitBtn.textContent = 'Confirm Free 1-Day Trial Pass';
        submitBtn.disabled = false;
      }
    });
  }

  function openMembershipCheckoutModal(gym, plan) {
    selectedGym = gym;
    selectedPlan = plan;
    currentFlowType = 'membership';

    const modalBody = document.getElementById('checkout-modal-content');
    const modalTitle = document.getElementById('checkout-modal-title');
    const backdrop = document.getElementById('checkout-modal-backdrop');

    if (modalTitle) modalTitle.textContent = `Join ${gym.name} • ${plan.name}`;

    const profile = window.NoidaAccount ? window.NoidaAccount.getUserProfile() : {};
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    modalBody.innerHTML = `
      <!-- Plan summary & Price breakdown -->
      <div style="background: var(--bg-card-subtle); padding: 18px; border-radius: var(--radius-md); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="font-weight: 700; font-size: 1.1rem;">${escapeHtml(plan.name)}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(gym.name)} • ${escapeHtml(gym.sector)}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.35rem; font-weight: 800;">₹${plan.totalPrice.toLocaleString('en-IN')}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${plan.duration}</div>
          </div>
        </div>

        <div style="border-top: 1px dashed var(--border-subtle); padding-top: 10px; font-size: 0.84rem; display: flex; flex-direction: column; gap: 4px; color: var(--text-secondary);">
          <div style="display: flex; justify-content: space-between;">
            <span>Plan Base Fee:</span>
            <span>₹${plan.basePrice.toLocaleString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Goods & Services Tax (GST 18%):</span>
            <span>₹${Math.round(plan.basePrice * 0.18).toLocaleString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Platform Service Charge:</span>
            <span style="color: #16A34A; font-weight: 600;">₹0 (Free)</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-primary); border-top: 1px solid var(--border-subtle); padding-top: 6px; margin-top: 4px;">
            <span>Total Payable:</span>
            <span>₹${plan.totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <!-- Demo Gateway Banner -->
      <div style="background: var(--status-demo-bg); color: var(--status-demo-text); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 18px;">
        ⚠️ <strong>Demo Gateway Mode:</strong> Payment processing is running in demo simulator mode. No real payment or charge will be incurred.
      </div>

      <form id="membership-checkout-form">
        <div class="form-group">
          <label class="form-label" for="mem-name">Member Full Name *</label>
          <input type="text" id="mem-name" class="form-control" placeholder="As per official photo ID" required value="${escapeHtml(profile.name || '')}" />
        </div>

        <div class="form-group">
          <label class="form-label" for="mem-phone">Contact Mobile (+91) *</label>
          <input type="tel" id="mem-phone" class="form-control" placeholder="10-digit mobile number" maxlength="10" required value="${escapeHtml(profile.phone || '')}" />
        </div>

        <div class="form-group">
          <label class="form-label" for="mem-email">Email Address *</label>
          <input type="email" id="mem-email" class="form-control" placeholder="Tax invoice & membership certificate" required value="${escapeHtml(profile.email || '')}" />
        </div>

        <div class="form-group">
          <label class="form-label" for="mem-start-date">Membership Activation Date *</label>
          <input type="date" id="mem-start-date" class="form-control" required value="${defaultDate}" min="${new Date().toISOString().split('T')[0]}" />
          <div class="form-hint">You can activate anytime within 30 days of purchase.</div>
        </div>

        <div class="form-group">
          <label class="form-label">Simulated Payment Mode (Demo)</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <label style="border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="radio" name="payment-method" value="UPI (Google Pay / PhonePe)" checked accent-color="var(--accent-lime)" />
              UPI Instant
            </label>
            <label style="border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="radio" name="payment-method" value="Credit / Debit Card" accent-color="var(--accent-lime)" />
              Debit / Credit Card
            </label>
            <label style="border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="radio" name="payment-method" value="Pay at Gym Reception" accent-color="var(--accent-lime)" />
              Pay at Gym Desk
            </label>
            <label style="border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
              <input type="radio" name="payment-method" value="Net Banking" accent-color="var(--accent-lime)" />
              Net Banking
            </label>
          </div>
        </div>

        <div style="margin: 16px 0; font-size: 0.78rem; color: var(--text-muted);">
          Protected by standard 7-day satisfaction policy. Pauses and refunds adhere to this plan's documented terms: <em>"${escapeHtml(plan.pausePolicy)}"</em>.
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-lg" id="submit-membership-btn">
          Complete Purchase (Demo Simulator)
        </button>
      </form>
    `;

    backdrop.classList.add('open');

    // Attach submit listener
    const form = document.getElementById('membership-checkout-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('mem-name').value.trim();
      const phone = document.getElementById('mem-phone').value.trim();
      const email = document.getElementById('mem-email').value.trim();
      const startDate = document.getElementById('mem-start-date').value;
      const selectedRadio = document.querySelector('input[name="payment-method"]:checked');
      const paymentMode = selectedRadio ? selectedRadio.value : 'UPI Instant';

      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length !== 10) {
        alert('Please enter a valid 10-digit Indian phone number.');
        return;
      }

      const submitBtn = document.getElementById('submit-membership-btn');
      submitBtn.textContent = 'Simulating Payment...';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/memberships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gymId: gym.id,
            gymName: gym.name,
            planId: plan.id,
            planName: plan.name,
            planDuration: plan.duration,
            totalAmount: plan.totalPrice,
            customerName: name,
            phone: cleanPhone,
            email,
            startDate,
            paymentMode
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to complete membership');

        if (window.NoidaAccount) {
          window.NoidaAccount.saveMembershipBooking(data.membership);
          window.NoidaAccount.saveUserProfile({ name, phone: cleanPhone, email });
        }

        renderMembershipConfirmation(data.membership);
      } catch (err) {
        alert(err.message || 'Error completing membership. Please try again.');
        submitBtn.textContent = 'Complete Purchase (Demo Simulator)';
        submitBtn.disabled = false;
      }
    });
  }

  function renderTrialConfirmation(booking) {
    const modalBody = document.getElementById('checkout-modal-content');
    const modalTitle = document.getElementById('checkout-modal-title');
    if (modalTitle) modalTitle.textContent = `Trial Pass Confirmed!`;

    modalBody.innerHTML = `
      <div style="text-align: center; padding: 10px 0;">
        <div style="font-size: 3rem; margin-bottom: 8px;">🎉</div>
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 6px;">Your Trial Pass is Ready!</h3>
        <p style="color: var(--text-secondary); font-size: 0.92rem; max-width: 440px; margin: 0 auto 16px;">
          Present this pass at the reception of <strong>${escapeHtml(booking.gymName)}</strong>.
        </p>

        <div class="pass-receipt-box">
          <div class="pass-code-pill">${booking.id}</div>
          <div class="pass-qr-mock">
            <svg viewBox="0 0 100 100" width="130" height="130">
              <rect width="100" height="100" fill="#ffffff" />
              <!-- Outer Markers -->
              <rect x="10" y="10" width="25" height="25" fill="#202522" />
              <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
              <rect x="18" y="18" width="9" height="9" fill="#202522" />
              <rect x="65" y="10" width="25" height="25" fill="#202522" />
              <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
              <rect x="73" y="18" width="9" height="9" fill="#202522" />
              <rect x="10" y="65" width="25" height="25" fill="#202522" />
              <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
              <rect x="18" y="73" width="9" height="9" fill="#202522" />
              <!-- Center pattern -->
              <rect x="42" y="42" width="16" height="16" fill="#B7F34A" />
              <rect x="42" y="15" width="10" height="8" fill="#202522" />
              <rect x="42" y="77" width="10" height="8" fill="#202522" />
              <rect x="65" y="45" width="25" height="8" fill="#202522" />
              <rect x="65" y="65" width="12" height="15" fill="#202522" />
              <rect x="80" y="65" width="10" height="10" fill="#202522" />
            </svg>
          </div>
          <div style="font-size: 0.85rem; font-weight: 700;">${escapeHtml(booking.customerName)}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${booking.date} • ${booking.timeSlot}</div>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; text-align: left; font-size: 0.85rem; margin-bottom: 20px;">
          <h4 style="font-weight: 700; margin-bottom: 6px;">Next Steps for Your Workout:</h4>
          <ul style="padding-left: 20px; line-height: 1.6; color: var(--text-secondary);">
            <li>Carry a valid government ID (Aadhaar or Driving License).</li>
            <li>Wear clean sports shoes (outdoor muddy shoes not permitted).</li>
            <li>Bring a small sweat towel and a water bottle.</li>
            <li>Show this digital pass code at the front reception desk.</li>
          </ul>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-full" onclick="window.NoidaApp.navigateTo('account')">
            View in My Passes
          </button>
          <button class="btn btn-primary btn-full" onclick="window.NoidaCheckout.closeModal()">
            Done
          </button>
        </div>
      </div>
    `;
  }

  function renderMembershipConfirmation(membership) {
    const modalBody = document.getElementById('checkout-modal-content');
    const modalTitle = document.getElementById('checkout-modal-title');
    if (modalTitle) modalTitle.textContent = `Membership Activated (Demo)!`;

    modalBody.innerHTML = `
      <div style="text-align: center; padding: 10px 0;">
        <div style="font-size: 3rem; margin-bottom: 8px;">💪</div>
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 4px;">Welcome to ${escapeHtml(membership.gymName)}!</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 16px;">
          Your membership voucher is active. Reference code generated below.
        </p>

        <div class="pass-receipt-box">
          <div class="pass-code-pill">${membership.id}</div>
          <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 2px;">
            ${escapeHtml(membership.planName)} (${escapeHtml(membership.planDuration)})
          </div>
          <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 10px;">
            Amount Paid (Demo): ₹${membership.totalAmount.toLocaleString('en-IN')}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Member: <strong>${escapeHtml(membership.customerName)}</strong> • Start Date: ${membership.startDate}
          </div>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; text-align: left; font-size: 0.85rem; margin-bottom: 20px;">
          <div style="font-weight: 700; margin-bottom: 4px;">What Happens Next:</div>
          <p style="color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px;">
            The gym desk has received your voucher details. On your first day, visit the reception to pick up your RFID locker tag and take your baseline trainer consultation.
          </p>
          <div style="color: var(--text-muted); font-size: 0.8rem;">
            Customer Support Helpline: support@noidagym.demo.in
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-full" onclick="window.NoidaApp.navigateTo('account')">
            Go to My Passes
          </button>
          <button class="btn btn-primary btn-full" onclick="window.NoidaCheckout.closeModal()">
            Continue Browsing
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
    init,
    openTrialBookingModal,
    openMembershipCheckoutModal,
    closeModal
  };
})();
