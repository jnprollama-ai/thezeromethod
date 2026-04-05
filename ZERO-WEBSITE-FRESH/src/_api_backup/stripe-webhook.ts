import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

async function sendEmail(email: string, downloadUrl: string) {
  const resendApiKey = import.meta.env.RESEND_API_KEY;
  const emailFrom = import.meta.env.EMAIL_FROM || 'downloads@thezeromethod.com';
  
  if (!resendApiKey) {
    console.warn('Resend API key not configured. Email not sent.');
    return;
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Zero Method <${emailFrom}>`,
        to: email,
        subject: 'Your Zero Method AI Prompts Starter Pack - Download Ready',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0891b2;">Thank you for your purchase!</h1>
            <p>Your Zero Method AI Prompts Starter Pack is ready for download.</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>What you\'re getting:</strong></p>
              <ul>
                <li>25 AI prompts (PDF + Markdown)</li>
                <li>10 email templates</li>
                <li>Usage instructions</li>
              </ul>
            </div>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${downloadUrl}" style="background: linear-gradient(to right, #22d3ee, #a855f7); color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Download Now
              </a>
            </p>
            <p style="color: #64748b; font-size: 14px;">
              This download link will expire in 7 days. If you have any issues, reply to this email.
            </p>
          </div>
        `,
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to send email:', await response.text());
    }
  } catch (error) {
    console.error('Email sending error:', error);
  }
}

async function storeToken(token: string, email: string) {
  const dataDir = path.join(process.cwd(), 'data');
  const tokensFile = path.join(dataDir, 'tokens.json');
  
  let tokens: any[] = [];
  
  try {
    const existing = await fs.readFile(tokensFile, 'utf-8');
    tokens = JSON.parse(existing);
  } catch {
    // File doesn't exist or is empty
  }
  
  tokens.push({
    token,
    email,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    downloaded: false,
    downloadedAt: null,
  });
  
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(tokensFile, JSON.stringify(tokens, null, 2));
}

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      import.meta.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid signature' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (session.payment_status === 'paid') {
      const token = generateToken();
      const email = session.customer_email || session.customer_details?.email;
      
      if (email) {
        await storeToken(token, email);
        
        const downloadUrl = `${import.meta.env.APP_URL || 'https://thezeromethod.com'}/download/${token}`;
        await sendEmail(email, downloadUrl);
        
        console.log(`Payment confirmed for ${email}. Token: ${token}`);
      }
    }
  }
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};