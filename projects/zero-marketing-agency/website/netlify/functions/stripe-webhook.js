import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Webhook endpoint secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': process.env.URL || 'https://thezeromethod.com',
    'Content-Type': 'application/json',
  };

  try {
    const sig = event.headers['stripe-signature'];
    const body = event.body;

    let stripeEvent;

    // Verify webhook signature
    try {
      stripeEvent = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        
        // Payment was successful
        console.log('Payment successful:', session.id);
        console.log('Customer email:', session.customer_email);
        console.log('Tier:', session.metadata?.tier);
        console.log('Amount:', session.amount_total);

        // Here you would:
        // 1. Send welcome email with download link
        // 2. Store customer in your database
        // 3. Grant access to the product
        // 4. Trigger fulfillment workflow

        // Example: You could call your email service here
        // await sendWelcomeEmail(session.customer_email, session.metadata.tier);
        
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        // Handle async payment (e.g., bank transfer)
        const session = stripeEvent.data.object;
        console.log('Async payment succeeded:', session.id);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        // Handle failed async payment
        const session = stripeEvent.data.object;
        console.log('Async payment failed:', session.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Webhook processing failed',
        message: error.message 
      }),
    };
  }
}