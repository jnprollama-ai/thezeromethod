# Zero Method Token Budget & API Management Plan
**Month:** April 2026
**Total Budget:** $50 USD (hard limit)
**Last Updated:** 2026-04-04

---

## 📊 API INVENTORY & RATE LIMITS

### 1. Gemini API (Google)
**Key:** `AIzaSyDi3c7GnikYZAdg3DkSmag-AqcDT8pPJ_8`
**Rate Limits:**
- Free Tier: 60 queries per minute
- Pricing: $0.00025 per 1K characters (input) / $0.0005 per 1K characters (output)
**Monthly Cost Estimate:** $0-5 (with caching)
**Status:** ✅ PRIMARY for content/research

**Usage Strategy:**
- Cache all research results (7-day cache)
- Batch requests when possible
- Use for: Content creation, SEO research, analysis
- Estimated monthly usage: 100-200 calls

---

### 2. OpenRouter API
**Key:** `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`
**Rate Limits:** Pay-per-use (varies by model)
**Pricing:**
- GPT-4: $30/1M tokens
- Claude 3.5: $3/1M tokens
- Llama 3: $0.20/1M tokens
**Monthly Budget:** $15-20
**Status:** ⚠️ USE SPARINGLY

**Usage Strategy:**
- Use only for complex tasks requiring high reasoning
- Prefer Ollama/Gemini when possible
- Estimated monthly usage: 5-10 calls
- Always check cost before spawning subagents

---

### 3. Twitter API
**Key:** `AAAAAAAAAAAAAAAAAAAAAFsU8wEAAAAA9ByJ8lbmzjxVTyKwxABbQR8gq5w%3DRto1vFxYkZ39yYoP0MSMXifurKlwKEeaq3NXrIg44CSGWMp9q7`
**Rate Limits:**
- Free Tier: 1,500 tweets per month
- Read: 100 requests per 15 minutes
- Post: 200 tweets per 15 minutes
**Monthly Cost:** $0 (Free tier)
**Status:** ✅ ACTIVE

**Usage Strategy:**
- Max 50 tweets/day to stay safe
- Space out tweets: 9 AM, 2 PM, 7 PM
- Cache user lookups
- Estimated monthly usage: 1,200 tweets (under limit)

---

### 4. Stripe API
**Keys:** Test mode configured
**Rate Limits:** High (not a concern)
**Monthly Cost:** $0 (test mode)
**Status:** ✅ READY for production switch

---

### 5. Brave Search API
**Key:** `BSAZ1HtMA_dontfhgREOOendJFqJGJL`
**Rate Limits:** 2,000 queries/month (Free tier)
**Monthly Cost:** $0
**Status:** ✅ ACTIVE

**Usage Strategy:**
- Cache all search results (30-day cache)
- Use for: Competitor research, SEO analysis
- Estimated monthly usage: 100-200 queries

---

### 6. Ollama (Local)
**Key:** `eccf73b5fdea465480e5dfce6ac0781b.BAN9twU8emiPA45PnVqk33Ar`
**Rate Limits:** Unlimited (local inference)
**Monthly Cost:** $0
**Status:** ✅ PREFERRED for most tasks

**Usage Strategy:**
- USE FIRST for all content generation
- Fallback to Gemini/OpenRouter only if Ollama unavailable
- Estimated monthly usage: Unlimited

---

## 💰 MONTHLY BUDGET ALLOCATION

### Budget Breakdown ($50 Total)

| Category | Allocation | % of Budget |
|----------|-----------|-------------|
| **OpenRouter (External AI)** | $20 | 40% |
| **Hosting/Infrastructure** | $15 | 30% |
| **Tools/Software** | $10 | 20% |
| **Buffer/Emergency** | $5 | 10% |

---

### Cost Per Task Estimates

**Content Creation:**
- Blog post (Ollama): $0
- Blog post (Gemini): $0.10-0.50
- Blog post (Claude via OpenRouter): $0.50-2.00
- **Strategy:** Use Ollama first

**Research Tasks:**
- Competitor analysis (Brave): $0
- Web scraping (Gemini): $0.20-0.50
- Deep research (Claude): $1-3
- **Strategy:** Batch and cache results

**Social Media:**
- Twitter API: $0
- Content generation (Ollama): $0
- Content generation (Gemini): $0.05-0.20 per post
- **Strategy:** Use Ollama for all social content

**Development:**
- PDF Tools (client-side): $0
- Code review (Ollama): $0
- Complex debugging (Claude): $0.50-2
- **Strategy:** Try Ollama first, escalate only if stuck

---

## 📅 DAILY TOKEN ALLOCATION

### April 2026 Budget (30 days)
- **Daily OpenRouter Budget:** $0.67/day ($20 ÷ 30)
- **Daily Gemini Budget:** ~500 queries (well within 60/min limit)
- **Daily Twitter Budget:** 50 tweets/day (1,500 ÷ 30)

### Weekly Planning

**Week 1 (April 1-7): Setup Phase**
- OpenRouter: $5
- Gemini: 50 queries
- Twitter: 350 tweets
- Focus: Infrastructure, content calendar

