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

export const GET: APIRoute = async ({ url }) => {
  try {
    const token = url.searchParams.get('token');
    
    if (!token) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Token is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const tokenData = await getTokenData(token);
    
    if (!tokenData) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid token' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if expired
    const expiresAt = new Date(tokenData.expiresAt);
    if (expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Token expired' }),
        { status: 410, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        valid: true,
        email: tokenData.email,
        downloaded: tokenData.downloaded,
        expiresAt: tokenData.expiresAt,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Token validation error:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};