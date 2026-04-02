import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const PRICE_IDS = {
  essential: 'price_1TH9CFB0SuyNKPsMOgM021or',
  professional: 'price_1TH9CkB0SuyNKPsMayNxCuCJ',
  agency: 'price_1TH9D9B0SuyNKPsM3kx0be7k',
};

export default async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.URL || 'https://thezeromethod.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { tier, customerEmail } = JSON.parse(event.body);

    // Validate tier
    if (!tier || !PRICE_IDS[tier]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid tier specified' }),
      };
    }

    const priceId = PRICE_IDS[tier];

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: `${process.env.URL || 'https://thezeromethod.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://thezeromethod.com'}/cancel`,
      automatic_tax: { enabled: true },
      metadata: {
        tier,
        product: 'ai-productivity-suite',
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create checkout session',
        message: error.message 
      }),
    };
  }
}