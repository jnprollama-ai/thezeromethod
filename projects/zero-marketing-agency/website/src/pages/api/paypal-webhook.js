// PayPal Webhook Handler
// Receives payment confirmations from PayPal and triggers product delivery

import nodemailer from 'nodemailer';

// In-memory storage for download tokens (in production, use a database)
export const downloadTokens = new Map();

// Create transporter lazily when needed
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      service: import.meta.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASS
      }
    });
  }
  return transporter;
}

export async function POST({ request }) {
  try {
    // Get the webhook payload
    const payload = await request.json();
    const headers = Object.fromEntries(request.headers);

    // Log the webhook event for debugging
    console.log('PayPal webhook received:', {
      eventType: payload.event_type,
      resourceId: payload.resource?.id,
      status: payload.resource?.status
    });

    // Handle successful payment
    if (payload.event_type === 'CHECKOUT.ORDER.APPROVED' || 
        payload.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      
      // Extract payment details
      const paymentDetails = {
        paymentId: payload.resource.id,
        payerId: payload.resource.payer?.payer_id,
        payerEmail: payload.resource.payer?.email_address,
        amount: payload.resource.purchase_units?.[0]?.amount?.value,
        currency: payload.resource.purchase_units?.[0]?.amount?.currency_code,
        productName: payload.resource.purchase_units?.[0]?.description,
        paymentTimestamp: new Date().toISOString()
      };

      // Log successful payment
      console.log('Payment successful:', paymentDetails);

      // Generate download link
      const downloadToken = generateDownloadToken();
      const downloadLink = `https://thezeromethod.com/download/${downloadToken}`;
      
      // Store download token with expiration (7 days)
      downloadTokens.set(downloadToken, {
        paymentId: paymentDetails.paymentId,
        email: paymentDetails.payerEmail,
        productName: paymentDetails.productName,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      // Send email with download link
      await sendPurchaseConfirmationEmail(paymentDetails.payerEmail, downloadLink, paymentDetails);

      // Return success response
      return new Response(
        JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return success for other events (to prevent PayPal from retrying)
    return new Response(
      JSON.stringify({ success: true, message: 'Event received but not processed' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PayPal webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to generate unique download tokens
function generateDownloadToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Function to send purchase confirmation email
async function sendPurchaseConfirmationEmail(email, downloadLink, paymentDetails) {
  try {
    const mailOptions = {
      from: import.meta.env.FROM_EMAIL,
      to: email,
      subject: 'Your Zero Method Starter Pack is Ready!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Zero Method Purchase Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Thank You for Your Purchase!</h1>
            
            <p>Hello,</p>
            
            <p>We're excited to let you know that your payment for <strong>${paymentDetails.productName}</strong> has been processed successfully.</p>
            
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #0369a1;">📥 Download Your Starter Pack</h2>
              <p>Click the button below to download your Zero Method Starter Pack:</p>
              <p>
                <a href="${downloadLink}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                  Download Now
                </a>
              </p>
              <p style="font-size: 14px; color: #666;">
                This link will expire in 7 days. If you need a new link, simply reply to this email.
              </p>
            </div>
            
            <h3>What's Included:</h3>
            <ul>
              <li>25 battle-tested AI prompts across 5 categories</li>
              <li>10 professional email templates</li>
              <li>High-quality PDF format for easy reading</li>
              <li>Markdown files for developers (bonus)</li>
              <li>1 year of free updates</li>
            </ul>
            
            <h3>Next Steps:</h3>
            <ol>
              <li>Click the download button to get your professional PDF starter pack</li>
              <li>Open the PDF on any device</li>
              <li>Find the prompt that matches your task</li>
              <li>Copy and customize the prompt for your needs</li>
              <li>Paste into ChatGPT, Claude, or your favorite AI tool</li>
            </ol>
            
            <p>If you have any questions or need help using the prompts, simply reply to this email.</p>
            
            <p>Best regards,<br>
            The Zero Method Team</p>
            
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999;">
              Order ID: ${paymentDetails.paymentId}<br>
              Amount: $${paymentDetails.amount} ${paymentDetails.currency}
            </p>
          </div>
        </body>
        </html>
      `
    };

    await getTransporter().sendMail(mailOptions);
    console.log('Purchase confirmation email sent to:', email);
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
  }
}