// Download Endpoint
// Serves the product file when a valid download token is provided

// Import the download tokens map from the webhook handler
import { downloadTokens } from './paypal-webhook.js';

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const token = url.pathname.split('/').pop();
    
    // Check if token exists
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Invalid download link' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is valid
    const downloadInfo = downloadTokens.get(token);
    if (!downloadInfo) {
      return new Response(
        JSON.stringify({ error: 'Download link not found or expired' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if token has expired
    if (new Date() > downloadInfo.expiresAt) {
      // Clean up expired token
      downloadTokens.delete(token);
      return new Response(
        JSON.stringify({ error: 'Download link has expired' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log download attempt
    console.log('Download initiated:', {
      token,
      email: downloadInfo.email,
      productName: downloadInfo.productName
    });

    // Serve the actual product file
    const fs = (await import('fs')).default;
    const path = (await import('path')).default;
    
    const filePath = path.join(process.cwd(), 'public', 'downloads', 'zero-method-starter-pack.zip');
    
    try {
      const file = await fs.promises.readFile(filePath);
      
      return new Response(file, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="zero-method-starter-pack.zip"'
        }
      });
    } catch (fileError) {
      console.error('File read error:', fileError);
      return new Response(
        JSON.stringify({ error: 'File not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Download error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}