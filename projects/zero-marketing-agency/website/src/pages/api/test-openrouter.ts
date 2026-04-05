import type { APIRoute } from 'astro';
import { callAgent } from '../../utils/openrouter.js';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const agent = url.searchParams.get('agent') || 'scout';
  
  try {
    // Simple test prompt
    const result = await callAgent(
      agent,
      `You are ${agent}, a helpful AI assistant. Keep responses brief.`,
      "Say hello and confirm you're working. One sentence."
    );

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        agent,
        model: result.model,
        response: result.content,
        usage: result.usage
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        agent,
        model: result.model,
        error: result.error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      note: "Check if OPENROUTER_API_KEY is set in Vercel dashboard"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};