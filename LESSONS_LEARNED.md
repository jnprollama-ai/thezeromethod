# Lessons Learned - Zero Operations
**Created:** 2026-04-02
**Purpose:** Prevent repeated mistakes

---

## 🔴 Critical Mistakes Made Today

### 1. PowerShell vs CMD Syntax Confusion
**Mistake:** Using `&&` in PowerShell commands
**Error:** "The token '&&' is not a valid statement separator"
**Fix:** 
- PowerShell: `;` or separate lines
- CMD: `&&` works
- Better: Use full paths, avoid chaining

**Example WRONG:**
```powershell
cd path && npm install  # FAILS in PowerShell
```

**Example CORRECT:**
```powershell
cd path; npm install     # PowerShell
cd path && npm install   # CMD only
```

---

### 2. Session Management Issues
**Mistake:** Not checking if processes already running before starting new ones
**Result:** Multiple node processes, port conflicts
**Fix:** Always check first

```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue
# Kill if needed: Stop-Process -Name "node" -Force
```

---

### 3. Browser Automation Limitations
**Mistake:** Trying to automate Twitter signup, Netlify login
**Reality:** These require human verification (CAPTCHA, 2FA, SMS)
**Lesson:** Know when to stop and ask user to complete manually

**What I CAN automate:**
- Static website deployment
- Git commits
- File operations
- API calls with tokens

**What I CANNOT automate:**
- Social media account creation
- OAuth flows with verification
- Phone/SMS verification
- Payment setup requiring 3D Secure

---

### 4. DNS Propagation Misunderstanding
**Mistake:** Expected immediate DNS changes
**Reality:** 15 minutes to 24 hours propagation
**Lesson:** Set expectations correctly, provide workaround URLs

**When DNS changes:**
- Immediately: In nameserver control panel
- 15-30 min: Most users see changes
- 24-48 hours: Full global propagation

**Always provide:**
- Temporary URL (Netlify subdomain)
- Clear instructions for user to verify

---

### 5. Git Branch Confusion
**Mistake:** Assumed master branch, but repo uses main
**Result:** Commits not triggering deploys
**Fix:** Check branch name first

```bash
git branch --show-current
# Then: git push origin $(git branch --show-current)
```

---

### 6. Not Reading Files Before Editing
**Mistake:** Assuming file structure without reading
**Result:** Created duplicate files, wrong paths
**Lesson:** Always `read` first, then edit

---

### 7. Environment Variable Assumptions
**Mistake:** Assuming env vars are set when they're not
**Result:** Stripe, APIs not working
**Lesson:** Check existence, provide .env.example

```javascript
if (!process.env.STRIPE_KEY) {
    console.log("⚠️  STRIPE_KEY not set - payments disabled");
}
```

---

### 8. Process Backgrounding Confusion
**Mistake:** Using `background: true` without proper polling
**Result:** Commands fail silently, user waits
**Fix:** Either:
- Use `background: true` + immediate poll
- Or use `timeout` with proper exit code check
- Or use `process` tool to manage long-running tasks

---

## ✅ Better Patterns Going Forward

### Pattern 1: Check Before Act
```javascript
// Check if running first
const existing = await exec("Get-Process node");
if (existing) {
    // Use existing or kill and restart
}
```

### Pattern 2: Environment Verification
```javascript
// Always verify env before operations
const env = await exec("cat .env");
if (!env.includes("API_KEY")) {
    return "⚠️ API_KEY missing - create .env first";
}
```

### Pattern 3: Clear Status Updates
```javascript
// Instead of silent failures, explicit status
return `
✅ Success: Server started
🌐 URL: http://localhost:3456
⏱️  Process: Running (PID: ${pid})
💡 To view: Open browser to URL above
`;
```

### Pattern 4: DNS Reality Check
```javascript
// Check DNS before claiming success
const dns = await exec("nslookup domain.com");
if (dns.includes("parking")) {
    return `
    ⚠️  DNS not propagated yet
    ⏳ Time: 15min-24hours
    🔧 Temp URL: https://netlify-url.netlify.app
    `;
}
```

---

## 🎯 Decision Matrix: When to Ask vs Execute

| Task | Can Execute | Needs User |
|------|-------------|------------|
| Deploy website | ✅ | ❌ |
| Git commit/push | ✅ | ❌ |
| Write code | ✅ | ❌ |
| Create files | ✅ | ❌ |
| API integration | ✅ (with keys) | ❌ |
| Stripe setup | ⚠️ (with keys) | ❌ |
| DNS changes | ❌ | ✅ (Namecheap login) |
| Social media accounts | ❌ | ✅ (phone/email verify) |
| OAuth/Login flows | ❌ | ✅ (2FA/CAPTCHA) |
| Payment verification | ❌ | ✅ (3D Secure) |

---

## 📋 Pre-Flight Checklist

Before claiming something is "done":

- [ ] Can I access it? (curl/browser)
- [ ] Is it actually running? (process check)
- [ ] Are env vars set? (no undefined errors)
- [ ] Is DNS propagated? (nslookup check)
- [ ] Did git push succeed? (remote verification)
- [ ] Can user access it? (not just localhost)

---

## 🔄 Recovery Patterns

When something fails:

1. **Don't panic** - Check logs first
2. **Identify the actual error** - Not just symptoms
3. **Check if process exists** - Before restarting
4. **Provide clear next steps** - Not just "failed"
5. **Document the fix** - So it doesn't repeat

---

## 💡 Mental Models

### "The User Can't See My Terminal"
- They don't see my process list
- They don't see my localhost
- They need explicit URLs
- They need clear status messages

### "GitHub ≠ Deployed"
- Committing ≠ Deployed
- Pushed ≠ Live
- DNS must propagate
- Clear cache may be needed

### "Serverless Isn't Magic"
- Netlify has build times
- Functions have cold starts
- Env vars must be set in dashboard
- Custom domains need verification

---

## 🎓 Skills to Improve

1. **PowerShell proficiency** - Learn proper syntax
2. **Process management** - Better PID tracking
3. **Error handling** - Graceful degradation
4. **Status communication** - Clear, actionable messages
5. **Patience with DNS** - Realistic timelines

---

**Committed to:** Fewer mistakes, faster recovery, clearer communication.
