# CleanSweep — Phase 2 Implementation Plan

> **9 Features · 7 New Files · 3 Sprints**  
> Building on top of: `index.html`, `style.css`, `script.js`, `services.html`, `priceestimator.js`, `checkout.html`

---

## Section 01 — Feature Overview

| # | Feature | What It Does | Difficulty | Sprint |
|---|---------|-------------|------------|--------|
| F1 | Login / Signup Page | Auth flow with localStorage session management and navbar state | Medium | Sprint 1 |
| F2 | Order History Page | Saved bookings table persisted across sessions via localStorage | Medium | Sprint 1 |
| F3 | Live Search & Filter | Real-time service card filtering as user types — pure DOM manipulation | Easy | Sprint 1 |
| F4 | Booking Tracker Page | Animated step-by-step status progress shown after booking confirmation | Medium | Sprint 2 |
| F5 | Admin Dashboard | All bookings, revenue stats, popular services chart — full admin view | Hard | Sprint 3 |
| F7 | Loading Screen | 2-second branded splash before homepage loads — app-like feel | Easy | Sprint 1 |
| F8 | Toast Notifications | Slide-in popup replacing all ugly `alert()` calls sitewide | Easy | Sprint 1 |
| F9 | Custom Form Validation | Styled real-time error messages with regex — replaces browser defaults | Medium | Sprint 2 |
| F11 | Service Rating System | Post-service star ratings saved to localStorage, shown on service cards | Medium | Sprint 3 |

---

## Section 02 — Sprint Plan

### Sprint 1 — Quick Wins & Foundation (~2 weeks)

Features: F7, F8, F3, F1, F2

- F7 Loading Screen → `index.html` + `style.css`
- F8 Toast Notifications → `toast.js` (new file)
- F3 Live Search & Filter → `services.html` + `priceestimator.js`
- F1 Login / Signup Page → `login.html` + `auth.js` (both new)
- F2 Order History Page → `order-history.html` (new)

**Deliverable:** Site feels premium, users can sign in and view past orders.

---

### Sprint 2 — Polish the Core Flow (~2 weeks)

Features: F9, F4

- F9 Custom Form Validation → `checkout.html` + `login.html`
- F4 Booking Tracker Page → `tracker.html` (new)

**Deliverable:** Checkout feels like a real product, booking has a post-confirmation journey.

---

### Sprint 3 — Advanced Features (~2 weeks)

Features: F11, F5

- F11 Service Rating System → `rating.js` (new)
- F5 Admin Dashboard → `admin.html` (new)

**Deliverable:** Full admin panel + post-service ratings — looks like a real SaaS product.

---

## Section 03 — New Files to Create

| File | Purpose | Links To |
|------|---------|----------|
| `login.html` | Login and Signup tabs with form UI in CleanSweep brand style | `auth.js`, all pages navbar, `index.html` |
| `auth.js` | Handles `signUp()`, `login()`, `logout()`, `getCurrentUser()` via localStorage | `login.html`, every HTML page (navbar state) |
| `order-history.html` | Table of all past bookings read from `cs_orders` in localStorage | `checkout.html` writes here, navbar My Orders link |
| `tracker.html` | Animated 4-step booking status page, auto-advances on a timer | `checkout.html` redirects here after confirmation |
| `admin.html` | Passcode-gated dashboard with stat cards, bookings table, CSS bar chart | Reads `cs_orders` from localStorage |
| `rating.js` | Reusable `RatingWidget` class — renders stars, saves to `cs_ratings` in localStorage | `tracker.html`, `order-history.html`, `services.html` |
| `toast.js` | Reusable `showToast(message, type)` — slides in from corner, auto-dismisses in 3s | Replaces all `alert()` calls sitewide |

---

## Section 04 — Feature Deep Dives

---

### F7 — Loading Screen
**Sprint 1 · Easy · 1–2 hours**  
**Files:** `index.html`, `style.css`  
**Concept:** CSS animations, JS `setTimeout`

A full-screen branded splash that shows for 2 seconds before homepage content appears. Gives CleanSweep a premium, app-like first impression.

