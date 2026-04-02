# Zero Method - Website Build Plan

**Domain:** thezeromethod.com  
**Platform:** Astro (static site generator)  
**Hosting:** Vercel or Netlify (free tier)  
**Status:** Building now

---

## Site Architecture

```
thezeromethod.com
├── / (Homepage)
│   ├── Hero section
│   ├── Problem agitation
│   ├── Solution overview
│   ├── Social proof
│   ├── CTA to product
│   └── Email capture
│
├── /product (Sales page)
│   ├── Full product details
│   ├── Pricing tiers
│   ├── FAQ
│   └── Purchase CTA
│
├── /blog (Content hub)
│   └── SEO-optimized articles
│
├── /about (Brand story)
│   └── Mission, values, founder
│
├── /contact (Contact page)
│   └── Form + social links
│
└── /free (Lead magnet)
    └── Email capture for free guide
```

---

## Technical Stack

**Framework:** Astro (fast, SEO-friendly, static)
**Styling:** Tailwind CSS (modern, responsive)
**CMS:** Markdown + Git (simple, version controlled)
**Forms:** ConvertKit (free tier) or self-hosted
**Analytics:** Google Analytics 4 + Search Console
**Images:** Optimized, WebP format
**Fonts:** Inter (Google Fonts) - clean, professional

---

## Design System

### Colors
- **Primary:** #0F172A (Deep navy)
- **Secondary:** #F59E0B (Gold/amber)
- **Background:** #FFFFFF (White)
- **Surface:** #F8FAFC (Light gray)
- **Text Primary:** #1E293B (Dark slate)
- **Text Secondary:** #64748B (Slate)

### Typography
- **Headings:** Inter, 700 weight
- **Body:** Inter, 400 weight
- **Accent:** Inter, 600 weight

### Spacing
- Consistent 8px grid system
- Generous whitespace (premium feel)
- Mobile-first responsive

---

## Page Specifications

### Homepage

**Hero Section:**
- Headline: "The AI Prompts That Save 10 Hours a Week"
- Subheadline: "50+ battle-tested prompts for ChatGPT, Claude & Gemini"
- CTA: "Get the Playbook" → /product
- Visual: Clean mockup or abstract AI visualization

**Problem Section:**
- Headline: "You're drowning in busywork"
- Pain points: Endless emails, reports, proposals
- Visual: Before/after concept

**Solution Section:**
- Headline: "What if AI did the heavy lifting?"
- Value props: Time saved, stress reduced, output improved
- Preview of what's inside

**Social Proof:**
- Testimonials (placeholder for now)
- "Join 100+ professionals"

**Email Capture:**
- "Get 5 free prompts"
- Email input + CTA

**Footer:**
- Links: Product, Blog, About, Contact
- Social links
- Legal: Privacy, Terms

### Product Page (/product)

**Hero:**
- Product name: "The AI Productivity Suite"
- Tagline: "The complete system for AI-powered work"
- Price: Starting at $49

**What's Included:**
- Strategic Playbook (80+ pages)
- Prompt Library (50+ templates)
- Video Walkthroughs (5 videos)
- Prompt Builder Worksheet
- Notion template

**Pricing Tiers:**
| Tier | Price | Best For | Includes |
|------|-------|----------|----------|
| Essential | $49 | Individuals | Playbook + Library |
| Professional | $79 | Managers | Everything |
| Agency | $149 | Teams | Everything + resale rights |

**FAQ Section:**
- Is this for beginners?
- Which AI tools work with this?
- What's the refund policy?
- How do I access the content?

**CTA:**
- "Get instant access"
- Gumroad/Stripe integration

### Blog (/blog)

**Layout:**
- Clean article cards
- Featured post
- Categories: AI Strategy, Productivity, Workflows
- Author bio

**First 3 Articles:**
1. "The 5 AI Prompts Every Professional Should Know"
2. "How I Cut My Reporting Time by 80%"
3. "Building an AI-Powered Workflow: A Step-by-Step Guide"

---

## SEO Setup

### Technical SEO
- [ ] SSL certificate (HTTPS)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs
- [ ] Schema markup (Product, Article, Organization)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Fast loading (Core Web Vitals)

### Content SEO
- [ ] Keyword research per article
- [ ] Meta titles & descriptions
- [ ] Header structure (H1, H2, H3)
- [ ] Internal linking
- [ ] Image alt tags
- [ ] Clean URLs

---

## Build Checklist

### Phase 1: Foundation
- [ ] Initialize Astro project
- [ ] Set up Tailwind CSS
- [ ] Configure fonts (Inter)
- [ ] Create color system
- [ ] Build layout components
- [ ] Set up routing

### Phase 2: Pages
- [ ] Homepage
- [ ] Product page
- [ ] Blog index
- [ ] Blog article template
- [ ] About page
- [ ] Contact page
- [ ] Lead magnet page

### Phase 3: Content
- [ ] Write homepage copy
- [ ] Write product page copy
- [ ] Write first 3 blog posts
- [ ] Create lead magnet page
- [ ] Set up ConvertKit forms

### Phase 4: Polish
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Analytics setup
- [ ] Test all flows

### Phase 5: Deploy
- [ ] Build for production
- [ ] Deploy to Vercel/Netlify
- [ ] Connect domain (DNS)
- [ ] SSL certificate
- [ ] Test live site
- [ ] Submit to Google Search Console

---

## File Structure

```
website/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Pricing.astro
│   │   ├── EmailForm.astro
│   │   └── Testimonial.astro
│   ├── layouts/
│   │   ├── Layout.astro
│   │   └── BlogPost.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── product.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── post-1.md
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── free.astro
│   ├── styles/
│   │   └── global.css
│   └── content/
│       └── blog/
├── public/
│   ├── images/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Timeline

**Day 1 (Today):**
- Initialize project
- Build foundation
- Create layouts

**Day 2:**
- Build pages
- Add content
- Styling pass

**Day 3:**
- Polish & optimize
- Deploy
- Connect domain

**Status:** Building now 🌀
