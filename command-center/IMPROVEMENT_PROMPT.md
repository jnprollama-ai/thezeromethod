# Command Center Improvement Prompt

## Context
You are reviewing the Command Center v3.0 - a Node.js + Express + Socket.io dashboard for managing AI agents, projects, content, and operations for Zero Marketing Agency.

**Current State:**
- 8 modules: Dashboard, Agents, Projects, Blogs, Social, SaaS, Trading, Chat
- 8 AI agents with Pokemon avatars and model switching capability
- Real-time updates via Socket.io
- JSON file storage (status.json, blog files)
- Twitter bot integration
- OpenRouter API for multi-model LLM access

**Pain Points:**
1. No authentication - open access
2. JSON file storage - risk of corruption, no backups
3. Limited error handling
4. No search functionality
5. Mobile responsiveness needs work
6. No analytics/metrics

---

## Your Task

Improve the Command Center with these priorities:

### Priority 1: Data Persistence & Reliability
**Current:** JSON files
**Goal:** SQLite database with automatic backups

**Implementation:**
- Replace file I/O with SQLite (better-sqlite3)
- Create tables: agents, projects, blogs, social_posts, status_logs
- Add migration script from JSON → SQLite
- Implement automatic hourly backups
- Add data integrity checks

**Why:** Prevents data loss, enables concurrent access, ACID compliance

---

### Priority 2: Authentication & Security
**Current:** None
**Goal:** Simple session-based auth with role-based access

**Implementation:**
- Add login page
- Session middleware (express-session)
- Two roles: admin (Jon), viewer (Zero)
- Protect API endpoints with middleware
- Store passwords hashed (bcrypt)

**Why:** Prevents unauthorized changes, enables multi-user support

---

### Priority 3: Error Handling & Logging
**Current:** Console.log, basic try-catch
**Goal:** Structured logging with error recovery

**Implementation:**
- Add Winston logger
- Log levels: error, warn, info, debug
- Error boundary component in UI
- Automatic retry on failed API calls
- Email alerts on critical errors

**Why:** Debugging, monitoring, prevents silent failures

---

### Priority 4: Search & Discovery
**Current:** Manual browsing
**Goal:** Global search across all modules

**Implementation:**
- Search bar in navbar
- Index: projects, blogs, agents, tasks
- Fuzzy search (fuse.js)
- Filter by type, status, date
- Recent searches

**Why:** Scale - as content grows, findability becomes critical

---

### Priority 5: Analytics Dashboard
**Current:** Basic metrics display
**Goal:** Comprehensive analytics with charts

**Implementation:**
- Add Chart.js for visualizations
- Agent usage over time
- Token cost trends
- Project velocity (tasks completed/week)
- Content performance (blogs, social)
- Export to CSV/PDF

**Why:** Data-driven decisions, ROI visibility

---

### Priority 6: Mobile Responsiveness
**Current:** Desktop-first, some views broken on mobile
**Goal:** Fully responsive, touch-optimized

**Implementation:**
- CSS Grid/Flexbox improvements
- Touch-friendly buttons (min 44px)
- Collapsible sidebar for mobile
- Swipe gestures for navigation
- PWA support (service worker)

**Why:** Access from anywhere, tablet support

---

### Priority 7: Notification System
**Current:** None
**Goal:** Real-time and email notifications

**Implementation:**
- Toast notifications for actions
- Email alerts for:
  - Budget thresholds exceeded
  - Agent errors
  - Scheduled post failures
  - Project deadline approaching
- Notification preferences per user

**Why:** Proactive monitoring, prevents missed deadlines

---

### Priority 8: Testing & Quality
**Current:** No tests
**Goal:** Unit and integration tests

**Implementation:**
- Jest for testing
- Supertest for API endpoints
- Test coverage: 70% minimum
- CI/CD pipeline (GitHub Actions)
- Pre-commit hooks (husky)

**Why:** Prevents regressions, enables confident refactoring

---

## Implementation Strategy

**Phase 1 (Week 1):** Data + Auth
- SQLite migration
- Basic auth
- Error logging

**Phase 2 (Week 2):** UX Improvements
- Search
- Mobile responsiveness
- Notifications

**Phase 3 (Week 3):** Analytics + Polish
- Charts
- Testing
- Documentation

---

## Success Criteria

- [ ] Zero data loss during SQLite migration
- [ ] Login/logout working with session persistence
- [ ] Search returns results in <500ms
- [ ] Mobile view usable on iPhone/Android
- [ ] All API endpoints have tests
- [ ] Analytics show meaningful insights
- [ ] No console errors in production

---

## Constraints

- **Budget:** $0 (use free/open source)
- **Tech Stack:** Keep Node.js/Express (don't rewrite)
- **Uptime:** Must maintain existing functionality
- **Data:** Preserve all existing data
- **Timeline:** 3 weeks max

---

## Deliverables

1. Updated server.js with SQLite integration
2. New auth.js middleware
3. Database schema file
4. Migration script
5. Updated HTML with mobile optimizations
6. Test suite
7. Updated documentation

---

## Questions to Consider

1. Should we keep Socket.io or migrate to Server-Sent Events?
2. SQLite or PostgreSQL for future scaling?
3. JWT vs Session cookies for auth?
4. Hosted analytics or self-hosted (Matomo)?
5. Should we add Redis for caching?

---

**Start with Priority 1. Show incremental improvements. Test each phase before proceeding.**

**Remember:** Zero's voice - direct, no fluff, focus on what works.