# PRODUCT.md

## 01 — Product Overview

**Job Radar** is a local personal job-intelligence tool for Robert Betancourt.

Its purpose is to discover, normalize, filter, evaluate, and prioritize Product Design opportunities so Robert can spend his limited time reviewing and applying to jobs that are actually worth pursuing.

Job Radar is not a generic job board.

It is a personal decision-support system built around Robert's experience, preferences, constraints, and feedback.

### Core loop

> **Search → Scan → Expand → Understand → Decide**

The product should reduce the amount of low-value job-search work Robert has to do manually.

---

## 02 — Problem

Traditional job searching creates too much low-value work.

A typical workflow is:

1. Find a job.
2. Open the listing.
3. Read the description.
4. Check location.
5. Discover a work authorization restriction.
6. Open the application.
7. Fill in repetitive questions.
8. Discover additional requirements.
9. Potentially spend hours on a challenge.
10. Get rejected or never hear back.

The problem is not simply finding jobs.

The problem is determining:

> **Which jobs are worth Robert's time?**

Job Radar should move the expensive human decision toward the end of the process.

---

## 03 — Goal

### Primary goal

Help Robert identify high-value job opportunities quickly.

The product should answer:

> **"Which of these jobs deserve my attention?"**

### Secondary goals

- Reduce repetitive searching.
- Detect obvious incompatibilities early.
- Remove duplicate postings.
- Surface relevant opportunities from multiple sources.
- Explain why an opportunity is recommended or rejected.
- Estimate application effort.
- Track Robert's decisions.
- Learn from Robert's feedback over time.

### Success metric

The first MVP succeeds if Robert can go from:

> **"I need to look for jobs."**

to:

> **"Here are the few jobs worth reviewing today."**

with substantially less manual effort.

---

## 04 — User

### Primary user

Robert Betancourt.

Product Designer / UI/UX Designer with approximately five years of experience.

The product should be optimized for one person rather than generalized for a marketplace of users.

### User characteristics

Robert:
- Understands Product Design and UX.
- Can evaluate job descriptions himself.
- Does not need basic career advice inside the tool.
- Has limited time and wants to avoid repetitive applications.
- Is flexible about industries, company size, seniority, and employment type when the overall opportunity is good.
- Cares strongly about compensation relative to workload and working conditions.
- Wants international/remote opportunities but can consider local or relocation opportunities when practical.

The system should assist Robert's judgment, not replace it.

---

## 05 — Core Workflow

### Step 1 — Search

Robert presses:

> **Search for new jobs**

The system gathers available opportunities from configured sources.

### Step 2 — Normalize

The system converts different job-source formats into one internal structure.

### Step 3 — Deduplicate

Semantically duplicate postings are grouped or removed.

### Step 4 — Hard filtering

Obvious incompatibilities are removed or strongly flagged.

Examples:
- Clearly unpaid work.
- Clearly fraudulent/suspicious opportunities.
- Impossible work authorization requirements.
- Clearly extreme working conditions.
- Roles fundamentally unrelated to Product/UX/UI Design.

### Step 5 — AI evaluation

Remaining jobs receive:
- AI Score.
- Verdict.
- Reasons.
- Unknowns and warnings.
- Compensation assessment.
- Location assessment.
- Application effort estimate.
- Potential portfolio/project matches.

### Step 6 — Robert review

Robert reviews the shortlist.

Possible actions:
- Apply
- Save
- Skip
- Review later

### Step 7 — Feedback

Robert can optionally record why he skipped or accepted a job.

This feedback becomes part of the system's future decision-support data.

---

## 06 — Information Architecture

The MVP should remain small.

### Primary navigation

- **Radar**
- **Saved**
- **Applications**
- **Companies**
- **Settings**

### Radar

The main working area.

Contains:
- Search action
- Last scan
- Result statistics
- Filters
- Job results
- AI scores
- Status
- Review controls

### Saved

Opportunities Robert wants to keep without applying immediately.

### Applications

Jobs Robert has decided to pursue.

Potential statuses:
- Preparing
- Applied
- Interview
- Challenge
- Offer
- Rejected
- Withdrawn

### Companies

Companies Robert considers interesting independent of a currently open role.

