// Stripe Checkout Session API
// Environment variables needed:
// STRIPE_SECRET_KEY - Your Stripe secret key

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;

    // Get Stripe secret from environment
    const stripeSecret = import.meta.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecret) {
      return new Response(
        JSON.stringify({ error: 'Stripe not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create Stripe checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'payment_method_types[]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'success_url': successUrl,
        'cancel_url': cancelUrl,
        'automatic_tax[enabled]': 'false',
      }),
    });

    const session = await response.json();

    if (session.error) {
      return new Response(
        JSON.stringify({ error: session.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ id: session.id, url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
