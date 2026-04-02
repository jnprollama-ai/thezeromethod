# Zero Method Website

A premium Astro website for thezeromethod.com - AI Productivity Suite

## Tech Stack

- **Framework:** Astro 4.15+
- **Styling:** Tailwind CSS 3.4+
- **Fonts:** Inter (Google Fonts)
- **Colors:** Deep Navy (#0F172A), Gold (#F59E0B), White/Clean

## Project Structure

```
/
├── public/                 # Static assets
│   └── favicon.svg        # Site favicon
├── src/
│   ├── components/        # Astro components
│   │   ├── Header.astro   # Site navigation
│   │   └── Footer.astro   # Site footer
│   ├── layouts/           # Page layouts
│   │   └── Layout.astro   # Base layout with SEO
│   ├── pages/             # Site pages
│   │   ├── index.astro    # Homepage
│   │   ├── product.astro  # Product/pricing page
│   │   └── blog/          # Blog section
│   │       ├── index.astro      # Blog listing
│   │       └── [slug].astro     # Blog post template
│   └── styles/            # Global styles (if needed)
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind configuration
└── package.json           # Dependencies
```

## Pages

1. **Homepage (/)** - Hero, problem/solution, email capture, testimonials, CTA
2. **Product Page (/product)** - Features, pricing tiers, FAQ, purchase CTAs
3. **Blog Index (/blog)** - Article cards with categories
4. **Blog Post (/blog/[slug])** - Individual article template

## Design System

### Colors
- **Primary Dark:** #0F172A (navy-950)
- **Primary Accent:** #F59E0B (gold-500)
- **Text White:** #FFFFFF
- **Text Muted:** #94A3B8 (navy-400)

### Typography
- **Font Family:** Inter (sans-serif)
- **Headings:** Bold (700-800)
- **Body:** Regular (400)

### Spacing
- Base unit: 8px
- Sections: 80-128px vertical padding
- Components: 16-32px gaps

## Development

### Install Dependencies
```bash
npm install
```

### Start Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment (Vercel)

### Method 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project directory:
```bash
cd C:\Users\jnpro\AppData\Roaming\atomicbot-desktop\openclaw\workspace\projects\zero-marketing-agency\website
vercel
```

4. Follow prompts to link to thezeromethod.com

### Method 2: GitHub + Vercel Integration

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Connect to thezeromethod.com domain
4. Deploy automatically on push to main

### Domain Configuration

1. In Vercel dashboard, go to Project Settings → Domains
2. Add `thezeromethod.com`
3. Follow DNS configuration instructions
4. SSL certificate auto-provisioned

## Key Features

- ✅ Mobile-first responsive design
- ✅ SEO-ready meta tags and Open Graph
- ✅ Fast loading (<2s target)
- ✅ Semantic HTML structure
- ✅ Professional typography and spacing
- ✅ Email capture forms ready for integration
- ✅ Gumroad-ready purchase links

## Performance Targets

- Lighthouse Performance: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <2s
- Cumulative Layout Shift: <0.1

## Contact

Built by Zero Marketing Agency
Website: https://thezeromethod.com