### Settings

Contains:
- Search sources
- Personal profile data
- Job rules
- AI configuration
- API configuration
- Data management

Settings should not be overbuilt in MVP.

---

## 07 — Main Screen: Radar

The Radar screen is the heart of the application.

### Header

Show:

- Job Radar
- Last scan
- Search button

Primary CTA:

> **Search for new jobs**

Optional secondary action:

> Refresh / Scan again

### Summary

Show compact statistics such as:

- Jobs found
- Duplicates removed
- Filtered
- Strong matches
- New opportunities
- Saved
- Applied

Do not turn the screen into an analytics dashboard.

Statistics exist to provide context, not decoration.

### Filters

Useful filters may include:

- Verdict
- AI Score
- Role
- Seniority
- Location
- Remote / Hybrid / On-site
- Employment type
- Compensation
- Application effort
- Source
- Date discovered
- Status

Filters should remain secondary to the job results.

---

## 08 — Job Results

The primary result should be a dense but readable list/table rather than a grid of oversized cards.

Each row should communicate enough information for rapid scanning.

### Suggested fields

- AI Score
- Verdict
- Role
- Company
- Location
- Work arrangement
- Compensation
- Employment type
- Experience
- Application effort
- Discovered
- Status

### Example

```text
91  🔥  Senior Product Designer
       Company X
       Remote · Latin America
       $2,500–$3,500
       Full-time · 5+ years
       Application: Low
```

The exact visual treatment is flexible.

The principle is:

> **High information density without visual clutter.**

---

## 09 — Job Detail

Clicking a job should expand it or open a detail panel without forcing Robert to lose his place in the result list.

### Detail structure

#### Header

- Role
- Company
- AI Score
- Verdict
- Location
- Compensation
- Employment type

#### AI assessment

**Why it matches**

A concise explanation grounded in the job posting.

**Concerns**

Missing information, evidence constraints, or mismatches.

**Compensation & conditions**

Explain the relationship between compensation and workload when enough information exists.

**Location**

Explain whether the arrangement appears compatible with Robert's situation.

**Application effort**

Estimate how much time/effort the application may require.

#### Recommended projects

Potential portfolio/project matches:
- B89
- Banexcoin
- GIP
- Autoandes
- BE FIT
- Mimik

Only show recommendations when there is a meaningful connection.

#### Original source

Provide:
- Source
- Job URL
- Application URL when available

Primary action:

> **Open application**

Secondary actions:

> Save  
> Skip  
> Mark as applied

---

## 10 — AI Score Presentation

The score should be immediately understandable.

Example:

> **91 / 100 — Strong match**

The score should never be presented without context.

### Verdict levels

- **🔥 Apply**
- **🟢 Strong match**
- **🟡 Review**
- **🟠 Low priority**
- **🔴 Skip**

The canonical 100-point scoring weights are final.

### Important

The AI Score is a recommendation, not truth.

Robert must be able to disagree with it.

---

## 11 — Search Experience

When Robert starts a scan, the UI should make the process visible.

Example:

```text
Searching...

✓ Source A
✓ Source B
✓ Source C

Found 83 jobs

✓ Removed 21 duplicates
✓ Removed 17 incompatible jobs

45 jobs remaining

AI evaluation...
████████████████░░░ 82%

Complete

8 strong matches
12 worth reviewing
25 low priority
```

The progress UI should communicate actual system stages.

Do not fake progress or show decorative loading states that do not correspond to real operations.

---

## 12 — Empty States

### No new jobs

> **No new opportunities found.**

Show:
- Last scan
- Sources checked
- Option to scan again
- Optional suggestion to broaden filters

### No strong matches

> **Nothing strong enough to recommend right now.**

Do not manufacture recommendations just to fill the interface.

### No saved jobs

> **No saved opportunities yet.**

### No applications

> **No applications tracked yet.**

---

## 13 — Duplicate Handling

Duplicate detection is a core feature.

The system should recognize when the same role appears through multiple sources.

Instead of showing:

> Company X — Product Designer
> Company X — Product Designer
> Company X — Product Designer

show one canonical opportunity.

The detail view may indicate:

> **Found on 3 sources**

