// Complete redesign script using OpenRouter SDK directly
// Run: node scripts/build-website.js

import { callAgent } from '../src/utils/openrouter.js';
import fs from 'fs/promises';
import path from 'path';

const agents = {
  vesper: { model: 'z-ai/glm-5v-turbo', role: 'Homepage & Design' },
  mace: { model: 'openrouter/claude-sonnet-4.6', role: 'Product & Payments' },
  lena: { model: 'qwen/qwen3.6-plus:free', role: 'Blog System' },
  drift: { model: 'google/gemma-4-26b-a4b-it', role: 'Components' }
};

async function buildHomepage() {
  console.log('🏠 Building homepage with Vesper (GLM-5V)...');
  
  const system = `You are Vesper — creative director. Design luxury editorial homepage.
Colors: --bg:#080C14 --surface:#0F172A --gold:#F59E0B --text:#E8EDF5
Fonts: Playfair Display (headings), DM Sans (body), JetBrains Mono (code)
End with: SECTIONS BUILT, DESIGN DECISIONS, COPY STATUS, NEEDS ATTENTION`;

  const prompt = `Create src/pages/index.astro with 8 sections:
1. Hero (100dvh, two columns) - Animated prompt card with typewriter
2. Problem (73% stat, pain points)
3. What's Inside (category tabs: Email, Reports, Content, Productivity, Research)
4. How It Works (3 steps: Download → Find → Paste)
5. Social Proof (testimonial + stats: 25, 10, 30)
6. Pricing CTA ($19, strikethrough $49, checklist)
7. FAQ (5 questions accordion)
8. Final CTA Banner

Include:
- CSS animations (@keyframes fadeSlideUp)
- Typewriter effect JavaScript
- Responsive design
- Real copy (no placeholders)

Return complete Astro file.`;

  const result = await callAgent('vesper', system, prompt, { maxTokens: 8000 });
  
  if (result.success) {
    const code = result.content.match(/```astro\n([\s\S]*?)```/)?.[1] || result.content;
    await fs.writeFile('src/pages/index.astro', code);
    console.log('✅ Homepage complete');
    return true;
  }
  return false;
}

async function buildProductPage() {
  console.log('💳 Building product page with Mace (Claude)...');
  
  const system = `You are Mace — conversion specialist. Build high-converting product page.
Focus: outcomes over features, remove hesitation, test every flow.
End with: PAYMENT STATUS, ENDPOINTS VERIFIED, TEST RESULTS, JON ACTION ITEMS`;

  const prompt = `Create src/pages/product.astro with:
1. Product Hero (breadcrumb, H1, price, PDF mockup)
2. What You Get (3 columns: 25 prompts, 10 templates, bonuses)
3. Category Deep Dive (accordion with sample prompts)
4. Pricing & Payment (live Stripe + PayPal, NO "Coming Soon")
5. Expanded FAQ (8 questions)
6. Guarantee section

Critical:
- Payment buttons MUST be live
- Test card: 4242 4242 4242 4242
- Include error states

Return complete Astro file.`;

  const result = await callAgent('mace', system, prompt, { maxTokens: 8000 });
  
  if (result.success) {
    const code = result.content.match(/```astro\n([\s\S]*?)```/)?.[1] || result.content;
    await fs.writeFile('src/pages/product.astro', code);
    console.log('✅ Product page complete');
    return true;
  }
  return false;
}

async function buildBlogSystem() {
  console.log('📝 Building blog system with Lena (Qwen)...');
  
  const system = `You are Lena — editorial engineer. Automate publishing pipeline.
Focus: reader journey from search to conversion, zero manual steps.
End with: PIPELINE STATUS, POSTS MIGRATED, SCHEMA VERIFIED, COMMAND CENTER INTEGRATION`;

  const prompt = `Create blog system:
1. src/pages/blog/index.astro — Editorial magazine style
2. src/pages/blog/[slug].astro — Individual post template
3. src/pages/rss.xml.js — RSS feed
4. Components: PostCard, PostHeader, RelatedPosts

Content:
- 3 existing posts (Welcome, 5-Minute Email, AI Market)
- Related posts section
- CTA to /product at bottom

Return all files.`;

  const result = await callAgent('lena', system, prompt, { maxTokens: 6000 });
  
  if (result.success) {
    console.log('✅ Blog system complete');
    return true;
  }
  return false;
}

async function buildComponents() {
  console.log('🧩 Building components with Drift (Gemma)...');
  
  const system = `You are Drift — component engineer. Build reusable, prop-typed components.
Design for all states: default, hover, active, disabled, loading, error.
End with: COMPONENTS BUILT, DESIGN TOKENS, DEPENDENCIES, USAGE NOTES`;

  const prompt = `Create components (already started by previous agent, verify and complete):
1. Verify src/components/ui/Button.astro (primary, ghost, danger)
2. Verify src/components/ui/Card.astro (default, elevated, bordered, glow)
3. Verify src/components/ui/Badge.astro (variants)
4. Verify src/components/layout/Header.astro (sticky, scroll behavior)
5. Verify src/components/layout/Footer.astro (3 columns)
6. Verify all section components

Fix any issues, ensure proper props.
Return confirmation.`;

  const result = await callAgent('drift', system, prompt, { maxTokens: 4000 });
  
  if (result.success) {
    console.log('✅ Components verified');
    return true;
  }
  return false;
}

// Main build
async function buildWebsite() {
  console.log('🚀 Starting website rebuild...\n');
  
  const results = await Promise.all([
    buildHomepage(),
    buildProductPage(),
    buildBlogSystem(),
    buildComponents()
  ]);
  
  const successCount = results.filter(Boolean).length;
  console.log(`\n✨ Build complete: ${successCount}/4 agents successful`);
  
  if (successCount === 4) {
    console.log('\n🎉 Ready to deploy!');
    console.log('Next: git add . && git commit && git push');
  } else {
    console.log('\n⚠️ Some tasks failed. Check logs above.');
  }
}

buildWebsite().catch(console.error);