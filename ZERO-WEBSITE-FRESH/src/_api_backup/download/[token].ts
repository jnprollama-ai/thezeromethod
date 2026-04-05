import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

async function getTokenData(token: string) {
  const tokensFile = path.join(process.cwd(), 'data', 'tokens.json');
  
  try {
    const content = await fs.readFile(tokensFile, 'utf-8');
    const tokens = JSON.parse(content);
    return tokens.find((t: any) => t.token === token) || null;
  } catch {
    return null;
  }
}

async function markAsDownloaded(token: string) {
  const tokensFile = path.join(process.cwd(), 'data', 'tokens.json');
  
  try {
    const content = await fs.readFile(tokensFile, 'utf-8');
    const tokens = JSON.parse(content);
    
    const updatedTokens = tokens.map((t: any) => {
      if (t.token === token) {
        return { ...t, downloaded: true, downloadedAt: new Date().toISOString() };
      }
      return t;
    });
    
    await fs.writeFile(tokensFile, JSON.stringify(updatedTokens, null, 2));
  } catch (error) {
    console.error('Failed to mark token as downloaded:', error);
  }
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const token = params.token;
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const tokenData = await getTokenData(token);
    
    if (!tokenData) {
      return new Response(
        JSON.stringify({ error: 'Invalid download link' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if expired
    const expiresAt = new Date(tokenData.expiresAt);
    if (expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Download link expired' }),
        { status: 410, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Path to the product file
    const downloadPath = path.join(process.cwd(), 'public', 'downloads', 'zero-method-starter-pack.zip');
    
    try {
      const fileBuffer = await fs.readFile(downloadPath);
      
      // Mark as downloaded
      await markAsDownloaded(token);
      
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="zero-method-starter-pack.zip"',
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    } catch (fileError) {
      console.error('File read error:', fileError);
      return new Response(
        JSON.stringify({ error: 'Download file not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};