**Steps:**

1. **Add loader HTML** — Add `<div id="loader">` at the very top of `index.html` body with the CleanSweep logo and a CSS spinner inside.
2. **Style it in CSS** — Position fixed, full-screen, `z-index: 9999`, maroon background. Add a `@keyframes spin` animation for the spinner circle.
3. **Hide with JS after 2s** — In `script.js`: `setTimeout(() => loader.classList.add('hidden'), 2000)`. The `hidden` class fades it out with a CSS transition.
4. **Prevent scroll-behind** — Add `body { overflow: hidden }` while loader is active. Remove it once loader hides so the page doesn't scroll underneath.

---

### F8 — Toast Notifications
**Sprint 1 · Easy · 2–3 hours**  
**Files:** `toast.js` (new), `checkout.html`, `login.html`  
**Concept:** DOM `createElement`, CSS transitions

Reusable slide-in popup that replaces every `alert()` across the site. Supports success, error, and info types with auto-dismiss after 3 seconds.

**Steps:**

1. **Create `toast.js`** — Write `showToast(message, type)`. Type can be `'success'`, `'error'`, or `'info'` — each maps to a different background color.
2. **Build toast DOM in JS** — Function creates `<div class="toast">`, sets text, appends to `document.body`. Multiple toasts stack vertically.
3. **Animate in with CSS** — Toast starts at `translateY(100px) opacity 0`. Adding class `show` transitions it to `translateY(0) opacity 1`. Position fixed bottom-right.
4. **Auto-dismiss + close button** — `setTimeout(() => toast.remove(), 3000)` clears it automatically. Also add a ✕ button for manual dismiss.
5. **Replace all `alert()` calls** — In `checkout.html` and `login.html`, swap every `alert('...')` with `showToast('...', 'success')`.

---

### F3 — Live Search & Filter
**Sprint 1 · Easy · 1–2 hours**  
**Files:** `services.html`, `priceestimator.js`  
**Concept:** `input` event listener, DOM show/hide

Search bar above the services grid that hides non-matching cards in real time as the user types. No page reload — pure DOM manipulation.

**Steps:**

1. **Add search bar HTML** — Add `<input id="service-search" placeholder="Search services...">` above the `#services-grid` div in `services.html`.
2. **Style it in CSS** — Rounded full-width input, pink focus border, magnifier icon positioned inside using `padding-left` and an absolutely positioned SVG.
3. **Add filter logic in `priceestimator.js`** — Listen for `'input'` event on the search field. On each keypress, get all `.service-booking-card` elements and compare their title to the query using `.toLowerCase().includes()`.
4. **Show/Hide cards** — Matching cards: `card.style.display = 'flex'`. Non-matching: `card.style.display = 'none'`.
5. **Empty state** — If zero cards match, show a "No services found for X" message inside the grid area.

---

### F1 — Login / Signup Page
**Sprint 1 · Medium · 4–6 hours**  
**Files:** `login.html` (new), `auth.js` (new), all HTML pages  
**Concept:** localStorage, multi-page state, sessions

Two-tab page for Login and Sign Up. User data stored in localStorage. After login, every page's navbar shows the user's name and a Logout button.

**Steps:**

1. **Create `login.html`** — Two-tab UI in CleanSweep style. Login tab: email + password. Sign Up tab: name + email + password + confirm password.
2. **Create `auth.js` with 4 functions** — `signUp()`, `login()`, `logout()`, and `getCurrentUser()`. This file is included on every page via a `<script>` tag.
3. **Store users in localStorage** — On signUp: push `{ name, email, password }` into a `cs_users` array in localStorage. On login: match email + password, save `{ name, email }` to `cs_currentUser`.
4. **Update navbar on all pages** — In `script.js`, call `getCurrentUser()` on load. If user exists → show their name + Logout button. If null → show Login link.
5. **Protect Order History** — At top of `order-history.html`, check `getCurrentUser()`. If null, redirect to `login.html`.

---

