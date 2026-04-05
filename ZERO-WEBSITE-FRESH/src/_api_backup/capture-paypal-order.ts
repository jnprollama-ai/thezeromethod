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
    const { orderId } = await request.json();
    
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const accessToken = await getPayPalAccessToken();
    const env = import.meta.env.PAYPAL_ENVIRONMENT || 'sandbox';
    
    const captureResponse = await fetch(
      `${PAYPAL_API_BASE[env === 'production' ? 'production' : 'sandbox']}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!captureResponse.ok) {
      throw new Error('Failed to capture PayPal order');
    }
    
    const captureData = await captureResponse.json();
    
    return new Response(
      JSON.stringify({ 
        status: 'success',
        orderId: captureData.id,
        payerEmail: captureData.payer?.email_address,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('PayPal capture error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to capture PayPal order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};