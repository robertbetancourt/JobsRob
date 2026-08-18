# ROADMAP.md

## Purpose

Define the implementation roadmap for Job Radar.

The project should be built incrementally.

Each phase must produce something usable before moving to the next phase.

Do not build the entire system at once.

---

# 01 — Development Principles

## Build the decision experience first

The core product is:

> Search → Scan → Expand → Understand → Decide

The first implementation should prove this interaction with realistic mock data before connecting external job sources.

## Keep the MVP local-first

Initial target:

- Single user
- Local application
- Local persistence
- No authentication
- No cloud infrastructure
- No public deployment requirement

## Avoid premature complexity

Do not introduce:

- Microservices
- Kubernetes
- Complex cloud infrastructure
- Multi-user architecture
- Billing
- Real-time systems

unless a later phase genuinely requires them.

## AI should be introduced after the UX is proven

Do not use AI to compensate for an unclear product model.

First establish:

1. What information is shown.
2. How jobs are compared.
3. How Robert reviews them.
4. How decisions are recorded.

Then connect AI evaluation.

---

# 02 — Phase 1: Product UI Prototype

## Goal

Build the Job Radar interface using realistic mock data.

No live scraping.

No external job APIs.

No AI API.

The objective is to validate the UX.

## Build

### Radar

- Header
- Search button
- Last scan
- Summary statistics
- Filters
- Job results

### Job result

- AI Score
- Verdict
- Role
- Company
- Location
- Compensation
- Employment type
- Application effort
- Status

### Job detail

Expandable detail panel or side panel.

Show:

- Job information
- AI assessment mock
- Why it matches
- Concerns
- Compensation assessment
- Location assessment
- Application effort
- Recommended projects
- Source/application links

### Human review

Actions:

- Apply
- Save
- Skip
- Review later

### Additional screens

Create minimal versions of:

- Saved
- Applications
- Companies
- Settings

Only enough to establish navigation and core states.

## Mock data

Include at least:

- Excellent match
- Strong LATAM opportunity
- Low salary + good conditions
- High salary + terrible workload
- US-only role
- Unpaid opportunity
- Unknown salary
- Junior role + strong compensation
- Senior role + poor conditions
- Long take-home challenge
- Duplicate postings

## Success criteria

Robert can:

1. Open Radar.
2. Understand what is new.
3. Scan multiple opportunities quickly.
4. Identify strong matches.
5. Expand a job.
6. Understand the AI reasoning.
7. Decide Apply / Save / Skip / Review later.
8. Navigate to Saved and Applications.
9. Return to Radar without losing context.

---

# 03 — Phase 2: Local Data Layer

## Goal

Move from static mock data to persistent local data.

## Build

- SQLite or appropriate local database
- Job entity
- Company entity
- JobSource entity
- AI evaluation entity
- Human review entity
- Application entity
- Duplicate group entity

Follow `DATA_MODEL.md`.

## Requirements

- Data survives application restart.
- Jobs can be added and updated.
- Robert's decisions persist.
- Duplicate relationships persist.
- Source URLs persist.

## Success criteria

Closing and reopening the app does not lose:

- Jobs
- Scores
- Decisions
- Saved items
- Applications

---

# 04 — Phase 3: Job Discovery

## Goal

Introduce real job sources.

The first version should use sources that provide structured/public access where technically and legally appropriate.

Potential sources may include:

- Public ATS job boards
- Greenhouse
- Ashby
- Other suitable public job APIs
- Carefully selected job boards

Do not build the system around unauthorized scraping of platforms that prohibit automated access.

## Build

Create a source adapter architecture:

```text
Job Source
    ↓
Source Adapter
    ↓
Normalized Job
```

Each source adapter should output the common `Job` model.

## Success criteria

Pressing:

> Search for new jobs

produces real job records in the local database.

---

# 05 — Phase 4: Normalization & Deduplication

## Goal

Prevent the same opportunity from appearing multiple times.

## Build

Normalize:

- Titles
- Company names
- Locations
- Employment types
- Salary formats
- URLs
- Dates

Then detect duplicates using combinations of:

- Company
- Title
- Description similarity
- Location
- Application URL
- External source ID

## UI

Show:

> Found on 3 sources

when relevant.

Preserve useful source information.

## Success criteria

Duplicate jobs are grouped into a canonical opportunity instead of cluttering the Radar.

---

# 06 — Phase 5: Hard Filtering

## Goal

Remove or flag opportunities that clearly violate Robert's rules.

Use `JOB_RULES.md`.

Examples:

- Unpaid
- Suspicious
- Clearly impossible work authorization
- Clearly extreme working conditions
- Fundamentally unrelated role
- Clearly incompatible compensation/workload

## Important

Hard filtering must remain conservative.

Unknown information should not automatically become a rejection.

## Success criteria

Obvious low-value opportunities disappear or are strongly flagged before AI scoring.

---

# 07 — Phase 6: AI Evaluation

## Goal

Evaluate the remaining opportunities using Robert's rules.

## AI should analyze

- Role fit
- Compensation & conditions
- Location compatibility
- Experience/seniority
- Scope
- Application effort
- Company
- Risks

## Output

Structured evaluation:

```json
{
  "score": 87,
  "verdict": "strong_match",
  "why_it_matches": [],
  "concerns": [],
  "recommended_projects": []
}
```

## Important

AI must never:

- Invent job facts
- Invent salary
- Invent benefits
- Invent work authorization
- Automatically apply

## Success criteria

Each eligible job has a transparent evaluation that can be inspected by Robert.

---

# 08 — Phase 7: Application Intelligence

## Goal

Understand how expensive an application will be before Robert spends time on it.

Detect when possible:

- Application platform / ATS
- Number of questions
- Cover letter
- Portfolio requirement
- References
- Video
- Take-home challenge
- Estimated effort