### F2 — Order History Page
**Sprint 1 · Medium · 3–4 hours**  
**Files:** `order-history.html` (new), `checkout.html` (update)  
**Concept:** localStorage arrays, dynamic table building

Every confirmed booking is saved to localStorage. This page reads them and displays a table showing order ID, date, services booked, and total amount.

**Steps:**

1. **Update `checkout.html` to save orders** — On booking confirmation, push to `cs_orders` in localStorage: `{ id, date, time, services, total, status: 'Confirmed' }`.
2. **Create `order-history.html`** — Table with columns: Order ID, Date, Services, Total Amount, Status badge. Style consistent with CleanSweep's card aesthetic.
3. **Load and render orders** — On page load, read `cs_orders` from localStorage. Loop through, build a `<tr>` per order, inject into the table body.
4. **Add My Orders to navbar** — Add the link to the navbar on all pages. Only show it when user is logged in (check `getCurrentUser()`).
5. **Empty state design** — If `cs_orders` is empty, show a friendly message with a CTA button: "Book Your First Service" linking to `services.html`.

---

### F9 — Custom Form Validation
**Sprint 2 · Medium · 3–4 hours**  
**Files:** `checkout.html`, `login.html`, `style.css`  
**Concept:** Regex, real-time event handling, inline errors

Replace browser's default red borders with beautifully styled inline error messages that appear below each field as the user types.

**Steps:**

1. **Remove HTML `required` attributes** — Remove `required` from all form inputs. Validation is now fully handled in JS for complete visual control.
2. **Add error spans below each input** — Below each input: `<span class="error-msg" id="name-error"></span>` — empty by default, shown only on failure.
3. **Write `validate()` function** — Name: ≥3 characters. Phone: `/^[0-9]{10}$/`. Date: not in the past. Address: ≥20 characters. Each failure sets the error span text and adds class `input-error`.
4. **Clear errors on input** — On each field's `'input'` event, clear its error message and remove `input-error` class — errors disappear as the user corrects them.
5. **Style error states in CSS** — `.error-msg { color: #D32F2F; font-size: 0.85rem; margin-top: 4px; }` and `.input-error { border-color: #D32F2F !important; }`

---

### F4 — Booking Tracker Page
**Sprint 2 · Medium · 3–5 hours**  
**Files:** `tracker.html` (new), `checkout.html` (redirect update)  
**Concept:** `setTimeout`, CSS class toggling, progress states

After booking confirmation, redirect to an animated status page. Steps auto-advance every few seconds: Confirmed → Expert Assigned → On The Way → Arrived.

**Steps:**

1. **Update checkout redirect** — Change `window.location.href = 'index.html'` to `'tracker.html'` in `checkout.html`.
2. **Create `tracker.html` timeline** — 4 step cards in a vertical timeline. Each has an icon, title, and subtitle. A connecting vertical line runs between steps.
3. **Style active vs pending steps** — Pending step: grey hollow circle. Active step: filled pink circle + card background changes. Add CSS `transition` for smooth color change.
4. **Auto-advance with JS** — Chain `setTimeout` calls: after 2s add `active` to step 2, after 5s to step 3, after 9s to step 4.
5. **Show booking info + rating CTA** — Read last order from `cs_orders`, display service names and total at the top. When Arrived step triggers, show "Rate your experience" button.

---

### F11 — Service Rating System
**Sprint 3 · Medium · 4–5 hours**  
**Files:** `rating.js` (new), `tracker.html`, `services.html`, `order-history.html`  
**Concept:** Reusable JS class, aggregate localStorage data

After a booking tracker reaches "Arrived", users can rate each booked service 1–5 stars. Average ratings are stored in localStorage and shown on each service card.

**Steps:**

