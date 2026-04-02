// Stripe Webhook Handler
// Receives payment confirmations from Stripe and triggers product delivery

export async function POST({ request }) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    // Verify webhook signature
    const stripeSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;
    
    if (!stripeSecret) {
      console.error('Webhook secret not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }
    
    // Parse the event
    const event = JSON.parse(body);
    
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name || 'Customer';
      const paymentIntent = session.payment_intent;
      
      // Log the successful purchase
      console.log('Payment successful:', {
        email: customerEmail,
        name: customerName,
        paymentIntent: paymentIntent,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Trigger product delivery
      // 1. Save to database
      // 2. Send email with download link
      // 3. Update CRM
      
      // For now, return success
      return new Response(JSON.stringify({ 
        received: true,
        customer: customerEmail,
        status: 'success'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle other events
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
