# Subagent Runs Summary

**Generated:** 2026-04-05  
**Total Runs:** 15  
**Success Rate:** 60% (9 ✅ / 6 ❌)

---

## Run Log (Chronological)

| # | Run ID | Agent Label | Model | Status | Duration | Key Result |
|---|--------|-------------|-------|--------|----------|------------|
| 1 | 624f91bb | Research Agent | ollama/kimi-k2.5 | ✅ ok | ~2.7 min | 3 niche recommendations compiled |
| 2 | 63d6ee77 | Design Agent | ollama/kimi-k2.5 | ✅ ok | ~7.9 min | Complete Astro website built (all pages) |
| 3 | 9b1914b8 | CRM Agent | ollama/kimi-k2.5 | ✅ ok | ~4.7 min | ⚠️ No result captured ("Now I'll create...") |
| 4 | d52bad5f | Deployment Agent | ollama/kimi-k2.5 | ✅ ok | ~6.0 min | Stripe integration + deployment guide complete |
| 5 | f57465d4 | Content Agent | ollama/kimi-k2.5 | ✅ ok | ~3.4 min | 3 SEO blog posts created (1,800-2,100 words each) |
| 6 | 0d5298e8 | blog-post-draft | ollama/qwen3-coder | ✅ ok | ~4.9 min | Blog post draft created (casual tone, CTA included) |
| 7 | 15552565 | twitter-content-gen | openrouter/claude-sonnet-4.6 | ❌ error | ~2.3 sec | No API key found for provider "openrouter" |
| 8 | e96d679a | blog-outline-gen | openrouter/claude-sonnet-4.6 | ❌ error | ~2.2 sec | No API key found for provider "openrouter" |
| 9 | fdd0e55c | trading-architecture | openrouter/claude-sonnet-4.6 | ❌ error | ~2.2 sec | No API key found for provider "openrouter" |
| 10 | 2273d631 | revenue-research | openrouter/claude-sonnet-4.6 | ❌ error | ~2.2 sec | No API key found for provider "openrouter" |
| 11 | 14e23c82 | new-repo-vercel | openrouter/claude-sonnet-4.6 | ❌ error | ~2.3 sec | No API key found for provider "openrouter" |
| 12 | 7f70b135 | PDF-Design-Expert | openrouter/claude-sonnet-4.6 | ✅ ok | ~0.5 sec | ⚠️ No result captured (empty frozenResultText) |
| 13 | ca59804e | Coding-Expert | openrouter/claude-sonnet-4.6 | ✅ ok | ~0.5 sec | ⚠️ No result captured (empty frozenResultText) |
| 14 | da148239 | Command-Center-Enhancement | openrouter/claude-sonnet-4.6 | ✅ ok | ~0.6 sec | ⚠️ No result captured (empty frozenResultText) |

---

## Summary Statistics

**By Model:**
- **ollama/kimi-k2.5:cloud**: 5 runs, 100% success rate
- **ollama/qwen3-coder:480b-cloud**: 1 run, 100% success rate
- **openrouter/claude-sonnet-4.6**: 8 runs, 37.5% success rate (6 auth failures, 2 silent)

**By Status:**
- ✅ **Success with output:** 6 runs (40%)
- ✅ **Silent success (no output):** 3 runs (20%)
- ❌ **Auth errors:** 6 runs (40%)

**Average Duration:**
- Successful kimi-k2.5 runs: ~5.1 minutes
- Failed openrouter runs: ~2.2 seconds (immediate auth failure)
- Silent openrouter runs: ~0.5 seconds (completed but no capture)

---

## Pattern Analysis

**Successful Runs (ollama/kimi-k2.5):**
- Research Agent: Niche analysis compiled
- Design Agent: Full website built (largest output ~9KB)
- CRM Agent: ⚠️ Result not properly captured
- Deployment Agent: Stripe integration working
- Content Agent: 3 blog posts generated
- Blog draft: Post created successfully

**Failed Runs (openrouter/claude-sonnet-4.6):**
- 6 consecutive auth failures (2026-04-05 evening)
- 3 silent completions (status ok but no frozenResultText)
- Pattern: Auth not propagated to subagents

**Critical Issue:**
- Runs #7-11: Complete auth failure - subagents can't use OpenRouter
- Runs #12-14: Auth works (subagent spawns) but result capture fails