## Output

Example:

```text
Application effort
LOW

Estimated time
8 minutes

Questions
4

Take-home
None
```

Or:

```text
Application effort
HIGH

Estimated time
3–4 hours

Take-home
Required
```

## Success criteria

Robert can make a better decision about whether an opportunity is worth the time required to apply.

---

# 09 — Phase 8: Human Feedback Loop

## Goal

Use Robert's decisions to improve future prioritization.

Store:

- Apply
- Save
- Skip
- Review later
- Rejection reason
- Notes

Analyze patterns over time.

Example:

If Robert repeatedly rejects:

> "Low salary + excessive workload"

the system can later identify that pattern more confidently.

## Important

Do not automatically rewrite the core rules based on a single decision.

Feedback should inform future scoring and be reviewable.

---

# 10 — Phase 9: Application Tracking

## Goal

Track opportunities Robert actually pursues.

Statuses:

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

Alternative:

- Rejected
- Withdrawn

## Build

- Application date
- Status
- Notes
- Next action
- Next action date
- Source/application URL

## Success criteria

Robert can see what he has applied to and what needs attention without maintaining a separate spreadsheet.

---

# 11 — Phase 10: Company Radar

## Goal

Track companies that are interesting even when they currently have no suitable role.

## Build

Company profile:

- Name
- Website
- Careers page
- Industry
- Location
- Why interesting
- Saved status
- Last checked
- Open relevant jobs

Future:

> Company X opened a Product Designer role.

## Success criteria

Job discovery becomes proactive rather than purely reactive.

---

# 12 — Phase 11: Search Profiles

## Goal

Allow different search modes without changing the core rules.

Potential profiles:

### International Product Design

Remote/global opportunities.

### LATAM

Opportunities explicitly compatible with Latin America.

### High Compensation

Prioritize stronger compensation while preserving reasonable conditions.

### Fast Applications

Prioritize low-effort applications.

### Local

Venezuela-focused opportunities.

These are profiles, not separate products.

---

# 13 — Phase 12: Monitoring & Automation

Only after the core system is reliable.

Possible capabilities:

- Scheduled scans
- New-job detection
- Saved-company monitoring
- New high-score opportunity alerts
- Daily/weekly summaries

Notifications should be restrained.

The goal is to reduce work, not create another source of noise.

---

# 14 — Phase 13: Analytics

Only after enough real usage exists.

Potential metrics:

- Jobs discovered
- Jobs filtered
- Strong matches
- Applications
- Interviews
- Offers
- Rejection rate
- Source quality
- Average AI score of applied jobs
- Application effort
- Time spent per application
- Which sources produce useful jobs
- Which rules produce false positives/negatives

The analytics should answer:

> **Is Job Radar actually improving Robert's job search?**

Not merely display vanity metrics.

---

# 15 — Future: Scoring Calibration

After collecting enough real examples:

Compare:

```text
AI recommendation
        vs
Robert decision
        vs
Actual outcome
```

Use this to evaluate:

- False positives
- False negatives
- Salary interpretation
- Location interpretation
- Application-effort estimation
- Role matching

Then adjust scoring weights.

Do not attempt sophisticated machine learning until there is enough real data to justify it.

---

# 16 — Recommended Build Order

The project should be implemented in this exact order initially:

```text
PHASE 1
UI + Mock Data
        ↓
PHASE 2
Local Persistence
        ↓
PHASE 3
Real Job Sources
        ↓
PHASE 4
Normalization + Deduplication
        ↓
PHASE 5
Hard Filters
        ↓
PHASE 6
AI Evaluation
        ↓
PHASE 7
Application Intelligence
        ↓
PHASE 8
Human Feedback
        ↓
PHASE 9
Application Tracking
        ↓
PHASE 10
Company Radar
        ↓
PHASE 11
Search Profiles
        ↓
PHASE 12
Monitoring
        ↓
PHASE 13
Analytics
```

Do not skip directly to the later phases.

---

# 17 — Antigravity Instructions

When starting development with Antigravity, provide:

- `PRODUCT.md`
- `JOB_RULES.md`
- `DATA_MODEL.md`
- `ROADMAP.md`

The first instruction should be:

> **Build Phase 1 only.**

Phase 1 must use mock data.

Do NOT implement:

- Scraping
- External APIs
- AI API calls
- Authentication
- Cloud database
- Automatic applications
- Notifications
- Complex backend infrastructure

until the Phase 1 UX is validated.

---

# 18 — Phase Completion Rule

A phase is complete when its success criteria are met.

Do not add unrelated features simply because they are technically easy.

If a phase exposes a UX problem, fix the UX before moving forward.

The project should grow through validated increments rather than feature accumulation.

---

# 19 — Current Status

| Phase | Status |
|---|---|
| Product definition | Complete |
| Job rules | Complete |
| Data model | Complete |
| Roadmap | Complete |
| Phase 1 — UI prototype | Not started |
| Phase 2 — Local data | Not started |
| Phase 3 — Job discovery | Not started |
| Phase 4 — Deduplication | Not started |
| Phase 5 — Hard filters | Not started |
| Phase 6 — AI evaluation | Not started |
| Phase 7 — Application intelligence | Not started |
| Phase 8 — Feedback | Not started |
| Phase 9 — Applications | Not started |
| Phase 10 — Company Radar | Not started |
| Phase 11 — Search profiles | Not started |
| Phase 12 — Monitoring | Not started |
| Phase 13 — Analytics | Not started |

---

# 20 — Final Principle

Build the smallest useful system first.

The first milestone is NOT:

> "Automate job searching."

The first milestone is:

> **"Create a job-review interface that makes deciding what deserves Robert's time dramatically easier."**

Once that works, automate the pipeline behind it.