1. **Create `RatingWidget` class in `rating.js`** — Constructor takes a `serviceId` and a container element. Renders 5 clickable star icons using Unicode ★ and ☆.
2. **Handle star interaction** — On hover: fill stars up to that index gold. On click: lock in selection. On mouseout: revert to selected state if one is chosen.
3. **Save rating to localStorage** — Read `cs_ratings`. Update: `cs_ratings[serviceId] = { sum: oldSum + newRating, count: oldCount + 1 }`. Save back.
4. **Show average on services page** — In `priceestimator.js`, after rendering each card, calculate `average = sum / count` and render a small star display below the service title.
5. **Integrate with Order History** — Show "Rate Now" button on unrated completed orders. Show submitted rating if already rated.

---

### F5 — Admin Dashboard
**Sprint 3 · Hard · 6–8 hours**  
**Files:** `admin.html` (new), reads `cs_orders` from localStorage  
**Concept:** Data aggregation, CSS charts, passcode auth

A passcode-gated admin page showing all bookings, total revenue, average order value, most popular service, and a CSS bar chart. The most impressive feature in the plan.

**Steps:**

1. **Passcode gate** — On page load, `prompt()` for admin password. Compare to a hardcoded value. If wrong, redirect to `index.html`.
2. **Create `admin.html` layout** — Dark sidebar navigation, main content area. Different visual language from user pages — should feel like a real admin panel.
3. **4 stat cards at top** — Total Bookings, Total Revenue (₹), Average Order Value, Top Service. Calculate all from `cs_orders`. Animate numbers counting up on load.
4. **Full bookings table** — Columns: Order ID, Customer Name, Services, Amount, Date, Status. Status column has a dropdown to update it, which saves back to `cs_orders` in localStorage.
5. **CSS bar chart** — Count how many times each service appears across all orders. For each service, render a bar whose width is `(count / maxCount) * 100%`. Pure CSS — no libraries needed.

---

## Section 05 — Technology Decisions

| Feature Area | Technology / Method | Why This Approach |
|---|---|---|
| Data Storage | `localStorage` (browser built-in) | No backend needed. Data persists across sessions. Perfect for a frontend-only project. |
| Session Management | `localStorage` key `cs_currentUser` | Simple, readable — no cookies or JWT complexity needed for a college demo. |
| Animations | CSS transitions + JS class toggling | No animation libraries. CSS handles visuals, JS just adds/removes classes. |
| Toast System | Vanilla JS `createElement()` | Creating elements in JS and appending to body is a fundamental skill teachers love to see. |
| Form Validation | Regex + `input` event listeners | Regular expressions for phone/email validation show real-world JS knowledge. |
| Star Ratings | Unicode ★ ☆ + CSS + JS | Avoids SVG complexity while still looking great. |
| Admin Chart | Pure CSS `width %` bars | CSS-only charts show creativity — no Chart.js dependency for a simple visual. |
| Code Organisation | Separate JS modules (`auth.js`, `toast.js`, `rating.js`) | Splitting logic into files shows you understand separation of concerns. |

---

## Section 06 — Why This Will Impress Your Teachers

| What Teachers Look For | Feature That Shows It | Why It Impresses Them |
|---|---|---|
| User Authentication Flow | F1: Login / Signup | Shows understanding of sessions, user state, and multi-page data sharing — something most students never attempt. |
| Data Persistence | F2: Order History + F11: Ratings | Most students lose data on refresh. localStorage persistence immediately sets you apart. |
| Real-time Interactivity | F3: Live Search | Filtering service cards live as you type is visually impressive and demonstrates clean event handling. |
| UX Awareness | F8: Toast Notifications | Replacing `alert()` with custom toasts shows you think about user experience — a professional-level decision. |
| Multi-step User Flows | F4: Booking Tracker | Animated progress states show you can think about real app user journeys, not just pages. |
| Data Analysis / Reporting | F5: Admin Dashboard | Most students never build an admin view. It stands out every single time. |
| Input Validation | F9: Custom Form Validation | Custom validation with regex and inline errors is a practical, real-world skill rarely seen in college projects. |
| Code Organisation | `toast.js` + `auth.js` + `rating.js` | Splitting logic into separate JS files shows you understand separation of concerns — not everything crammed into one script. |

---

*CleanSweep Phase 2 — 9 Features · 7 New Files · 3 Sprints*
