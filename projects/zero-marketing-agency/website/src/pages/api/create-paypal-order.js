// PayPal Order Creation API
// Environment variables needed:
// PAYPAL_CLIENT_ID - Your PayPal client ID
// PAYPAL_CLIENT_SECRET - Your PayPal client secret

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { price, productName } = body;

    // Get PayPal credentials from environment
    const clientId = import.meta.env.PAYPAL_CLIENT_ID;
    const clientSecret = import.meta.env.PAYPAL_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: 'PayPal not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get access token from PayPal
    const auth = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return new Response(
        JSON.stringify({ error: tokenData.error_description || 'Failed to authenticate with PayPal' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create PayPal order
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: price,
          },
          description: productName,
        }],
        application_context: {
          brand_name: 'Zero Method',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${import.meta.env.URL}/success`,
          cancel_url: `${import.meta.env.URL}/cancel`,
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (orderData.error) {
      return new Response(
        JSON.stringify({ error: orderData.error_description || 'Failed to create PayPal order' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ id: orderData.id, url: orderData.links?.find(link => link.rel === 'approve')?.href }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PayPal order error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}