Possible sources can be displayed as metadata.

The system should preserve the best available application URL.

---

## 14 — Human Review

Human review is a first-class part of the product.

Robert should be able to override AI recommendations.

### Actions

- Apply
- Save
- Skip
- Review later

### Optional rejection reason

- Compensation
- Location
- Work authorization
- Working hours
- Scope
- Seniority
- Application effort
- Company
- Suspicious
- Not interesting
- Other

The interface should make these actions fast.

---

## 15 — Application Tracking

The MVP should not attempt to become a full ATS.

It only needs enough tracking to remember what happened.

Suggested statuses:

```text
Saved
↓
Preparing
↓
Applied
↓
Interview
↓
Challenge
↓
Offer
```

Alternative terminal states:

- Rejected
- Withdrawn

Each application can store:
- Date
- Job
- Company
- Status
- Notes
- Application URL
- Optional next action/date

---

## 16 — Companies

The Companies section is a secondary discovery layer.

Robert can save companies even when they have no suitable open role.

Company information may include:
- Name
- Website
- Careers page
- Region
- Company type
- Why it is interesting
- Current open roles
- Last checked

Future functionality may notify Robert when a saved company opens a relevant role.

This is not required for the first UI implementation.

---

## 17 — Design Principles

Job Radar should feel like a professional personal tool, not a generic HR SaaS dashboard.

### 1. Editorial clarity

Strong hierarchy.

Clear typography.

Meaningful whitespace.

Information should be easy to scan.

### 2. Dense, not crowded

The product needs to display substantial information.

Density is useful.

Visual clutter is not.

### 3. Utility over decoration

No gradients, glassmorphism, excessive animation, or decorative charts unless they improve usability.

### 4. Fast decision-making

The interface should support rapid comparison.

A user should understand a job's:
- role
- location
- compensation
- score
- company_opportunity_quality
- effort

within seconds.

### 5. Progressive disclosure

Do not show every piece of information at once.

List:
> essential information.

Expanded detail:
> reasoning and evidence.

Original listing:
> full source information.

### 6. Trust

The system should clearly distinguish:
- confirmed job data
- AI interpretation
- missing information
- Robert's decision

Never make an inference look like a confirmed fact.

### 7. Calm

The product exists to reduce job-search anxiety and repetitive work.

Avoid:
- notification overload
- gamification
- aggressive urgency
- fake scarcity
- noisy dashboards

### 8. Personal

This is Robert's tool.

It should feel opinionated and tailored rather than generic.

---

## 18 — MVP Scope

### Must have

- Local application
- Radar dashboard
- Search button
- Job list/table
- Job detail panel/page
- AI Score display
- Verdict
- Reasons
- Concerns
- Basic filters
- Duplicate indicator
- Save
- Skip
- Application status
- Mock job data
- Local persistence

### Phase 1 specifically

Build the UI using mock data.

No live job scraping yet.

No AI API yet.

No authentication.

No cloud database.

No automatic applications.

---

## 19 — Out of Scope for Initial UI

Do NOT build these during Phase 1:

- Automated application submission
- LinkedIn scraping
- Complex authentication
- Multi-user accounts
- Billing
- Public job board
- Social features
- Chat system
- Advanced analytics
- Complex notification infrastructure
- Automatic emails
- Full ATS functionality
- AI-generated application answers
- Browser automation

These may be considered later if they are useful.

---

## 20 — Phase 1 UX Goal

The first prototype should answer one question:

> **Can Robert quickly scan a set of opportunities, understand why they were ranked, open a promising job, and decide what to do next?**

If yes, Phase 1 is successful.

The prototype should use realistic mock data representing:

- Excellent match
- Good match
- Borderline opportunity
- Low compensation but good conditions
- High compensation but terrible workload
- Location mismatch
- Unpaid opportunity
- Unknown salary
- Long application challenge
- Duplicate postings

The mock dataset should deliberately test the decision model.

---

## 21 — Core UX Principle

The most important interaction in Job Radar is not:

> **Search**

It is:

> **Decide.**

Search merely brings opportunities into the system.

The product's value is helping Robert decide:

> **Apply, save, skip, or investigate further.**
