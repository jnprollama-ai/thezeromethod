# Zero Method — Brand Identity Guidelines

**Version:** 1.0  
**Date:** March 31, 2026  
**Brand Essence:** AI-powered productivity for professionals who demand excellence

---

## 1. Brand Story

### Mission
Zero Method helps busy professionals reclaim 10+ hours a week through battle-tested AI prompts and systems. No fluff. No complexity. Just results.

### Vision
A world where knowledge work is amplified, not replaced, by AI — where professionals focus on high-value thinking while AI handles the repetitive.

### Values
- **Efficiency:** Every system must earn its place
- **Clarity:** Complex made simple
- **Results:** Proof over promises
- **Respect:** For time, intelligence, and craft

### Brand Promise
"The zero-friction way to 10x your productivity with AI"

---

## 2. Logo System

### Primary Logo

**Concept:** A stylized spiral representing:
- The zero in "Zero Method"
- Continuous improvement and iteration
- The cyclical nature of workflows
- Motion and momentum

**Design:**
```
┌─────────────────────────────┐
│                             │
│         🌀 ZERO             │
│           METHOD            │
│                             │
└─────────────────────────────┘
```

**Logo Mark:** The spiral symbol can stand alone
**Logo Type:** "ZERO METHOD" in Inter Bold, tracking +2%
**Clear Space:** Minimum 1x spiral diameter on all sides

### Logo Variations

| Variation | Use Case | File Format |
|-----------|----------|-------------|
| **Primary** | Main branding, headers | SVG, PNG |
| **Inverse** | Dark backgrounds | SVG (white version) |
| **Icon Only** | Favicons, app icons, small spaces | SVG, PNG (512px, 192px, 32px) |
| **Horizontal** | Narrow spaces, navbars | SVG, PNG |
| **Monochrome** | Single-color applications | SVG |

### Logo Construction

**Spiral Symbol:**
- Stroke width: 8px at full size
- Gap between curves: 4px
- 2.5 complete rotations
- Tilted 15° clockwise for dynamism

**Typography:**
- "ZERO": Inter Bold, 24px (scale as needed)
- "METHOD": Inter Medium, 14px, letter-spacing 3px
- Line height: 1.1

### Logo Colors

