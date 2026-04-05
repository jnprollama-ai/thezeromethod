import type { APIRoute } from 'astro';

const PAYPAL_API_BASE = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  production: 'https://api-m.paypal.com',
};

async function getPayPalAccessToken() {
  const clientId = import.meta.env.PAYPAL_CLIENT_ID;
  const secret = import.meta.env.PAYPAL_SECRET;
  const env = import.meta.env.PAYPAL_ENVIRONMENT || 'sandbox';
  
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE[env === 'production' ? 'production' : 'sandbox']}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }
  
  const data = await response.json();
  return data.access_token;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const accessToken = await getPayPalAccessToken();
    const env = import.meta.env.PAYPAL_ENVIRONMENT || 'sandbox';
    
    const orderResponse = await fetch(`${PAYPAL_API_BASE[env === 'production' ? 'production' : 'sandbox']}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '19.00',
            },
            description: 'Zero Method AI Prompts Starter Pack',
            custom_id: email,
          },
        ],
        application_context: {
          return_url: `${import.meta.env.APP_URL || 'https://thezeromethod.com'}/success?paypal=true`,
          cancel_url: `${import.meta.env.APP_URL || 'https://thezeromethod.com'}/product`,
        },
      }),
    });
    
    if (!orderResponse.ok) {
      throw new Error('Failed to create PayPal order');
    }
    
    const orderData = await orderResponse.json();
    
    // Find the approve link
    const approveLink = orderData.links.find((link: any) => link.rel === 'approve');
    
    return new Response(
      JSON.stringify({ 
        orderId: orderData.id,
        url: approveLink?.href || null 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('PayPal order error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create PayPal order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};