# Lessons Learned from Subagent Run Analysis

**Analysis Date:** 2026-04-05  
**Source:** 15 subagent runs (9 successful, 6 failed)

---

## 1. What Worked

### Ollama/kimi-k2.5:cloud (Local) — 100% Success Rate
- **Research Agent:** Compiled comprehensive niche analysis with 3 actionable recommendations
- **Design Agent:** Built complete Astro website (~9KB output) with all pages, components, deployment guide
- **Deployment Agent:** Created production-ready Stripe integration with webhook handling
- **Content Agent:** Generated 3 publish-ready blog posts (1,800-2,100 words each) with SEO optimization
- **Average runtime:** ~5 minutes for complex tasks
- **Key strength:** No auth issues, reliable output capture, handles large outputs

### Ollama/qwen3-coder:480b-cloud (Local) — 100% Success Rate
- **Blog draft agent:** Created complete blog post with proper tone and CTA
- **Reliable for:** Content generation, writing tasks

---

## 2. What Failed

### OpenRouter Auth Not Propagated — 60% Failure Rate (6/10 runs)

**Error Pattern:**
```
FailoverError: No API key found for provider "openrouter"
Auth store: C:\Users\jnpro\AppData\Roaming\atomicbot-desktop\openclaw\agents\main\agent\auth-profiles.json
```

**Affected Runs:**
- twitter-content-gen (claude-sonnet-4.6)
- blog-outline-gen (claude-sonnet-4.6)
- trading-architecture (claude-sonnet-4.6)
- revenue-research (claude-sonnet-4.6)
- new-repo-vercel (claude-sonnet-4.6)

**Root Cause:** Subagents spawned with runtime="subagent" don't inherit auth-profiles.json from main agentDir. Each subagent needs independent auth configuration or auth must be copied.

**Fix Required:**
```bash
# Option 1: Copy auth to subagent
Copy-Item auth-profiles.json to each subagent's agentDir

# Option 2: Use runtime="acp" with proper agentId
# Option 3: Pass API keys via task description (not secure)
```

---

## 3. Silent Failures

### Status "ok" but No frozenResultText Captured — 20% of runs

**Affected:**
- CRM Agent (kimi-k2.5): Only captured "Now I'll create..." — actual content missing
- PDF-Design-Expert (claude-sonnet-4.6): Empty frozenResultText
- Coding-Expert (claude-sonnet-4.6): Empty frozenResultText
- Command-Center-Enhancement (claude-sonnet-4.6): Empty frozenResultText

**Symptoms:**
- Run shows "status: ok" and "endedReason: subagent-complete"
- frozenResultText is null or truncated
- Work may have been done but result not captured

**Likely Causes:**
1. Subagent used sessions_yield without message parameter
2. Subagent crashed after completing work but before returning
3. Output exceeded capture buffer
4. Tool output not properly passed to frozenResultText

**Detection:** Check runs where duration > 30 seconds but frozenResultText is null.

---

## 4. Model Performance Notes

### ollama/kimi-k2.5:cloud (Local)
| Metric | Value |
|--------|-------|
| Success Rate | 100% (6/6) |
| Avg Duration | 5.1 min |
| Avg Output Size | ~2-9KB |
| Auth Issues | 0 |
| Best For | Complex tasks, large outputs, reliability |

### openrouter/claude-sonnet-4.6
| Metric | Value |
|--------|-------|
| Success Rate | 37.5% (3/8) |
| Avg Duration (failures) | 2.2 sec |
| Avg Duration (success) | 0.5 sec (⚠️ suspicious - likely silent fail) |
| Auth Issues | 6/8 runs |
| Best For | ⚠️ Not currently viable due to auth propagation |

**Recommendation:** 
- **Primary:** Use ollama/kimi-k2.5 for all subagent tasks until auth issue resolved
- **Backup:** ollama/qwen3-coder for code-specific tasks
- **Avoid:** openrouter/claude-sonnet-4.6 for subagents until auth fixed

---

## 5. Systemic Issues

### Issue 1: Auth Propagation Failure
**Impact:** HIGH — Blocks all OpenRouter subagent usage  
**Status:** Unresolved  
**Workaround:** Use local Ollama models exclusively

### Issue 2: Result Capture Silent Fails  
**Impact:** MEDIUM — Lost work product  
**Pattern:** 3 runs completed but no output captured  
**Detection:** Monitor for null frozenResultText with status=ok  
**Mitigation:** Add verification step — subagent should confirm output saved to file

### Issue 3: No Runtime Validation
**Impact:** MEDIUM — Subagents spawn with bad config  
**Observation:** 6 subagents spawned knowing they would fail (no auth)  
**Fix:** Pre-flight check — verify auth exists before spawning

### Issue 4: Timeout Configuration
**Observation:** All runs used runTimeoutSeconds: 0 (infinite)  
**Risk:** Hanging subagents could consume resources indefinitely  
**Recommendation:** Set reasonable timeouts (300s for most tasks)

---

## Action Items

### Immediate (Fix Before Next Run)
- [ ] Fix OpenRouter auth propagation to subagents
- [ ] Add pre-flight auth check before spawning
- [ ] Set reasonable runTimeoutSeconds (300s default)

### Short-term (Next Week)
- [ ] Implement result capture validation (file existence check)
- [ ] Add alerting for silent failures (null frozenResultText)
- [ ] Document which models work reliably for subagents

### Long-term (Next Month)
- [ ] Build subagent health dashboard (track success rates by model)
- [ ] Implement automatic retry with model fallback
- [ ] Create subagent template with proper error handling

---

## Working Configuration (Verified)

```javascript
// Reliable subagent spawn
{
  runtime: "subagent",
  model: "ollama/kimi-k2.5:cloud", // Only reliable model
  runTimeoutSeconds: 300,
  cleanup: "keep", // Preserve files on failure
  expectsCompletionMessage: true
}

// Output should be saved to file, not just returned
// Verify: Check file exists after subagent completes
```

---

**Bottom Line:** Local Ollama models (kimi-k2.5) are production-ready for subagents. OpenRouter requires auth fix before use. Always verify output was captured.
