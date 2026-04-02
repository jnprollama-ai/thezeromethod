# Zero Method CRM - Airtable Setup Guide

**Brand:** Zero Method  
**Domain:** thezeromethod.com  
**Platform:** Airtable (Free Tier)  
**Last Updated:** March 31, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Base Setup Instructions](#base-setup-instructions)
3. [1. Contacts Base](#1-contacts-base)
4. [2. Interactions Base](#2-interactions-base)
5. [3. Deals Base](#3-deals-base)
6. [4. Content Base](#4-content-base)
7. [5. Analytics Base](#5-analytics-base)
8. [Airtable Automations](#airtable-automations)
9. [Lead Nurturing Email Sequences](#lead-nurturing-email-sequences)
10. [Integration Notes](#integration-notes)

---

## Overview

This CRM system is designed to manage the complete customer journey for Zero Method marketing agency. It consists of 5 interconnected bases that track contacts, interactions, deals, content, and analytics.

### Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    ZERO METHOD CRM                           │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   CONTACTS   │ INTERACTIONS │    DEALS     │    CONTENT     │
│    (Hub)     │  (Activity)  │  (Revenue)   │  (Marketing)   │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                      ANALYTICS (Metrics)                       │
└─────────────────────────────────────────────────────────────┘
```

### Linked Record Relationships

- **Contacts** ↔ **Interactions** (1-to-Many)
- **Contacts** ↔ **Deals** (1-to-Many)
- **Deals** → **Content** (via Product Tier)

---

## Base Setup Instructions

### Step 1: Create Your Airtable Workspace

1. Go to [airtable.com](https://airtable.com)
2. Sign up for a free account
3. Create a new workspace named **"Zero Method CRM"**
4. Set workspace icon to the 🌀 spiral emoji

### Step 2: Create Each Base

For each base in this guide:
1. Click "Add a base" → "Create from scratch"
2. Name the base appropriately
3. Rename the default table to match specifications
4. Configure fields, views, and options

### Step 3: Configure Automations

Automations are configured at the base level:
1. Open a base
2. Click "Automations" in top right
3. Click "Create automation"
4. Set triggers and actions as specified

### Step 4: Set Up Integrations

- **Zapier/Make:** For webhook triggers from website
- **Email provider:** Connect your email service (Mailgun/SendGrid)
- **Calendar:** Sync for scheduling

---

## 1. Contacts Base

**Base Name:** Contacts  
**Purpose:** Central hub for all leads, prospects, and customers

### Table Structure

| Field Name | Field Type | Configuration | Description |
|------------|------------|---------------|-------------|
| **Name** | Single line text | Required | Full name of contact |
| **Email** | Email | Required, Unique | Primary email address |
| **Source** | Single select | Options below | Where contact originated |
| **Date Added** | Created time | Auto-generated | When record was created |
| **Lead Score** | Number | Integer, 0-100 | Engagement scoring (0=cold, 100=hot) |
| **Stage** | Single select | Options below | Current funnel position |
| **Tags** | Multiple select | Custom tags | Segmentation tags |
| **Last Touch** | Last modified time | Auto-updated | Last activity timestamp |
| **Next Action** | Single line text | Optional | Planned follow-up |
| **Interactions** | Linked records | Link to Interactions base | Related touchpoints |
| **Deals** | Linked records | Link to Deals base | Related opportunities |
| **Company** | Single line text | Optional | Company/organization |
| **Phone** | Phone number | Optional | Contact phone |
| **Notes** | Long text | Rich text | General notes |

### Field Options

#### Source (Single Select)

| Option | Color | Description |
|--------|-------|-------------|
| Website | Blue | Organic website visit |
| Social Media | Purple | Instagram, Twitter, LinkedIn |
| Referral | Green | Word of mouth |
| Paid Ads | Red | Facebook/Google ads |
| Content Download | Yellow | Lead magnet download |
| Webinar | Orange | Event registration |
| Cold Outreach | Gray | Direct outreach |

#### Stage (Single Select) - Customer Journey

| Option | Color | Description |
|--------|-------|-------------|
| Awareness | Light blue | Knows about Zero Method |
| Interest | Yellow | Engaged with content |
| Consideration | Orange | Evaluating services |
| Purchase | Green | Became customer |
| Advocacy | Dark green | Referring others |
| Inactive | Gray | Dormant contact |

#### Tags (Multiple Select - Examples)

| Option | Color | Use Case |
|--------|-------|----------|
| Hot Lead | Red | High priority |
| Newsletter | Blue | Subscribed to updates |
| Enterprise | Purple | Large company |
| SMB | Green | Small business |
| Content Creator | Yellow | Influencer/partner |
| Competitor | Gray | Industry research |
| Do Not Contact | Red | Unsubscribed/opted out |

### Views Configuration

#### View 1: All Contacts (Default)
- **Type:** Grid
- **Fields:** All except "Interactions" and "Deals" (hide to reduce clutter)
- **Sort:** Date Added (Descending)
- **Filter:** None
- **Group by:** Stage

#### View 2: Hot Leads
- **Type:** Grid
- **Filter:** `Lead Score >= 70`
- **Sort:** Lead Score (Descending)
- **Fields:** Name, Email, Lead Score, Stage, Source, Last Touch, Next Action
- **Color:** Conditional on Lead Score (90+=red, 80-89=orange, 70-79=yellow)

#### View 3: Customers
- **Type:** Grid
- **Filter:** `Stage = "Purchase" OR Stage = "Advocacy"`
- **Sort:** Date Added (Descending)
- **Fields:** Name, Email, Company, Tags, Interactions, Deals, Last Touch
- **Group by:** Stage

#### View 4: By Source
- **Type:** Grid
- **Group by:** Source
- **Sort:** Date Added (Descending)
- **Fields:** Name, Email, Source, Lead Score, Stage, Date Added

#### View 5: Needs Attention
- **Type:** Grid
- **Filter:** `Last Touch < 7 days ago AND Stage != "Purchase" AND Stage != "Advocacy"`
- **Sort:** Last Touch (Ascending)
- **Fields:** Name, Email, Stage, Last Touch, Next Action, Lead Score

---

## 2. Interactions Base

**Base Name:** Interactions  
**Purpose:** Log every touchpoint with contacts

### Table Structure

| Field Name | Field Type | Configuration | Description |
|------------|------------|---------------|-------------|
| **Contact** | Linked record | Link to Contacts (required) | Related contact |
| **Type** | Single select | Options below | Interaction category |
| **Date** | Date | Include time | When interaction occurred |
| **Notes** | Long text | Rich text | Detailed notes |
| **Outcome** | Single select | Options below | Result of interaction |
| **Duration** | Number | Minutes | Call/meeting duration |
| **Created By** | Created by | Auto | Team member who logged |
| **Contact Name** | Lookup | From Contact → Name | Auto-populated |
| **Contact Email** | Lookup | From Contact → Email | Auto-populated |
| **Contact Stage** | Lookup | From Contact → Stage | Auto-populated |

### Field Options

#### Type (Single Select)

| Option | Color | Description |
|--------|-------|-------------|
| Email | Blue | Email sent/received |
| Social | Purple | Social media engagement |
| Phone Call | Green | Voice call |
| Meeting | Orange | In-person/virtual meeting |
| Note | Yellow | General observation |
| Demo | Red | Product/service demonstration |
| Support | Gray | Support ticket/issue |

#### Outcome (Single Select)

| Option | Color | Description |
|--------|-------|-------------|
| Positive | Green | Favorable outcome |
| Neutral | Yellow | Information exchange |
| Negative | Red | Unfavorable outcome |
| Follow-up Required | Orange | Action needed |
| No Response | Gray | Awaiting reply |
| Converted | Dark green | Became customer |

### Views Configuration

#### View 1: All Interactions (Default)
- **Type:** Grid
- **Sort:** Date (Descending)
- **Group by:** Type

#### View 2: This Week
- **Type:** Grid
- **Filter:** `Date is within the past week`
- **Sort:** Date (Descending)
- **Group by:** Contact

#### View 3: By Contact
- **Type:** Grid
- **Group by:** Contact
- **Sort:** Date (Descending)

#### View 4: Hot Prospects Activity
- **Type:** Grid
- **Filter:** `Contact → Lead Score >= 70`
- **Sort:** Date (Descending)
- **Fields:** Contact, Type, Date, Notes, Outcome

#### View 5: Follow-ups Required
- **Type:** Grid
- **Filter:** `Outcome = "Follow-up Required"`
- **Sort:** Date (Ascending)
- **Group by:** Contact

---

## 3. Deals Base

**Base Name:** Deals  
**Purpose:** Track revenue opportunities through pipeline

### Table Structure

| Field Name | Field Type | Configuration | Description |
|------------|------------|---------------|-------------|
| **Deal Name** | Single line text | Required | Descriptive name |
| **Contact** | Linked record | Link to Contacts (required) | Decision maker |
| **Product Tier** | Single select | Options below | Service level |
| **Value** | Currency | USD | Deal amount |
| **Stage** | Single select | Pipeline stages | Current pipeline position |
| **Probability** | Percent | 0-100% | Likelihood of close |
| **Expected Close** | Date | | Projected close date |
| **Actual Close** | Date | | Actual close date |
| **Source** | Single select | Same as Contacts | Deal origin |
| **Description** | Long text | | Deal details |
| **Next Step** | Single line text | | Required action |
| **Days in Stage** | Formula | `DATETIME_DIFF(TODAY(), Last Modified, 'days')` | Auto-calculated |
| **Weighted Value** | Formula | `Value * Probability` | Probability-adjusted |
| **Contact Name** | Lookup | From Contact → Name | Auto-populated |
| **Contact Email** | Lookup | From Contact → Email | Auto-populated |
| **Interactions** | Linked records | Link to Interactions | Related activities |

### Field Options

#### Product Tier (Single Select)

| Option | Color | Typical Value | Description |
|--------|-------|---------------|-------------|
| Starter | Light blue | $500-2,000 | Basic consulting |
| Growth | Blue | $2,000-5,000 | Standard package |
| Scale | Purple | $5,000-15,000 | Advanced services |
| Enterprise | Dark purple | $15,000+ | Full-service |
| Custom | Gray | Variable | Tailored solution |

#### Stage (Single Select) - Pipeline

| Option | Color | Probability | Description |
|--------|-------|-------------|-------------|
| Prospecting | Gray | 10% | Identified opportunity |
| Qualified | Light blue | 25% | Needs confirmed |
| Proposal Sent | Yellow | 50% | Quote delivered |
| Negotiation | Orange | 75% | Terms discussion |
| Verbal Commit | Light green | 90% | Intent confirmed |
| Closed Won | Green | 100% | Deal signed |
| Closed Lost | Red | 0% | Deal lost |
| On Hold | Dark gray | 0% | Paused/inactive |

### Views Configuration

#### View 1: Pipeline (Kanban)
- **Type:** Kanban
- **Group by:** Stage
- **Card fields:** Deal Name, Value, Contact Name, Expected Close
- **Stack order:** Expected Close (Ascending)
- **Colors:** Based on Probability

#### View 2: Forecast
- **Type:** Grid
- **Filter:** `Stage != "Closed Won" AND Stage != "Closed Lost" AND Stage != "On Hold"`
- **Sort:** Expected Close (Ascending)
- **Fields:** Deal Name, Contact, Value, Probability, Weighted Value, Expected Close, Stage
- **Group by:** Expected Close (by month)

#### View 3: Closed Won
- **Type:** Grid
- **Filter:** `Stage = "Closed Won"`
- **Sort:** Actual Close (Descending)
- **Fields:** Deal Name, Contact, Product Tier, Value, Actual Close
- **Color:** Green

#### View 4: Hot Deals
- **Type:** Grid
- **Filter:** `Probability >= 50% AND Stage != "Closed Won" AND Stage != "Closed Lost"`
- **Sort:** Weighted Value (Descending)
- **Fields:** Deal Name, Contact, Value, Probability, Expected Close, Next Step

#### View 5: At Risk
- **Type:** Grid
- **Filter:** `Expected Close < TODAY() AND Stage != "Closed Won" AND Stage != "Closed Lost"`
- **Sort:** Expected Close (Ascending)
- **Fields:** Deal Name, Contact, Expected Close, Days in Stage, Next Step
- **Color:** Red

---

## 4. Content Base

**Base Name:** Content  
**Purpose:** Manage all marketing content production

### Table Structure

| Field Name | Field Type | Configuration | Description |
|------------|------------|---------------|-------------|
| **Title** | Single line text | Required | Content title |
| **Type** | Single select | Options below | Content format |
| **Status** | Single select | Options below | Production stage |
| **Publish Date** | Date | | Scheduled/actual publish |
| **URL** | URL | | Published link |
| **Author** | Single select | Team members | Creator |
| **Target Audience** | Multiple select | Segments | Who it's for |
| **SEO Keywords** | Long text | | Target keywords |
| **Description** | Long text | | Content summary |
| **Related Deal Tier** | Single select | Link to product tiers | Upsell connection |
| **Performance** | Number | Views/clicks | Metric |
| **Notes** | Long text | | Internal notes |
| **Created Date** | Created time | Auto | When added |
| **Last Modified** | Last modified time | Auto | When updated |

### Field Options

#### Type (Single Select)

| Option | Color | Description |
|--------|-------|-------------|
| Blog Post | Blue | Website article |
| Email | Purple | Newsletter/campaign |
| Social Post | Green | Social media content |
| Lead Magnet | Yellow | Downloadable resource |
| Video | Red | YouTube/other video |
| Podcast | Orange | Audio episode |
| Webinar | Pink | Live/recorded event |
| Case Study | Teal | Client success story |

#### Status (Single Select)

| Option | Color | Description |
|--------|-------|-------------|
| Idea | Gray | Brainstorming phase |
| Outlined | Light blue | Structure defined |
| In Progress | Yellow | Being created |
| Review | Orange | Internal review |
| Scheduled | Light purple | Ready to publish |
| Published | Green | Live |
| Archived | Dark gray | Outdated |

#### Target Audience (Multiple Select)

| Option | Description |
|--------|-------------|
| Cold Leads | Awareness stage |
| Warm Leads | Interest/consideration |
| Customers | Existing clients |
| Enterprise | Large businesses |
| SMB | Small-medium business |
| Content Creators | Influencers/partners |

### Views Configuration

#### View 1: Content Calendar
- **Type:** Calendar
- **Date field:** Publish Date
- **Label:** Title
- **Color:** By Status

#### View 2: Editorial Pipeline
- **Type:** Kanban
- **Group by:** Status
- **Card fields:** Title, Type, Author, Publish Date
- **Stack order:** Publish Date (Ascending)

#### View 3: Published
- **Type:** Grid
- **Filter:** `Status = "Published"`
- **Sort:** Publish Date (Descending)
- **Fields:** Title, Type, Publish Date, URL, Performance

#### View 4: In Production
- **Type:** Grid
- **Filter:** `Status = "In Progress" OR Status = "Review" OR Status = "Outlined"`
- **Sort:** Publish Date (Ascending)
- **Group by:** Status

#### View 5: Upcoming
- **Type:** Grid
- **Filter:** `Status = "Scheduled" OR (Publish Date is within the next month AND Status != "Published")`
- **Sort:** Publish Date (Ascending)
- **Fields:** Title, Type, Publish Date, Author, Status

---

## 5. Analytics Base

**Base Name:** Analytics  
**Purpose:** Track key business metrics over time

### Table Structure

| Field Name | Field Type | Configuration | Description |
|------------|------------|---------------|-------------|
| **Date** | Date | Required | Metric date |
| **Metric** | Single select | Options below | What we're tracking |
| **Value** | Number | Decimal allowed | Numeric value |
| **Source** | Single select | Where from | Data origin |
| **Notes** | Long text | | Context/explanation |
| **Week** | Formula | `DATETIME_FORMAT(Date, 'YYYY-MM-DD')` | Week identifier |
| **Month** | Formula | `DATETIME_FORMAT(Date, 'YYYY-MM')` | Month identifier |
| **Target** | Number | | Goal value |
| **Variance** | Formula | `Value - Target` | vs target |
| **% of Target** | Formula | `(Value / Target) * 100` | Performance % |

### Field Options

#### Metric (Single Select)

| Option | Category | Unit | Description |
|--------|----------|------|-------------|
| Website Traffic | Traffic | Visits | Total site visits |
| Unique Visitors | Traffic | Visitors | Unique users |
| Page Views | Traffic | Views | Total page loads |
| Bounce Rate | Traffic | Percentage | Single-page visits |
| Newsletter Subscribers | Growth | Count | Total subscribers |
| New Subscribers | Growth | Count | Daily sign-ups |
| Unsubscribes | Growth | Count | Daily losses |
| Net Subscriber Growth | Growth | Count | New - Unsubscribes |
| Revenue | Financial | USD | Daily revenue |
| New Deals | Pipeline | Count | Deals created |
| Deals Closed Won | Pipeline | Count | Won deals |
| Deals Closed Lost | Pipeline | Count | Lost deals |
| Win Rate | Pipeline | Percentage | Won / Total |
| Average Deal Size | Pipeline | USD | Deal average |
| Pipeline Value | Pipeline | USD | Total open deals |
| Social Followers | Social | Count | Total followers |
| Social Engagement | Social | Count | Likes/comments/shares |
| Content Published | Content | Count | Pieces published |
| Lead Magnet Downloads | Conversion | Count | Downloads |
| Trial Signups | Conversion | Count | Free trials |
| Trial Conversions | Conversion | Count | Trial → Paid |
| Trial Conversion Rate | Conversion | Percentage | Conversion % |

#### Source (Single Select)

| Option | Description |
|--------|-------------|
| Google Analytics | Website data |
| Airtable | CRM data |
| Stripe | Payment data |
| Mailchimp | Email data |
| Manual Entry | Hand-entered |
| Zapier | Automated import |
| Social Platform | Native analytics |
| Calculated | Formula result |

### Views Configuration

#### View 1: Daily Metrics
- **Type:** Grid
- **Sort:** Date (Descending)
- **Group by:** Metric
- **Fields:** Date, Metric, Value, Target, % of Target, Notes

#### View 2: Traffic Dashboard
- **Type:** Grid
- **Filter:** `Metric contains "Traffic" OR Metric contains "Visitors" OR Metric contains "Views"`
- **Sort:** Date (Descending)
- **Group by:** Metric

#### View 3: Revenue Tracking
- **Type:** Grid
- **Filter:** `Metric contains "Revenue" OR Metric contains "Deal"`
- **Sort:** Date (Descending)
- **Fields:** Date, Metric, Value, Target, Variance

#### View 4: Weekly Summary
- **Type:** Grid
- **Group by:** Week
- **Sort:** Date (Descending)
- **Filter:** `Metric = "Revenue" OR Metric = "New Subscribers" OR Metric = "Website Traffic"`

#### View 5: Monthly Trends
- **Type:** Grid
- **Group by:** Month
- **Sort:** Date (Descending)
- **Fields:** Month, Metric, Value (sum)

---

## Airtable Automations

Automations are set up per base. Below are the recommended automations for the Zero Method CRM.

### Automation 1: New Subscriber → Welcome Sequence

**Base:** Contacts  
**Purpose:** Trigger welcome email for new subscribers

| Setting | Value |
|---------|-------|
| **Trigger** | When record matches conditions |
| **Condition** | Source = "Content Download" OR Source = "Website" |
| **Action 1** | Send email (via integration) |
| **Action 2** | Create record in Interactions |
| **Action 3** | Update field: Stage = "Awareness" |

**Email Subject:** Welcome to Zero Method - Your Guide Inside

### Automation 2: Lead Score Update → Hot Lead Alert

**Base:** Contacts  
**Purpose:** Notify team when lead becomes hot

| Setting | Value |
|---------|-------|
| **Trigger** | When record matches conditions |
| **Condition** | Lead Score >= 70 |
| **Action 1** | Send Slack/Discord notification |
| **Action 2** | Create "High Priority" tag |

### Automation 3: Deal Stage Change → Action Items

**Base:** Deals  
**Purpose:** Create follow-up tasks on stage changes

| Setting | Value |
|---------|-------|
| **Trigger** | When record updated |
| **Watch field** | Stage |
| **Condition** | Stage = "Proposal Sent" |
| **Action 1** | Create record in Interactions |
| **Action 2** | Set Next Step = "Follow up on proposal" |
| **Action 3** | Send notification to sales team |

### Automation 4: No Open Email → Re-engagement

**Base:** Interactions  
**Purpose:** Trigger re-engagement sequence

| Setting | Value |
|---------|-------|
| **Trigger** | Schedule (daily at 9 AM) |
| **Condition** | Find contacts where: Last Touch > 3 days ago, Stage != "Purchase", Stage != "Advocacy" |
| **Action 1** | Send re-engagement email |
| **Action 2** | Create interaction record |

### Automation 5: Content Published → Promotion

**Base:** Content  
**Purpose:** Auto-promote published content

| Setting | Value |
|---------|-------|
| **Trigger** | When record matches conditions |
| **Condition** | Status = "Published" |
| **Action 1** | Post to social media (via Zapier) |
| **Action 2** | Create Analytics record |
| **Action 3** | Send notification to team |

### Automation 6: Purchase → Onboarding + Upsell

**Base:** Contacts  
**Purpose:** Welcome new customers

| Setting | Value |
|---------|-------|
| **Trigger** | When record updated |
| **Watch field** | Stage |
| **Condition** | Stage = "Purchase" |
| **Action 1** | Send onboarding email |
| **Action 2** | Create onboarding checklist in Interactions |
| **Action 3** | Schedule upsell email (Day 30) |

### Automation 7: Pricing Page Visit → Nurture Trigger

**Base:** Interactions  
**Purpose:** Fast-track engaged visitors

| Setting | Value |
|---------|-------|
| **Trigger** | When record created |
| **Condition** | Type = "Note" AND Notes contains "pricing page" |
| **Action 1** | Update Contact: Stage = "Consideration" |
| **Action 2** | Update Contact: Lead Score + 20 |
| **Action 3** | Add "Hot Lead" tag |

---

## Lead Nurturing Email Sequences

### Overview

This 14-day email sequence nurtures new subscribers from awareness to consideration. Emails are triggered by Airtable automations based on contact stage and days since signup.

### Sequence Flow

```
Day 0 ──→ Day 2 ──→ Day 4 ──→ Day 6 ──→ Day 8 ──→ Day 10 ──→ Day 14
  │         │         │         │         │          │          │
  ▼         ▼         ▼         ▼         ▼          ▼          ▼
Welcome   Case      Behind    Social    FAQ       Limited    Final
+ Guide   Study     Scenes    Proof               Offer      CTA
```

---

### Email 1: Day 0 - Welcome + Free Guide

**Trigger:** Immediately after signup  
**Subject:** Welcome to Zero Method — Your [Guide Name] is Inside 🌀

**Email Body:**

```
Hi {{FirstName}},

Welcome to Zero Method! I'm excited you're here.

You joined {{Source}} — and that tells me you're serious about [outcome].

As promised, here's your free guide:

**[The Zero Method Blueprint: How to Achieve X in 30 Days]**

[DOWNLOAD NOW →]

Inside, you'll discover:
• The #1 mistake most people make when trying to [achieve goal]
• The 3-step framework we use with every client
• A simple action plan you can implement today

**What happens next?**

Over the next two weeks, I'll share case studies, behind-the-scenes 
strategies, and exclusive insights — all designed to help you 
[desired outcome].

No fluff. Just actionable tactics that work.

Talk soon,

[Your Name]
Zero Method

P.S. Hit reply and let me know your biggest challenge with [topic]. 
I read every email.

---
thezeromethod.com | [Social Links] | Unsubscribe
```

---

### Email 2: Day 2 - Case Study

**Trigger:** 48 hours after Day 0  
**Subject:** How [Client] went from [Before] to [After] in [Timeframe]

**Email Body:**

```
Hi {{FirstName}},

Did you get a chance to check out the guide I sent?

Either way, I wanted to share a quick story with you.

Meet [Client Name].

[Before state: struggling with X, frustrated by Y, tried everything]

Sound familiar?

Here's what happened when they applied the Zero Method:

[After state: specific results, numbers, transformation]

"[Quote from client about their experience]"

The crazy part? They achieved this in just [timeframe] — without 
[common objection like spending a fortune/working 80-hour weeks/etc].

**The lesson:** [Key takeaway that applies to reader]

Want results like [Client]? 

Here's the blueprint: [Link to case study or services]

More soon,

[Your Name]

P.S. Tomorrow I'm sharing something I've never publicly revealed before — 
our internal process. Keep an eye out.
```

---

### Email 3: Day 4 - Behind the Scenes

**Trigger:** 96 hours after signup  
**Subject:** The "boring" process behind our results (never shared this)

**Email Body:**

```
Hi {{FirstName}},

People always ask: "How do you actually get these results?"

So today, I'm pulling back the curtain.

Most people think [common misconception].

The truth? It's not about [flashy tactic]. It's about [simple principle].

Here's our actual process:

**STEP 1: Foundation**
We start by [brief description]. This takes [time] but saves [time/money] later.

**STEP 2: Analysis**
Most skip this. We don't. Here's why: [explanation]

**STEP 3: Execution**
This is where the magic happens. We [action] until [outcome].

**STEP 4: Optimization**
The work isn't done at launch. We [optimization strategy].

**The result?**

[Before/after metrics]

No hacks. No shortcuts. Just a proven system executed consistently.

**Want to see if this works for you?**

[Book a free strategy call →] or [Check out our services →]

Talk soon,

[Your Name]

P.S. Reply and tell me: what's your biggest bottleneck right now? 
I might feature it in an upcoming email (anonymously, of course).
```

---

### Email 4: Day 6 - Social Proof

**Trigger:** 144 hours after signup  
**Subject:** What [X] people are saying about Zero Method

**Email Body:**

```
Hi {{FirstName}},

I could tell you all day about what Zero Method does.

But I'd rather let our clients do the talking.

**[Testimonial 1 - Name, Company]**
"[Specific quote about results/impact]"

**[Testimonial 2 - Name, Company]**
"[Quote about experience/process]"

**[Testimonial 3 - Name, Company]**
"[Quote about ROI/transformation]"

But it's not just words.

Here are the numbers:

✓ [Number] clients served
✓ [Number] in [specific result]
✓ [Number]% client retention rate
✓ [Number] average [metric]

**Here's the thing...**

These results aren't accidents.

They come from a systematic approach that works across industries,
company sizes, and budgets.

[See if you're a fit →]

Questions? Just reply.

[Your Name]

P.S. In two days, I'm answering the questions I get asked most. 
Don't miss it.
```

---

### Email 5: Day 8 - FAQ

**Trigger:** 192 hours after signup  
**Subject:** Your questions answered (plus one nobody asks)

**Email Body:**

```
Hi {{FirstName}},

I've been doing this for [timeframe], and certain questions come up again 
and again.

So today: rapid-fire FAQ.

---

**"How long until I see results?"**

Most clients see initial movement in [timeframe]. Significant results 
typically appear within [timeframe]. It depends on [factors].

---

**"Do you work with [industry/niche]?"**

We've served [list]. The principles work across industries. 
But if you're unsure, [book a call].

---

**"What's the investment?"**

Our services range from $[X] to $[Y] depending on scope. 
We also offer [payment options].

---

**"What if it doesn't work for me?"**

[Guarantee/assurance policy]. We're not happy unless you're happy.

---

**"Can I just do this myself?"**

Sure. Many try. [Reality check + offer to help anyway].

---

**Here's the question nobody asks...**

**"What happens if I do nothing?"**

Same thing that happened last year.
Same thing that'll happen next year.

Status quo is expensive.

[Let's change that →]

Still have questions? Hit reply.

[Your Name]
```

---

### Email 6: Day 10 - Limited Offer

**Trigger:** 240 hours after signup  
**Subject:** [Time-sensitive offer] — Expires Friday

**Email Body:**

```
Hi {{FirstName}},

Quick note:

Over the past 10 days, you've seen:
• The framework that gets results
• Real client success stories
• Our exact process
• Social proof from happy clients
• Answers to common questions

Now it's decision time.

**Introducing: The [Offer Name]**

For the next 5 days, we're offering:

[Specific offer details: discount, bonus, exclusive access, etc]

**Why now?**

[Reason: limited spots, seasonal, launch pricing, etc]

**What you get:**

✓ [Benefit 1]
✓ [Benefit 2]
✓ [Benefit 3]
✓ [Bonus]

**Value:** $[X]
**Your investment:** $[Y]

**[Claim your spot →]**

Only [number] spots available. When they're gone, they're gone.

Questions? Reply or [book a quick call →].

[Your Name]

P.S. Tomorrow I'm sending one final email. If this isn't for you, no 
worries — you'll stay on the list for our regular valuable content.
```

---

### Email 7: Day 14 - Final CTA

**Trigger:** 336 hours after signup  
**Subject:** Last chance: [Offer] ends tonight

**Email Body:**

```
Hi {{FirstName}},

This is it.

In 8 hours, the [Offer Name] closes.

And honestly? I have no idea when (or if) we'll offer this again.

**Here's where we stand:**

You've spent 14 days learning about Zero Method.

You've seen the framework, the results, the process.

You know this works.

**The only question:** Is now your time?

**If yes:** [Claim your spot before midnight →]

**If not:** No hard feelings. You'll keep getting our best insights 
in your inbox. Maybe the timing will be right next time.

Either way, I appreciate you being here.

Talk soon,

[Your Name]

---

**[FINAL HOURS — CLAIM NOW →]**

---

P.S. Still on the fence? Hit reply with "TELL ME MORE" and I'll personally 
reach out to answer any final questions.
```

---

## Integration Notes

### Website Integration

**Sign-up Forms → Airtable:**
- Use Airtable forms or Zapier/Make integration
- Capture: Name, Email, Source (track UTM params)
- Auto-set: Date Added, Stage = "Awareness"

**Pricing Page Tracking:**
- Send event to Airtable when user visits pricing
- Create Interaction record: Type = "Note", Notes = "Visited pricing page"
- Auto-tag as high-intent

### Email Platform Integration

**Two-way sync:**
- Opens/clicks update Lead Score
- Unsubscribes update Tags ("Do Not Contact")
- Bounces flag for data cleanup

### Calendar Integration

**Meeting bookings:**
- Auto-create Interaction record
- Link to Contact
- Type = "Meeting"

### Payment Integration

**Stripe/PayPal webhooks:**
- Create Deal record for new purchase
- Update Contact Stage to "Purchase"
- Trigger onboarding automation

### Social Media Integration

**New followers:**
- Add to Contacts with Source = "Social Media"
- Low Lead Score initially (engagement builds score)

---

## Setup Checklist

Use this checklist when building the CRM:

### Bases Created
- [ ] Contacts Base
- [ ] Interactions Base
- [ ] Deals Base
- [ ] Content Base
- [ ] Analytics Base

### Fields Configured
- [ ] All required fields created
- [ ] Field options (select values) configured
- [ ] Linked records established
- [ ] Formulas tested

### Views Set Up
- [ ] All views created per base
- [ ] Filters verified
- [ ] Sort orders set
- [ ] Groupings configured
- [ ] Colors/conditional formatting applied

### Automations Configured
- [ ] Welcome sequence trigger
- [ ] Hot lead alerts
- [ ] Deal stage notifications
- [ ] Re-engagement sequence
- [ ] Content promotion

### Email Templates
- [ ] Day 0 email written
- [ ] Day 2 email written
- [ ] Day 4 email written
- [ ] Day 6 email written
- [ ] Day 8 email written
- [ ] Day 10 email written
- [ ] Day 14 email written
- [ ] All templates tested

### Integrations Connected
- [ ] Website form → Airtable
- [ ] Email platform connected
- [ ] Calendar integration
- [ ] Payment webhooks
- [ ] Social media monitoring (optional)

---

## Maintenance Best Practices

### Weekly Tasks
- Review Hot Leads view for follow-ups
- Update stale deals (Days in Stage > 30)
- Log interactions for key contacts
- Check automation runs

### Monthly Tasks
- Review and archive inactive contacts
- Analyze conversion rates by source
- Update content calendar
- Clean up duplicate records

### Quarterly Tasks
- Review and optimize email sequences
- Analyze pipeline velocity
- Update product tiers/pricing
- Refresh lead scoring criteria

---

## Support & Resources

**Airtable Help:** [support.airtable.com](https://support.airtable.com)  
**Zapier Airtable Integration:** [zapier.com/apps/airtable](https://zapier.com/apps/airtable)  
**Zero Method Documentation:** See internal wiki

---

*Document created: March 31, 2026*  
*Version: 1.0*  
*Maintained by: Zero Method Operations Team*