| Background | Logo Treatment |
|------------|----------------|
| Light (#FFFFFF) | Full color (Navy + Cyan accent) |
| Dark (#0A0A0F) | White text, cyan spiral |
| Color (#00D4FF) | White knockout |

### Logo Don'ts
- ❌ Don't stretch or distort
- ❌ Don't change the spiral color on dark backgrounds
- ❌ Don't add drop shadows
- ❌ Don't place on busy backgrounds
- ❌ Don't rotate the spiral
- ❌ Don't use different fonts

---

## 3. Color Palette

### Primary Colors

**Navy Deep** — Our anchor
- Hex: `#0A0A0F`
- RGB: 10, 10, 15
- CMYK: 70, 60, 40, 90
- Usage: Primary backgrounds, headers, dark sections

**Navy Secondary**
- Hex: `#12121A`
- RGB: 18, 18, 26
- Usage: Card backgrounds, panels

**Navy Tertiary**
- Hex: `#1A1A2E`
- RGB: 26, 26, 46
- Usage: Elevated surfaces, hover states

### Accent Colors

**Cyan Electric** — Primary accent, energy
- Hex: `#00D4FF`
- RGB: 0, 212, 255
- CMYK: 60, 0, 10, 0
- Usage: CTAs, links, highlights, active states

**Purple Voltage** — Secondary accent, innovation
- Hex: `#B829DD`
- RGB: 184, 41, 221
- Usage: Gradients, secondary buttons, emphasis

**Amber Alert** — Attention, warmth
- Hex: `#FF9500`
- RGB: 255, 149, 0
- Usage: Warnings, limited offers, urgent CTAs

### Semantic Colors

**Success Green**
- Hex: `#00FF88`
- Usage: Success states, confirmations, growth metrics

**Warning Yellow**
- Hex: `#FFCC00`
- Usage: Caution, pending states

**Error Red**
- Hex: `#FF3366`
- Usage: Errors, critical alerts, removal actions

### Neutral Colors

**Text Primary**
- Hex: `#E0E0FF`
- Usage: Headlines, primary text

**Text Secondary**
- Hex: `#8B8BB0`
- Usage: Body text, captions, metadata

**Borders/Dividers**
- Hex: `#2D2D44`
- Usage: Borders, separators, subtle dividers

### Color Usage Ratios

| Usage | Percentage | Colors |
|-------|------------|--------|
| Backgrounds | 70% | Navy Deep, Navy Secondary |
| Surfaces | 20% | Navy Tertiary, subtle overlays |
| Accents | 8% | Cyan, Purple, Amber |
| Semantic | 2% | Green, Yellow, Red (as needed) |

### Gradients

**Primary Gradient:**
```css
background: linear-gradient(135deg, #00D4FF 0%, #B829DD 100%);
```
Usage: Hero sections, primary buttons, highlights

**Dark Gradient:**
```css
background: linear-gradient(180deg, #12121A 0%, #0A0A0F 100%);
```
Usage: Section transitions, depth

**Glow Effects:**
```css
box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
```
Usage: Focus states, important elements

---

## 4. Typography

### Primary Font: Inter

**Weights:**
- Regular (400) — Body text
- Medium (500) — Subheadings, labels
- Semi-Bold (600) — Navigation, buttons
- Bold (700) — Headlines, emphasis

**Alternative:** System font stack for performance
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **H1** | 48px / 3rem | 700 | 1.1 | -0.02em |
| **H2** | 36px / 2.25rem | 700 | 1.2 | -0.01em |
| **H3** | 28px / 1.75rem | 600 | 1.3 | 0 |
| **H4** | 24px / 1.5rem | 600 | 1.3 | 0 |
| **H5** | 20px / 1.25rem | 600 | 1.4 | 0.01em |
| **H6** | 16px / 1rem | 600 | 1.4 | 0.02em |
| **Body Large** | 18px / 1.125rem | 400 | 1.6 | 0 |
| **Body** | 16px / 1rem | 400 | 1.6 | 0 |
| **Body Small** | 14px / 0.875rem | 400 | 1.5 | 0 |
| **Caption** | 12px / 0.75rem | 500 | 1.4 | 0.02em |
| **Label** | 11px / 0.6875rem | 600 | 1.2 | 0.05em |

### Monospace Font: JetBrains Mono

**Usage:** Code snippets, data display, technical elements

**Weights:**
- Regular (400) — Code blocks
- Bold (700) — Emphasis in code

**Size:** 14px for code blocks, 13px for inline code

### Typography Patterns

**Headlines:**
- Color: `#E0E0FF`
- Maximum 3 lines
- No widows/orphans

**Body Text:**
- Color: `#8B8BB0`
- Maximum 75 characters per line
- Line height 1.6 for readability

**Captions/Labels:**
- All caps for labels
- Letter spacing 0.05em
- Color: `#8B8BB0` or `#00D4FF` for accent labels

---

## 5. Imagery & Visual Style

### Photography Style

**Aesthetic:**
- Dark, moody, cinematic
- High contrast
- Desaturated with cyan/blue color grading
- Professional environments
- Clean, minimal compositions

**Subject Matter:**
- Professionals in focused work (not stock "business smile")
- Clean, modern workspaces
- Technology in context
- Abstract data visualizations
- Minimalist product shots

**Treatment:**
- Darken shadows (crushed blacks)
- Lift highlights slightly
- Add subtle cyan/blue tint to shadows
- Keep skin tones natural

### Illustrations

**Style:**
- Minimalist line art
- Single-weight strokes (2px)
- Monochrome or dual-tone (navy + cyan)
- Abstract representations of concepts
- No gradients in illustrations

**Iconography:**
- 24px grid system
- 2px stroke weight
- Rounded caps and corners (2px radius)
- Consistent optical sizing

### Patterns & Textures

**Grid Pattern:**
```css
background-image: 
  linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
background-size: 50px 50px;
```

**Scanlines:**
```css
background: repeating-linear-gradient(
  0deg,
  rgba(0, 0, 0, 0.03),
  rgba(0, 0, 0, 0.03) 1px,
  transparent 1px,
  transparent 2px
);
```

**Glow Effects:**
- Subtle: `box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);`
- Medium: `box-shadow: 0 0 30px rgba(0, 212, 255, 0.2);`
- Strong: `box-shadow: 0 0 40px rgba(0, 212, 255, 0.3);`

---

## 6. UI Components

### Buttons

**Primary Button:**
```css
background: linear-gradient(135deg, #00D4FF, #B829DD);
color: #0A0A0F;
padding: 14px 28px;
border-radius: 6px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
```

**Secondary Button:**
```css
background: transparent;
border: 1px solid #00D4FF;
color: #00D4FF;
padding: 14px 28px;
border-radius: 6px;
```

**Ghost Button:**
```css
background: transparent;
color: #8B8BB0;
padding: 12px 24px;
```

### Cards

**Standard Card:**
```css
background: #12121A;
border: 1px solid #2D2D44;
border-radius: 8px;
padding: 24px;
```

**Elevated Card:**
```css
background: #1A1A2E;
border: 1px solid #00D4FF;
border-radius: 8px;
padding: 24px;
box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
```

### Inputs

**Text Input:**
```css
background: #0A0A0F;
border: 1px solid #2D2D44;
border-radius: 6px;
padding: 12px 16px;
color: #E0E0FF;
```

**Focus State:**
```css
border-color: #00D4FF;
box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
```

### Navigation

**Navbar:**
- Background: `#0A0A0F` with 80% opacity + blur
- Border-bottom: 1px solid `#2D2D44`
- Height: 72px

**Nav Links:**
- Color: `#8B8BB0`
- Hover: `#E0E0FF`
- Active: `#00D4FF` with underline

---

## 7. Voice & Tone

### Brand Voice

**Confident but not arrogant**
- "This works" not "This might work"
- "Proven system" not "New idea"

**Direct but not cold**
- Short sentences
- Active voice
- No corporate filler

**Expert but accessible**
- Explain complex things simply
- No gatekeeping jargon
- Assume intelligence

**Results-focused**
- Lead with outcomes
- Specific numbers over vague promises
- "Save 10 hours" not "be more productive"

### Tone Guidelines

| Context | Tone | Example |
|---------|------|---------|
| Homepage | Confident, aspirational | "Reclaim 10 hours a week" |
| Product page | Clear, benefit-driven | "50 prompts that actually work" |
| Email | Personal, helpful | "Here's what worked for me..." |
| Social | Snappy, insightful | "The prompt that changed my workflow 🧵" |
| Support | Patient, solution-oriented | "Let's fix this together" |

### Writing Patterns

**Headlines:**
- Action-oriented
- Specific outcomes
- No questions (use statements)
- Maximum 6 words

Examples:
- "Save 10 Hours a Week"
- "The AI Prompts That Work"
- "Built for Professionals"
- "Zero Complexity, Maximum Results"

**Body Copy:**
- 2-3 sentence paragraphs
- One idea per paragraph
- Scannable with bold keywords
- Second-person ("you")

**CTAs:**
- Command verbs
- Clear outcome
- Urgency (when appropriate)

Examples:
- "Get the Playbook"
- "Start Saving Time"
- "Download Free Guide"
- "Join 100+ Professionals"

---

## 8. Brand Applications

### Website

**Homepage Structure:**
1. Hero: Headline + subheadline + CTA + visual
2. Problem: Agitate the pain
3. Solution: Introduce the method
4. Social proof: Logos, testimonials
5. Product: What's included
6. CTA: Final conversion push
7. FAQ: Handle objections

**Product Page Structure:**
1. Hero: Product name + price + primary CTA
2. What's included: Visual breakdown
3. Who it's for: Target audience
4. Results: Before/after, testimonials
5. Pricing: Tier comparison
6. FAQ: Common questions
7. Final CTA: Risk reversal

### Social Media

**Profile:**
- Avatar: Logo mark (spiral)
- Banner: Navy gradient with brand tagline
- Bio: "AI prompts that save 10 hours a week | Built for professionals"

**Content Types:**
- Thread: "The 5 AI prompts every [profession] should know"
- Carousel: Step-by-step prompt tutorial
- Single: Quick tip with bold visual
- Video: Screen recording of prompt in action

### Email

**Newsletter:**
- Header: Logo + navigation
- Body: Single-column, 600px max width
- CTA: High-contrast button
- Footer: Social links + unsubscribe

**Colors in email:**
- Background: `#0A0A0F`
- Text: `#E0E0FF`
- Links: `#00D4FF`
- Buttons: Cyan gradient

### Product Materials

**Ebook:**
- Cover: Spiral logo mark, bold title, dark gradient
- Interior: Navy pages (#12121A), cyan headers
- Typography: Inter throughout

**Templates (Notion):**
- Cover: Branded header image
- Colors: Match palette
- Icons: Custom icon set in brand colors

---

## 9. File Naming Convention

```
zeromethod-
├── logo/
│   ├── zeromethod-logo-primary.svg
│   ├── zeromethod-logo-inverse.svg
│   ├── zeromethod-logo-icon.svg
│   ├── zeromethod-logo-horizontal.svg
│   ├── zeromethod-logo-monochrome.svg
│   └── favicon/
│       ├── favicon-512.png
│       ├── favicon-192.png
│       └── favicon-32.png
├── colors/
│   └── zeromethod-color-palette.ase (Adobe Swatches)
├── typography/
│   └── zeromethod-fonts.zip
├── templates/
│   ├── zeromethod-social-templates.fig
│   ├── zeromethod-presentation.pptx
│   └── zeromethod-email-template.html
└── guidelines/
    └── zeromethod-brand-guidelines.pdf
```

---

## 10. Brand Checklist

Before publishing anything:

- [ ] Logo used correctly (no distortion)
- [ ] Colors from approved palette
- [ ] Typography follows scale
- [ ] Sufficient contrast (WCAG AA)
- [ ] Consistent spacing (8px grid)
- [ ] Voice matches guidelines
- [ ] No competitor colors/fonts
- [ ] Legal pages included (Privacy, Terms)

---

**Questions?** Contact Zero Method Operations

**Last Updated:** March 31, 2026

---

*Zero Method Brand Identity System © 2026*
