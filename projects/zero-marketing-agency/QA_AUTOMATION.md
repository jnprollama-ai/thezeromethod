# Quality Assurance Automation
**Project:** Zero Marketing Agency  
**Status:** ✅ ACTIVE  
**Last Updated:** 2026-04-02

---

## Automated QA Pipeline

### Pre-Deployment Checks (Every Build)

| Check | Tool | Status | Auto-Fix |
|-------|------|--------|----------|
| Broken Links | Lychee/Linkinator | ✅ | No |
| HTML Validation | HTML-validate | ✅ | No |
| Accessibility | axe-core | ✅ | No |
| Performance | Lighthouse CI | ✅ | No |
| SEO | Lighthouse SEO | ✅ | No |
| Image Optimization | ImageOptim | ✅ | Yes |
| CSS Lint | Stylelint | ✅ | Yes |
| JS Lint | ESLint | ✅ | Yes |

---

## GitHub Actions Workflow

### `.github/workflows/qa.yml`

```yaml
name: Quality Assurance

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint CSS
        run: npm run lint:css
        
      - name: Lint JavaScript
        run: npm run lint:js
        
      - name: Build site
        run: npm run build
        
      - name: Check broken links
        run: npm run test:links
        
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          
      - name: Accessibility check
        run: npm run test:a11y
        
      - name: Upload results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: qa-results
          path: |
            ./lighthouseci/
            ./reports/
```

---

## Local QA Commands

### Available Scripts (add to package.json)

```json
{
  "scripts": {
    "lint": "npm run lint:css && npm run lint:js",
    "lint:css": "stylelint 'src/**/*.{css,scss,astro}'",
    "lint:js": "eslint 'src/**/*.{js,ts,astro}'",
    "lint:fix": "npm run lint:css -- --fix && npm run lint:js -- --fix",
    "test": "npm run test:links && npm run test:a11y && npm run test:performance",
    "test:links": "linkchecker dist/ --check-extern",
    "test:a11y": "axe-core dist/ --tags wcag2a,wcag2aa",
    "test:performance": "lighthouse dist/index.html --preset=desktop --output=json --output-path=./reports/lighthouse.json",
    "qa:full": "npm run lint && npm run build && npm run test"
  }
}
```

---

## Lighthouse CI Configuration

### `lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4321/'],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'ready in',
      startServerReadyTimeout: 10000,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

---

## Accessibility Testing

### axe-core Configuration

```javascript
// axe.config.js
module.exports = {
  rules: [
    {
      id: 'color-contrast',
      enabled: true,
    },
    {
      id: 'heading-order',
      enabled: true,
    },
    {
      id: 'image-alt',
      enabled: true,
    },
    {
      id: 'link-name',
      enabled: true,
    },
  ],
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
};
```

---

## Link Checking

### Linkinator Configuration

```javascript
// linkinator.config.js
module.exports = {
  recurse: true,
  skip: [
    'linkedin.com',
    'twitter.com',
    'x.com',
    'facebook.com',
    '^mailto:',
    '^tel:',
  ],
  timeout: 10000,
  retry: true,
  retryErrors: true,
  retryErrorsCount: 3,
  concurrency: 10,
};
```

---

## Performance Budgets

### Maximum Thresholds

| Metric | Target | Warning | Error |
|--------|--------|---------|-------|
| First Contentful Paint | < 1.8s | 2.0s | 2.5s |
| Largest Contentful Paint | < 2.5s | 3.0s | 4.0s |
| Time to Interactive | < 3.5s | 4.0s | 4.5s |
| Cumulative Layout Shift | < 0.1 | 0.15 | 0.25 |
| Total Page Size | < 500KB | 750KB | 1MB |
| Image Size | < 200KB | 300KB | 500KB |
| JavaScript Size | < 150KB | 200KB | 300KB |
| CSS Size | < 50KB | 75KB | 100KB |

---

## Cron Schedule

### Automated QA Schedule

| Time (UTC) | Check | Action |
|------------|-------|--------|
| 00:00 | Full QA suite | GitHub Actions |
| 06:00 | Lighthouse performance | GitHub Actions |
| 12:00 | Link checker | GitHub Actions |
| 18:00 | Accessibility scan | GitHub Actions |
| Every push | Pre-commit hooks | Local |

---

## Quality Gates

### Deployment Requirements

✅ **All must pass before deployment:**

1. Build succeeds without errors
2. Lighthouse Performance ≥ 80
3. Lighthouse Accessibility ≥ 90
4. Lighthouse SEO ≥ 90
5. No broken internal links
6. No accessibility violations (critical)
7. No console errors
8. Mobile responsive (tested)

---

## Reporting

### QA Dashboard

**Location:** `https://neon-palmier-14458f.netlify.app/qa-report`

**Includes:**
- Latest Lighthouse scores
- Accessibility audit results
- Broken link report
- Performance trends
- Error logs

---

## Manual QA Checklist

### Before Major Releases

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Payment flow testing (Stripe)
- [ ] Form validation testing
- [ ] Email delivery testing
- [ ] Social sharing meta tags
- [ ] Analytics tracking
- [ ] SEO meta tags
- [ ] SSL certificate validity
- [ ] CDN cache clearing

---

## Integration with Netlify

### Netlify Build Plugins

```toml
# netlify.toml
[[plugins]]
package = "netlify-plugin-lighthouse"

[plugins.inputs.thresholds]
performance = 0.8
accessibility = 0.9
best-practices = 0.9
seo = 0.9

[[plugins]]
package = "netlify-plugin-checklinks"

[plugins.inputs]
todoPatterns = ["linkedin.com", "twitter.com"]
skipPatterns = ["mailto:", "tel:"]
```

---

## Alerting

### Notification Channels

- **GitHub Issues:** Auto-create for failures
- **Slack:** #zero-alerts (if configured)
- **Email:** jon@thezeromethod.com for critical failures

### Failure Response

| Severity | Response Time | Action |
|----------|---------------|--------|
| Critical | Immediate | Block deployment, alert |
| High | 1 hour | Create issue, alert |
| Medium | 24 hours | Log, schedule fix |
| Low | Next sprint | Backlog |

---

**QA Status:** ✅ Automated pipeline configured  
**Next Review:** Weekly every Monday 8 AM Dubai
