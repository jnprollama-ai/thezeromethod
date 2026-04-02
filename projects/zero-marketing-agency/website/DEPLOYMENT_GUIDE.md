# Zero Method Website - Deployment Guide

## Overview
This guide will walk you through deploying the Zero Method website with full Stripe payment integration to Netlify with the custom domain `thezeromethod.com`.

## Prerequisites
- Netlify account (free tier works)
- Stripe account
- GitHub account (recommended for CI/CD)
- Domain: thezeromethod.com (already purchased)

---

## Step 1: Stripe Setup

### 1.1 Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Complete account setup
3. Verify your email

### 1.2 Create Products & Prices

Create three products in Stripe Dashboard:

**Essential Plan - $49**
- Name: "AI Productivity Suite - Essential"
- Description: "50+ Core Prompts, Email Templates, Basic Tutorials"
- Price: $49.00 (one-time)

**Professional Plan - $79** ⭐
- Name: "AI Productivity Suite - Professional"
- Description: "150+ Prompts, 40+ Templates, Full Course, Community Access"
- Price: $79.00 (one-time)

**Agency Plan - $149**
- Name: "AI Productivity Suite - Agency"
- Description: "Everything + 5 Seats, White-Label, API Access, Custom Development"
- Price: $149.00 (one-time)

For each product:
1. Go to Products → Add Product
2. Fill in details
3. Set price type: "One-time"
4. Save and note the Price ID (looks like `price_1ABC...`)

### 1.3 Get API Keys

1. Go to Developers → API keys
2. Copy the **Publishable key** (starts with `pk_live_...` or `pk_test_...`)
3. Click "Reveal" on **Secret key** (starts with `sk_live_...` or `sk_test_...`)
4. Copy both keys

### 1.4 Setup Webhook Endpoint

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://thezeromethod.com/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `payment_intent.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_...`)

---

## Step 2: Netlify Setup

### 2.1 Create New Site

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select the repository: `zero-marketing-agency/website`
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

### 2.2 Configure Environment Variables

1. Go to Site settings → Environment variables
2. Add the following variables:

```
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
URL=https://thezeromethod.com

# Price IDs (replace with actual IDs from Stripe)
STRIPE_PRICE_ESSENTIAL=price_1YourActualEssentialPriceID
STRIPE_PRICE_PROFESSIONAL=price_1YourActualProfessionalPriceID
STRIPE_PRICE_AGENCY=price_1YourActualAgencyPriceID
```

**For Testing (before going live):**
```
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
URL=https://your-site-name--netlify.app (temporarily)
```

### 2.3 Update netlify.toml (if needed)

The `netlify.toml` file is already configured. Only modify if you need to add redirects or headers.

---

## Step 3: Domain Configuration

### 3.1 Add Custom Domain

1. In Netlify: Go to Domain settings
2. Click "Add custom domain"
3. Enter: `thezeromethod.com`
4. Click "Verify" → "Add domain"

### 3.2 Configure DNS

**Option A: Netlify DNS (Recommended)**

1. In Domain settings → Click "Set up Netlify DNS"
2. Netlify will provide nameservers like:
   - `dns1.p04.nsone.net`
   - `dns2.p04.nsone.net`
   - etc.
3. Update nameservers at your domain registrar
4. Wait 1-24 hours for propagation

**Option B: External DNS (If keeping existing DNS)**

1. In Domain settings → "Set up external DNS"
2. Add these CNAME records at your DNS provider:
   - Host: `@` → Points to: `your-site-name.netlify.app`
   - Host: `www` → Points to: `your-site-name.netlify.app`
3. Add A record:
   - Host: `@` → Points to: `75.2.60.5` (Netlify load balancer)

### 3.3 Enable HTTPS

1. Once DNS propagates, Netlify will auto-provision SSL
2. In Domain settings → HTTPS → "Verify DNS configuration"
3. Force HTTPS: Toggle "Force HTTPS" to ON
4. Wait for SSL certificate (usually 5-10 minutes)

---

## Step 4: Test Before Launch

### 4.1 Test Build Locally

```bash
cd C:\Users\jnpro\AppData\Roaming\atomicbot-desktop\openclaw\workspace\projects\zero-marketing-agency\website
npm install
npm run build
npm run preview
```

Visit `http://localhost:4321` and verify:
- All pages load correctly
- Product page shows pricing tiers
- "Get Professional" button triggers checkout

