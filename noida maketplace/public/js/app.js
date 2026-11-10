/**
 * NoidaGym Marketplace - Core Application & Routing Controller
 */

window.NoidaApp = (function () {
  let allGyms = [];
  let currentRoute = 'home';
  let routeParams = {};

  async function init() {
    try {
      // Fetch initial gyms from API
      const res = await fetch('/api/gyms');
      if (res.ok) {
        const data = await res.json();
        allGyms = data.gyms || [];
      } else {
        // Fallback to embedded data
        allGyms = window.NOIDA_GYMS || [];
      }
    } catch (e) {
      console.warn('Using local fallback data store:', e);
      allGyms = window.NOIDA_GYMS || [];
    }

    // Initialize sub-modules
    if (window.NoidaSearch) {
      window.NoidaSearch.init(allGyms);
    }
    if (window.NoidaCheckout) {
      window.NoidaCheckout.init();
    }

    // Setup global nav handlers
    bindNavEvents();

    // Listen to hash changes for deep linking
    window.addEventListener('hashchange', handleHashRouting);
    handleHashRouting();
  }

  function handleHashRouting() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      navigateTo('home', {}, false);
      return;
    }

    const parts = hash.split('/');
    const mainView = parts[0];

    if (mainView === 'gyms' && parts[1]) {
      navigateTo('gym-detail', { id: parts[1] }, false);
    } else if (mainView === 'list-your-gym') {
      navigateTo('list-gym', {}, false);
    } else if (mainView === 'account' || mainView === 'passes') {
      navigateTo('account', {}, false);
    } else if (mainView === 'faq') {
      navigateTo('faq', {}, false);
    } else if (mainView === 'about') {
      navigateTo('about', {}, false);
    } else if (mainView === 'contact') {
      navigateTo('contact', {}, false);
    } else if (mainView === 'terms') {
      navigateTo('terms', {}, false);
    } else if (mainView === 'privacy') {
      navigateTo('privacy', {}, false);
    } else {
      navigateTo('home', {}, false);
    }
  }

  function navigateTo(route, params = {}, updateHash = true) {
    currentRoute = route;
    routeParams = params;

    if (updateHash) {
      if (route === 'home') {
        window.location.hash = '';
      } else if (route === 'gym-detail' && params.id) {
        window.location.hash = `/gyms/${params.id}`;
      } else if (route === 'list-gym') {
        window.location.hash = '/list-your-gym';
      } else if (route === 'account') {
        window.location.hash = '/account';
      } else {
        window.location.hash = `/${route}`;
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide all view containers
    document.querySelectorAll('.view-container').forEach(c => (c.style.display = 'none'));

    // Highlight active nav links
    document.querySelectorAll('.nav-link, .mobile-bottom-item').forEach(link => {
      const target = link.getAttribute('data-target-view');
      link.classList.toggle('active', target === route);
    });

    // Render corresponding view
    if (route === 'home') {
      const homeEl = document.getElementById('home-view-container');
      if (homeEl) homeEl.style.display = 'block';
      if (window.NoidaSearch) window.NoidaSearch.applyFiltersAndRender();
    } else if (route === 'gym-detail') {
      const detailEl = document.getElementById('gym-detail-container');
      if (detailEl) {
        detailEl.style.display = 'block';
        if (window.NoidaGymDetail) window.NoidaGymDetail.render(params.id, allGyms);
      }
    } else if (route === 'list-gym') {
      const listEl = document.getElementById('list-gym-container');
      if (listEl) {
        listEl.style.display = 'block';
        if (window.NoidaListGym) window.NoidaListGym.render();
      }
    } else if (route === 'account') {
      const accEl = document.getElementById('account-container');
      if (accEl) {
        accEl.style.display = 'block';
        if (window.NoidaAccount) window.NoidaAccount.render(allGyms);
      }
    } else if (route === 'faq' || route === 'about' || route === 'contact' || route === 'terms' || route === 'privacy') {
      const staticEl = document.getElementById('static-view-container');
      if (staticEl) {
        staticEl.style.display = 'block';
        renderStaticView(route);
      }
    }
  }

  function bindNavEvents() {
    // Header brand link
    document.querySelectorAll('.brand-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo('home');
      });
    });

    // Header nav links
    document.querySelectorAll('[data-target-view]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.getAttribute('data-target-view');
        navigateTo(target);
      });
    });
  }

  function renderStaticView(viewName) {
    const container = document.getElementById('static-view-container');
    if (!container) return;

    if (viewName === 'faq') {
      container.innerHTML = `
        <div class="container" style="padding: 40px 20px 80px; max-width: 820px;">
          <button class="back-link" onclick="window.NoidaApp.navigateTo('home')">← Back to Directory</button>
          <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 8px;">Frequently Asked Questions</h1>
          <p style="color: var(--text-muted); margin-bottom: 32px;">Got questions about discovering and joining gyms across Noida? Here are answers.</p>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">How does the Free 1-Day Trial Pass work?</h3>
              <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
                Select any participating gym with the "Free Trial" badge, choose your date and preferred workout slot, and get your instant pass code. Show this reference at the gym reception along with clean indoor training shoes and government ID.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">What does "Verified Partner" mean vs "Demo Listing"?</h3>
              <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
                <strong>Verified Partners</strong> are gyms whose facilities, equipment, and plans have been verified by NoidaGym. Instant vouchers are fulfilled directly through their desk. <strong>Demo Listings</strong> are independent research examples where pricing and amenities are placeholders and must be verified directly with the club.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Can I pause my membership if I travel outside Noida?</h3>
              <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
                Yes! Every plan transparently lists its freeze allowance (typically 10 to 30 days on quarterly or annual plans). Pauses can be requested via your account dashboard or directly at the gym desk with 48 hours notice.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">How do gym owners list their fitness centers?</h3>
              <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
                Click "List Your Gym" in the navigation bar to submit your center's details. Our ground operations team in Noida will contact you for a facility audit and partner agreement setup.
              </p>
            </div>
          </div>
        </div>
      `;
    } else if (viewName === 'about') {
      container.innerHTML = `
        <div class="container" style="padding: 40px 20px 80px; max-width: 820px;">
          <button class="back-link" onclick="window.NoidaApp.navigateTo('home')">← Back to Directory</button>
          <span class="hero-pill"><span class="hero-pill-dot"></span> Built for Noida’s Fitness Community</span>
          <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 14px;">About NoidaGym Marketplace</h1>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1.05rem; margin-bottom: 24px;">
            Noida is home to bustling tech hubs, corporate parks, and residential sectors from Sector 18 to the Expressway. Yet finding the right gym often involves navigating aggressive sales calls, unlisted prices, and unverified reviews.
          </p>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.98rem; margin-bottom: 24px;">
            NoidaGym was created to bring clarity and convenience to the city’s fitness landscape. We provide verified equipment breakdowns, transparent GST-inclusive membership pricing, dedicated women-only timing information, and seamless 1-day trial passes without high-pressure sales tactics.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 32px;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <h4 style="font-weight: 700; margin-bottom: 4px;">Zero Hidden Fees</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Exact GST calculations, joining fee terms, and clear freeze policies before you buy.</p>
            </div>
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <h4 style="font-weight: 700; margin-bottom: 4px;">Location-Aware</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Accurate distance calculations to gyms across Sectors 18, 38, 50, 62, 76, 104, 127 & 153.</p>
            </div>
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
              <h4 style="font-weight: 700; margin-bottom: 4px;">Ethical Marketplace</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">No fake reviews, no fabricated partner claims, and explicit demo labeling.</p>
            </div>
          </div>
        </div>
      `;
    } else if (viewName === 'contact') {
      container.innerHTML = `
        <div class="container" style="padding: 40px 20px 80px; max-width: 720px;">
          <button class="back-link" onclick="window.NoidaApp.navigateTo('home')">← Back to Directory</button>
          <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 8px;">Help & Support</h1>
          <p style="color: var(--text-secondary); margin-bottom: 28px;">Have a question about a pass, partner onboarding, or gym details? Reach out to our Noida desk.</p>

          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 28px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div>
                <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Customer Support</span>
                <div style="font-weight: 700;">support@noidagym.demo.in</div>
                <div style="font-size: 0.82rem; color: var(--text-secondary);">Mon - Sat (9am - 7pm IST)</div>
              </div>
              <div>
                <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Merchant / Owner Desk</span>
                <div style="font-weight: 700;">partners@noidagym.demo.in</div>
                <div style="font-size: 0.82rem; color: var(--text-secondary);">Noida Sector 62 & 104 Support Units</div>
              </div>
            </div>

            <form onsubmit="event.preventDefault(); alert('Thank you! Your message has been recorded. Our support team will reply within 24 hours.');">
              <div class="form-group">
                <label class="form-label">Your Name</label>
                <input type="text" class="form-control" required placeholder="Enter full name" />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-control" required placeholder="name@example.com" />
              </div>
              <div class="form-group">
                <label class="form-label">Message / Query</label>
                <textarea class="form-control" rows="3" required placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-full">Send Message</button>
            </form>
          </div>
        </div>
      `;
    } else if (viewName === 'terms' || viewName === 'privacy') {
      container.innerHTML = `
        <div class="container" style="padding: 40px 20px 80px; max-width: 820px;">
          <button class="back-link" onclick="window.NoidaApp.navigateTo('home')">← Back to Directory</button>
          <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">
            ${viewName === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          </h1>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">
            Last updated: October 2026 • Operational Jurisdiction: Gautam Buddha Nagar (Noida), UP, India
          </p>

          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; line-height: 1.7; color: var(--text-secondary); font-size: 0.95rem;">
            <p style="margin-bottom: 16px;">
              <strong>1. Marketplace Role:</strong> NoidaGym acts as an intermediary discovery platform connecting consumers with independent fitness centers and gyms located in Noida, Uttar Pradesh.
            </p>
            <p style="margin-bottom: 16px;">
              <strong>2. Unverified / Research Listings:</strong> Listings marked as "Demo Listing" are placeholders for discovery and regional comparison. Rates, operational hours, and amenities for such listings must be validated directly with the gym before executing commercial commitments.
            </p>
            <p style="margin-bottom: 16px;">
              <strong>3. Refund & Cancellation Terms:</strong> Each gym specifies its own cancellation and membership pause policy as displayed on the membership plan card. Unless otherwise specified, memberships activated through the platform carry a 7-day review window.
            </p>
            <p style="margin-bottom: 16px;">
              <strong>4. Privacy & Personal Data:</strong> Customer contact details collected during trial bookings or membership requests are shared only with the specifically selected gym center for the sole purpose of pass fulfillment.
            </p>
            <p style="font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 24px;">
              <em>Notice: These policy terms are standard platform placeholders and subject to execution of commercial merchant agreements.</em>
            </p>
          </div>
        </div>
      `;
    }
  }

  function getGymById(id) {
    return allGyms.find(g => g.id === id);
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    init,
    navigateTo,
    getGymById
  };
})();
