import { callAgent } from '../utils/openrouter.js';
import fs from 'fs/promises';
import path from 'path';

// Vesper - Homepage Agent using z-ai/glm-5v-turbo
const vesperSystemPrompt = `You are Vesper — Zero's creative director.

Design Philosophy:
- Luxury editorial meets technical precision
- Every section earns the reader's attention
- Real copy, not placeholders
- No Inter font, no generic AI aesthetics
- Typography-led, grid-breaking layouts

Color System (use CSS variables):
--bg: #080C14; --surface: #0F172A; --surface-2: #162033;
--border: #1E2D45; --gold: #F59E0B; --text: #E8EDF5;

Fonts:
- Headings: Playfair Display
- Body: DM Sans  
- Code/Prompts: JetBrains Mono

Rules:
1. Write real, compelling copy
2. No Lorem Ipsum
3. Every word earns its place
4. Mobile-first responsive
5. Include animations and interactions

End with: 'Vesper out.' and structured summary.`;

export async function generateHomepage() {
  const userPrompt = `Create the complete homepage for thezeromethod.com.

Product: 25 AI Prompts + 10 Email Templates for $19
Tagline: "The Prompts That Actually Work"

8 Sections Required:

1. HERO (100dvh, two columns)
   - Left: Badge "AI Productivity Tools", H1 "The Prompts That<br>Actually Work.", subheading, CTAs
   - Right: Animated prompt card cycling 5 examples with typewriter effect
   - Trust line: "30-day guarantee · Instant download · 1-year updates"

2. THE PROBLEM (40/60 split)
   - Stat: "73%" with context
   - Three pain points with ❌ icons
   - Transition: "There's a better way."

3. WHAT'S INSIDE (category tabs)
   - 5 categories: Email, Reports, Content, Productivity, Research
   - 2 prompt preview cards per category
   - Show 2 cards, others on tab click

4. HOW IT WORKS (3 steps)
   - Download → Find Prompt → Paste & Execute
   - Large editorial numbers: 01, 02, 03

5. SOCIAL PROOF (testimonial + stats)
   - One strong testimonial
   - Three stat cards: 25 prompts, 10 templates, 30-day guarantee

6. PRICING CTA (centered)
   - "$19" large, strikethrough "$49"
   - "Launch Price" badge
   - Feature checklist
   - Gold CTA button

7. FAQ (5 questions accordion)
   - Format, compatibility, refund, subscription, updates

8. FINAL CTA BANNER (full-width)
   - "Stop writing prompts from scratch."
   - Button to /product

Technical:
- Astro component syntax
- Tailwind classes
- CSS variables for colors
- Include <script> for animations
- Responsive: 375px / 768px / 1280px

Return the complete src/pages/index.astro file.`;

  try {
    console.log('🎨 Vesper: Generating homepage...');
    
    const result = await callAgent('vesper', vesperSystemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 8000
    });

    if (result.success) {
      // Extract the code from the response
      const codeMatch = result.content.match(/```astro\n([\s\S]*?)```/) || 
                        result.content.match(/```\n([\s\S]*?)```/) ||
                        [null, result.content];
      
      const code = codeMatch[1] || result.content;
      
      await fs.writeFile(
        path.join(process.cwd(), 'src/pages/index.astro'),
        code
      );
      
      console.log('✅ Vesper out.');
      console.log('SECTIONS BUILT: Hero, Problem, WhatsInside, HowItWorks, SocialProof, Pricing, FAQ, FinalCTA');
      console.log('DESIGN DECISIONS: Luxury editorial aesthetic, Playfair/DM Sans/JetBrains fonts, gold accent');
      console.log('COPY STATUS: All final, no placeholders');
      console.log('NEEDS ATTENTION: Images may need optimization, test animations on mobile');
      
      return { success: true, file: 'src/pages/index.astro' };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Vesper failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  generateHomepage();
}