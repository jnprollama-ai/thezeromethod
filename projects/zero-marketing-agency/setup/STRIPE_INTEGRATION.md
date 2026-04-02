# Stripe Integration Guide — Zero Method

**Account:** Test Mode (Development)
**Currency:** USD
**Platform:** Stripe Checkout (Hosted)
**Domain:** thezeromethod.com

---

## API Keys (Stored in TOOLS.md)

**⚠️ SECURITY WARNING:**
- **Publishable Key** (`pk_test_...`) → Safe for frontend
- **Secret Key** (`sk_test_...`) → SERVER-SIDE ONLY, never expose to browser

**Test Mode:** All transactions are simulated. No real money moves.

---

## Product Setup

### Products to Create in Stripe Dashboard

**Product 1: Essential ($49)**
```
Name: The AI Productivity Suite — Essential
Description: 80-page playbook + 50 prompt templates
Price: $49.00 (one-time)
```

**Product 2: Professional ($79)**
```
Name: The AI Productivity Suite — Professional
Description: Everything + video walkthroughs + worksheets
Price: $79.00 (one-time)
```

**Product 3: Agency ($149)**
```
Name: The AI Productivity Suite — Agency
Description: Everything + resale rights + white label license
Price: $149.00 (one-time)
```

### Create in Stripe Dashboard:
1. Go to: https://dashboard.stripe.com/products
2. Click "Add product"
3. Fill in details for each tier
4. Save Product IDs (price_...)

---

## Payment Flow Architecture

```
Customer Clicks "Buy" → Stripe Checkout Session → Payment → Webhook → Deliver Product
```

### Option A: Stripe Checkout (Recommended)
**Pros:**
- PCI compliant (Stripe handles everything)
- Mobile-optimized
- Built-in fraud detection
- Easy to implement

**Cons:**
- Customer leaves your site briefly
- Less customization

### Option B: Stripe Elements (Custom)
**Pros:**
- Fully branded experience
- Customer stays on your site
- More control

**Cons:**
- More complex
- Need PCI compliance handling
- Longer setup

**Decision:** Use **Stripe Checkout** for speed and simplicity.

---

## Integration Steps

### Step 1: Backend Setup (Required)

You need a server endpoint to create checkout sessions. Options:

**A. Netlify Functions** (Recommended, free tier)
**B. Vercel Serverless Functions**
**C. Simple Node.js server**

### Step 2: Frontend Integration

Add to your Astro website:

```javascript
// On "Buy" button click
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: 'price_...', // From Stripe dashboard
    email: customerEmail // Optional
  })
});

const session = await response.json();
window.location.href = session.url; // Redirect to Stripe Checkout
```

### Step 3: Webhook for Delivery

Stripe sends webhook when payment succeeds:

```javascript
// Endpoint: /api/webhook
// Stripe sends: checkout.session.completed

// Actions:
1. Verify webhook signature (security)
2. Get customer email from session
3. Send email with product download link
4. Log sale in CRM
5. Trigger welcome sequence
```

---

## Code Implementation

### Create Checkout Session (Netlify Function)

```javascript
// netlify/functions/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { priceId, email } = JSON.parse(event.body);
  
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/cancel`,
      customer_email: email,
      metadata: {
        product: 'ai-productivity-suite'
      }
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Webhook Handler (Netlify Function)

```javascript
// netlify/functions/webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let stripeEvent;
  
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    return { statusCode: 400, body: 'Invalid signature' };
  }
  
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    
    // TODO: Send email with download link
    // TODO: Log in CRM
    // TODO: Add to email sequence
    
    console.log('Payment successful:', session.customer_email);
  }
  
  return { statusCode: 200, body: 'Received' };
};
```

### Frontend: Product Page

```astro
---
const PRICES = {
  essential: 'price_...', // Replace with actual Stripe price IDs
  professional: 'price_...',
  agency: 'price_...'
};
---

<div class="pricing-card">
  <h3>Essential</h3>
  <div class="price">$49</div>
  <button 
    class="btn-primary" 
    data-price={PRICES.essential}
    onclick="checkout(this.dataset.price)"
  >
    Get Essential
  </button>
</div>

<script>
async function checkout(priceId) {
  const button = document.activeElement;
  button.disabled = true;
  button.textContent = 'Loading...';
  
  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    });
    
    const session = await response.json();
    window.location.href = session.url;
  } catch (error) {
    alert('Error: ' + error.message);
    button.disabled = false;
    button.textContent = 'Try Again';
  }
}
</script>
```

---

## Environment Variables (Netlify/Vercel)

Add these in dashboard:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe CLI)
```

---

## Testing

### Test Card Numbers

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Date: Any future date
- CVC: Any 3 digits

**Declined Payment:**
- Card: `4000 0000 0000 0002`

**Requires Authentication:**
- Card: `4000 0025 0000 3155`

### Test Process

1. Click "Buy" on website
2. Stripe Checkout loads (test mode badge visible)
3. Enter test card
4. Complete payment
5. Webhook fires
6. Email sent
7. Redirect to success page

---

## Going Live (When Ready)

### Steps:

1. **Create Live Stripe Account**
   - Activate account in dashboard
   - Add bank details for payouts

2. **Switch Keys**
   - Replace `pk_test_...` with `pk_live_...`
   - Replace `sk_test_...` with `sk_live_...`
   - Update environment variables

3. **Test Live Mode**
   - Use real card for $1 test
   - Refund immediately

4. **Monitor**
   - Watch Stripe dashboard for payments
   - Check webhook deliveries
   - Verify email delivery

---

## Fee Comparison

| Platform | Fee | Payout |
|----------|-----|--------|
| **Gumroad** | 10% + processing | Weekly |
| **Stripe** | 2.9% + 30¢ | 2-7 days |
| **PayPal** | 2.9% + 30¢ | Instant |

**Savings on $79 sale:**
- Gumroad: $7.90 fee
- Stripe: $2.59 fee
- **You keep: $5.31 more per sale**

---

## Security Checklist

- [x] Secret key never exposed to frontend
- [x] Webhook signatures verified
- [x] HTTPS only (enforced by Stripe)
- [x] Customer data encrypted at rest
- [x] PCI compliance handled by Stripe Checkout

---

## Next Steps

1. Create products in Stripe dashboard
2. Get price IDs (price_...)
3. Set up Netlify/Vercel functions
4. Configure webhooks
5. Test with test card
6. Go live

---

**Questions?** Check Stripe docs: https://stripe.com/docs/payments/checkout

**Zero Method Payment System v1.0**