**Week 2 (April 8-14): Launch Phase**
- OpenRouter: $5
- Gemini: 100 queries
- Twitter: 350 tweets
- Focus: Product launch, traffic generation

**Week 3 (April 15-21): Growth Phase**
- OpenRouter: $5
- Gemini: 150 queries
- Twitter: 350 tweets
- Focus: Audience building, engagement

**Week 4 (April 22-30): Optimization Phase**
- OpenRouter: $5
- Gemini: 100 queries
- Twitter: 450 tweets
- Focus: Analytics, optimization

---

## 🎯 COST-SAVING STRATEGIES

### 1. Caching Strategy (CRITICAL)
**All API responses cached for 7-30 days:**
- ✅ Research queries → 30-day cache
- ✅ Competitor data → 30-day cache
- ✅ Content ideas → 7-day cache
- ✅ SEO analysis → 14-day cache

**Implementation:**
- Store in `data/cache/` directory
- Key format: `{api_name}_{hash_of_query}.json`
- TTL: 7-30 days depending on data volatility

---

### 2. Priority-Based API Selection

**Tier 1 (Free/Unlimited):**
1. Ollama (local) - $0
2. Twitter API - $0
3. Brave Search - $0
4. Stripe (test) - $0

**Tier 2 (Low Cost):**
5. Gemini API - $0.01-0.50 per query

**Tier 3 (Premium):**
6. OpenRouter/Claude - $0.50-3.00 per query

**Rule:** Always try Tier 1 first, then Tier 2, then Tier 3 only if necessary

---

### 3. Batch Processing

**Group Similar Tasks:**
- Research: Do all research on Mondays (batch day)
- Content: Generate content in batches (Tuesday-Thursday)
- Analytics: Review metrics once per week (Fridays)

**Benefits:**
- Reduces API calls through caching
- Better rate limit management
- More predictable costs

---

### 4. Token Optimization

**When using OpenRouter/Claude:**
- Always set max_tokens limit
- Use clear, concise prompts
- Request shorter outputs when possible
- Avoid unnecessary follow-up queries

**Example Savings:**
- Unoptimized: "Write a blog post about AI" → $2.00
- Optimized: "Write a 500-word blog post about AI prompts for business professionals. Include 3 practical examples." → $0.80

---

## 📈 CURRENT MONTH USAGE (April 2026)

### Week 1 (April 1-4)
**OpenRouter:** $0 (Ollama used exclusively)
**Gemini:** ~20 queries (SEO research, content planning)
**Twitter:** 0 tweets (bot not yet active)
**Brave:** ~15 queries (competitor analysis)

**Total Spent:** $0.00 ✅
**Budget Remaining:** $50.00

---

## ⚠️ RED FLAGS / STOP CONDITIONS

**Immediate Stop Triggers:**
1. Daily OpenRouter spend exceeds $2
2. Unexpected API error rates > 10%
3. Rate limit warnings from any provider
4. Budget reaches $45 (leave $5 buffer)

**Throttle Triggers:**
1. Daily OpenRouter spend exceeds $1
2. Gemini queries exceed 100/day
3. Twitter hits 80% of rate limit

---

## 🔄 WEEKLY REVIEW CHECKLIST

Every Monday, review:
- [ ] Previous week's API usage
- [ ] Costs vs. budget
- [ ] Rate limit proximity
- [ ] Cache hit rates
- [ ] Cost per conversion/revenue

**If over budget:**
1. Switch to Ollama exclusively
2. Pause non-critical features
3. Extend cache TTLs
4. Reduce Twitter posting frequency

---

## 💡 COST-EFFECTIVE ALTERNATIVES

**If OpenRouter costs exceed budget:**
1. **Use Ollama exclusively** - 95% of tasks possible
2. **Gemini Flash model** - Cheaper than GPT-4
3. **Self-hosted models** - Requires GPU but $0 ongoing

**If Twitter rate limits hit:**
1. Reduce to 1-2 posts/day
2. Focus on engagement vs. posting
3. Use scheduling to space out evenly

**If hosting costs exceed $15:**
1. Stay on Netlify free tier
2. Optimize build size
3. Use client-side processing (like PDF tools)

---

## 📊 TRACKING TEMPLATE

### Daily Log
```
Date: YYYY-MM-DD
OpenRouter: $X.XX (Y calls)
Gemini: Z calls
Twitter: W tweets
Total Day: $X.XX
Cumulative: $XX.XX / $50
```

### Weekly Summary
```
Week: X
Budget Used: $XX / $12.50 (weekly avg)
Rate Limit Status: Green/Yellow/Red
Next Week Forecast: $XX
Adjustments Made: [list]
```

---

## ✅ APPROVAL REQUIRED

**Before spending >$5 in a single week on OpenRouter:**
- Must document expected ROI
- Must explore Ollama alternatives
- Must get explicit approval from Jon

**Before upgrading any API tier:**
- Must prove ROI with data
- Must show current tier is insufficient
- Must get explicit approval from Jon

---

**This document is updated weekly. Current status: ACTIVE**

**Last Check:** 2026-04-04
**Budget Health:** ✅ EXCELLENT ($0 spent of $50)
**Risk Level:** 🟢 LOW
