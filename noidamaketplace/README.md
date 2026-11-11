# NoidaGym Marketplace ⚡

> A polished, reliable, mobile-friendly web marketplace for gym discovery, facility comparison, and membership booking focused initially on **Noida, Uttar Pradesh, India**.

---

## 🌟 Overview & Product Concept

Noida is a thriving fitness hub spanning corporate tech parks, residential clusters, and the Noida-Greater Noida Expressway. **NoidaGym** provides a transparent, consumer-first marketplace where fitness enthusiasts can discover nearby gyms, compare genuine equipment, view official rack rates, verify women-only timings, and book 1-day trial passes without enduring high-pressure sales calls.

### Core Value Propositions
- **Accurate Noida Locality Matching:** Filter by sector (Sector 18, 38, 50, 62, 76, 104, 127, 153) or use browser GPS with exact kilometer distance calculation.
- **Transparent Pricing:** All membership tiers clearly separate base prices, 18% GST, and registration fees, alongside explicit freeze/pause terms.
- **Ethical Labeling:** Verified partner gyms are differentiated from demo/reference listings. No fabricated partner claims, invented reviews, or fake badges.
- **Gym-Owner Onboarding:** A self-service portal for Noida gym owners to list their facilities, schedule on-site verification audits, and accept trial requests.

---

## 🎨 Visual Design & Theme Architecture

The website incorporates a clean, modern athletic aesthetic adhering to high-contrast fitness design principles:

| Element | Light Mode | Dark Mode |
|---|---|---|
| **Background** | Warm off-white (`#F7F8F5`) | Deep charcoal (`#151816`) |
| **Cards & Surfaces** | Clean white (`#FFFFFF`) | Elevated charcoal (`#202522`) |
| **Primary Typography** | Deep charcoal (`#202522`) | Soft white (`#F1F3EF`) |
| **Secondary Typography** | Slate grey (`#535E57`) | Muted sage (`#A8B3AB`) |
| **Primary Accent** | Vivid Lime (`#B7F34A`) | Vivid Lime (`#B7F34A`) |
| **Borders** | Subtle grey (`#E3E7DE`) | Subtle dark grey (`#2D3530`) |

- **Theme Switcher:** Seamless toggle between **Light**, **Dark**, and **System (Auto)**, persisted in `localStorage` with automated `prefers-color-scheme` media query listeners.
- **Typography & Components:** High-legibility system typography, rounded corners (`14px`–`20px`), soft layered shadows, and high-contrast lime highlights.

---

## 🗺️ Noida Sample Dataset

The platform features realistic, curated listings across major Noida corridors:

1. **PulseFit Elite Athletic Club** (*Sector 104, Hazipur Expressway*)
   - *Verified Marketplace Partner*
   - Facilities: Heated pool, steam/sauna, Olympic lifting, CrossFit turf, women-only slot (11:30 AM–1:00 PM).
   - Starts at ₹3,200/month. Free 1-Day Trial available.
2. **Gold's Gym - Sector 104** (*Research Reference / Demo Listing*)
   - Clearly labeled: *Demo Listing - Unverified Reference*. Rates and terms confirmed on direct inquiry.
3. **Titan Forge Strength & Conditioning** (*Sector 62, Institutional Area*)
   - *Verified Marketplace Partner*
   - Facilities: 24/7 RFID biometric access, Eleiko competition plates, chalk-friendly power racks, deadlift platforms.
   - Starts at ₹2,200/month.
4. **Fitness First - The Great India Place** (*Sector 38A, GIP Mall*)
   - Clearly labeled: *Demo Listing - Research Reference*. Corporate wellness and Les Mills studio reference.
5. **Zenith Studio & Reformer Pilates** (*Sector 50, Central Noida*)
   - *Verified Marketplace Partner*
   - Facilities: Allegro 2 Reformers, barre, small batches, dedicated female sessions.
6. **Noida Arena 24/7 Fitness Hub** (*Sector 18 Metro & Mall District*)
   - *Verified Marketplace Partner*
   - Facilities: Full boxing ring, 24-hour smart access, multi-level cardio zone, steam bath.
7. **Vanguard Athletic Club** (*Sector 127, Tech Boulevard*)
   - *Verified Marketplace Partner*
   - Facilities: Indoor 30m sprint track, ice baths, corporate flex pause policies.
8. **Apex Iron Gym** (*Sector 153, Expressway Link*)
   - *Verified Marketplace Partner*
   - Facilities: Heavy iron up to 60kg, early 5:30 AM access, student-friendly rates from ₹1,400/month.
9. **Aura Wellness & CrossGym** (*Sector 76, Metro Corridor*)
   - *Verified Marketplace Partner*
   - Facilities: Semi-Olympic swimming pool, steam/sauna, functional turf, women-only pool timings.

---

## 🚀 How to Run the Website

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox, Safari).
- Desktop or mobile phone browser.

### Option 1: Start Local Server with Provided Launcher

From this directory (`C:\Users\user\.gemini\antigravity\scratch\fitnoida-marketplace`):

```powershell
.\bin\node.cmd server.js
```

Then open your browser and navigate to:
```
http://localhost:3000
```

### Option 2: Run with Standard Node.js

If you have Node.js installed in your environment:

```bash
node server.js
```
The server will start at `http://localhost:3000`.

### Option 3: Run the Automated Validation Suite

```powershell
.\bin\node.cmd scripts/test-server.js
```
This validates all 9 gym schemas, coordinates, API endpoints, trial pass issuing, membership vouchers, and onboarding submissions.

---

## 📱 Mobile & Touch Readiness

- **Responsive Viewports:** Tested and optimized for mobile screens (360px–430px), tablets (768px–1024px), and desktop widescreen monitors (1280px+).
- **Touch-Friendly Targets:** Buttons, checkboxes, and sector chips satisfy WCAG standards (minimum 44x44px tap targets).
- **Mobile Filter Drawer:** A slide-up bottom sheet for filter adjustments on phones without cluttering screen real estate.
- **Mobile Bottom Navigation:** Quick access to Explore, Map, Saved Gyms, and Owner Portal.
- **Interactive Map:** Responsive SVG map of Noida with pinch/pan compatibility, dynamic sector nodes, and gym pins.

---

## ⚖️ Marketplace Integrity & Demo Notice

- **Payment Gateway:** Configured in **Demo Mode**. Users can test selecting payment methods (UPI, Card, Pay at Gym Reception) to preview confirmation receipts and QR passes without financial charges.
- **Research References:** Recognized brands (such as Gold's Gym Sec 104 and Fitness First GIP) are labeled explicitly as independent research examples to avoid implying unverified partnership.
- **Gym Onboarding:** When a gym owner submits a listing via `/list-your-gym`, it is marked as "Under Verification" until the physical ground audit is completed.