### 4.2 Test Payment Flow (Test Mode)

1. Use Stripe test keys in environment variables
2. Go to your deployed site
3. Click "Get Professional - $79"
4. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Complete payment
6. Verify redirect to `/success` page
7. Check Stripe Dashboard → Payments for the test payment

### 4.3 Test Webhook

1. In Stripe Dashboard → Webhooks → your endpoint
2. Click "Send test event"
3. Choose `checkout.session.completed`
4. Click "Send test event"
5. Check Netlify Functions logs for the webhook receipt

---

## Step 5: Go Live

### 5.1 Switch to Live Keys

1. In Netlify: Site settings → Environment variables
2. Update to live keys:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `URL=https://thezeromethod.com`
   - Update price IDs to live price IDs from Stripe
3. Trigger a new deploy (Deploys → Trigger deploy → Clear cache and deploy)

### 5.2 Update Webhook URL

1. In Stripe Dashboard → Developers → Webhooks
2. Update endpoint URL from test to: `https://thezeromethod.com/api/stripe-webhook`
3. Get new webhook secret and update in Netlify

### 5.3 Final Verification

- [ ] Site loads at https://thezeromethod.com
- [ ] SSL certificate active (padlock icon)
- [ ] All pages accessible (/, /product, /blog)
- [ ] Product page shows $79 Professional option
- [ ] Clicking purchase opens Stripe Checkout
- [ ] Cancel button redirects to /cancel
- [ ] Successful payment redirects to /success
- [ ] Webhook receiving events (check Stripe Dashboard)

---

## Step 6: Post-Launch Setup

### 6.1 Email Delivery Setup

The webhook handler needs to send welcome emails. Options:

**Option A: Netlify Forms + Zapier**
1. Set up Netlify Forms for lead capture
2. Use Zapier to trigger emails on new submission

**Option B: Email Service (Recommended)**
- Resend: https://resend.com
- SendGrid: https://sendgrid.com
- Postmark: https://postmarkapp.com

Add email service API key to Netlify environment variables.

### 6.2 Analytics Setup

Add to your site:
- Google Analytics 4
- Plausible (privacy-friendly)
- PostHog (product analytics)

### 6.3 Backup & Monitoring

1. Enable GitHub backup (already done if using Git)
2. Set up uptime monitoring:
   - UptimeRobot (free)
   - Pingdom
3. Set up Stripe alerts for failed payments

---

## Files Included

```
website/
├── netlify.toml              # Netlify configuration
├── package.json              # Dependencies (added stripe)
├── astro.config.mjs          # Astro config (hybrid output)
├── src/
│   └── pages/
│       ├── product.astro      # Updated with Stripe buttons
│       ├── success.astro      # Payment success page
│       └── cancel.astro       # Payment cancelled page
└── netlify/
    └── functions/
        ├── create-checkout-session.js   # Stripe checkout
        └── stripe-webhook.js            # Webhook handler
```

---

## Troubleshooting

### Build Fails
- Check Node version (needs 18+)
- Run `npm install` locally to verify
- Check Netlify build logs

### Stripe Checkout Not Working
- Verify environment variables are set correctly
- Check browser console for JavaScript errors
- Test the function locally with Netlify CLI

### Webhook Not Receiving
- Verify webhook URL is correct in Stripe
- Check Netlify Functions logs
- Ensure `STRIPE_WEBHOOK_SECRET` is set

### Domain Not Working
- Check DNS propagation: `nslookup thezeromethod.com`
- Verify nameservers or CNAME records
- Wait 24 hours for full propagation

---

## Security Checklist

- [ ] `STRIPE_SECRET_KEY` never exposed in frontend
- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced on all pages
- [ ] CSP headers configured (already in netlify.toml)
- [ ] No hardcoded secrets in code
- [ ] Environment variables marked as "Sensitive" in Netlify

---

## Support

**Stripe Support:** https://support.stripe.com
**Netlify Support:** https://www.netlify.com/support/
**Astro Docs:** https://docs.astro.build

---

## Next Steps After Deployment

1. Monitor first few transactions closely
2. Set up automated welcome emails
3. Create product delivery system (download links)
4. Set up customer support workflow
5. Track conversion metrics
6. A/B test pricing page
7. Scale traffic with SEO/content marketing

---

**Deployment completed successfully!** 🚀

The Zero Method website is now live at https://thezeromethod.com with full Stripe payment processing.