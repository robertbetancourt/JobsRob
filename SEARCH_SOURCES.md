# SEARCH_SOURCES.md

## JobsRob — Source Strategy & Acquisition Architecture

**Version:** 1.0  
**Research date:** 2026-08-18  
**Purpose:** Define which job sources JobsRob should use, how they should be accessed, and how source data enters the local-first pipeline.

---

## 1. Executive Summary

JobsRob should **not** begin by scraping every major job board.

The recommended first strategy combines:

1. **Public ATS job feeds** — Greenhouse, Lever, Ashby.
2. **Public/aggregated job APIs** — Jobicy and, optionally, Adzuna.
3. **Targeted career-site discovery** — company career pages and ATS pages where a public structured feed exists.
4. **Restricted/partner-only sources** — LinkedIn, Indeed and similar boards should not be treated as first-class direct APIs unless JobsRob obtains an appropriate authorized integration.

### Recommended first source set

- **Tier 1:** Greenhouse
- **Tier 1:** Lever
- **Tier 1:** Ashby
- **Tier 1:** Jobicy
- **Tier 2:** Adzuna, after checking current developer terms/quota
- **Later:** Workable public career pages / targeted company sources
- **Not a direct API dependency:** LinkedIn
- **Not a direct API dependency:** Indeed
- **Not a confirmed first-party API dependency:** Wellfound

---

## 2. Core Principle

JobsRob is a **decision engine**, not a job-board clone.

The source layer exists to feed:

```text
SOURCE
   ↓
FETCH
   ↓
RAW JOB
   ↓
NORMALIZE
   ↓
PROVENANCE
   ↓
DEDUPLICATE
   ↓
HARD FILTER
   ↓
AI EVALUATION
   ↓
SCORE
   ↓
VERDICT
   ↓
RADAR
```

Source-specific fields must never become the canonical internal representation.

Every source adapter should produce the same normalized JobsRob job structure.

---

## 3. Tier 1 — Recommended First

### 3.1 Greenhouse

**Status:** Recommended

Greenhouse provides a public Job Board API for published jobs. Its GET job-board endpoints do not require authentication. The API can return job IDs, titles, locations, URLs, updated timestamps and, with `content=true`, full descriptions, departments and offices.

Useful data includes:

- job ID
- title
- location
- updated timestamp
- public job URL
- description
- department
- office
- exposed metadata

**Strength:** structured employer-originated ATS data.

**Limitation:** JobsRob needs the company's Greenhouse board token to query a specific company's board. It is not a single unauthenticated global job-search endpoint covering every Greenhouse customer.

**JobsRob strategy:** maintain a discovery list of companies/Greenhouse board tokens and periodically fetch their public jobs.

**Priority:** HIGH

---

### 3.2 Lever

**Status:** Recommended

Lever exposes published postings through its postings API. Public postings can be retrieved and content can be included. Published postings can also be filtered by public/internal distribution channel.

Useful data includes:

- posting ID
- title
- location
- description/content
- posting state
- public URL
- distribution channel
- company/job-site context

**Limitation:** Like Greenhouse, Lever's API is naturally centered around a company's Lever account/site rather than providing a universal global job-search API across every customer.

**JobsRob strategy:** maintain a company/source registry and query public Lever postings for known companies.

**Priority:** HIGH

---

### 3.3 Ashby

**Status:** Recommended

Ashby provides a public Job Postings API intended to power custom careers pages.

A public endpoint can return currently published job postings for a company's job board.

Useful data includes:

- title
- location
- secondary locations
- department
- team
- listing status
- description/details
- compensation when `includeCompensation=true`

**Important:** public job-board access is company-specific. It is not a universal global job-search API.

**JobsRob strategy:** maintain a registry of Ashby job-board names/companies and periodically fetch their public postings.

**Priority:** HIGH

---

### 3.4 Jobicy

**Status:** Recommended aggregation source

Jobicy currently provides a public Remote Jobs API with no API key required. Its documentation states that the API returns current remote jobs as structured JSON and supports filters such as count, geography, industry and tag.

Useful fields include:

- employer
- role
- location
- job type
- description
- salary
- source/job URL

**Strength:** provides breadth without requiring JobsRob to know every employer's ATS.

**Weakness:** it is a secondary aggregation source, so JobsRob must preserve Jobicy as the source and retain the original listing URL. Listings may overlap with direct ATS sources.

**JobsRob strategy:** use Jobicy as an initial broad remote-job discovery source, then deduplicate against direct ATS/company sources whenever possible.

**Priority:** HIGH for MVP discovery

---

## 4. Tier 2 — Useful but Secondary

### 4.1 Adzuna

**Status:** Candidate aggregation source

Adzuna provides a REST API for searching job advertisements by keywords and locations. Its search endpoint returns structured listings including salary and location fields and supports filters such as salary, full-time/permanent status and exclusions.

Authentication requires an `app_id` and `app_key`.

**Strengths:**

- broad aggregation
- keyword search
- location search
- salary-related filtering
- structured JSON
- multiple markets

**Considerations:**

- API credentials required
- quotas/terms must be checked before production use
- aggregated listings may overlap with other sources
- original-source URL and provenance should be preserved

**Priority:** MEDIUM

---

### 4.2 Workable

**Status:** Useful for targeted company discovery, not a universal aggregator

Workable provides APIs for retrieving open positions and job details. Its authenticated API requires an API token tied to the Workable customer account.

Workable also exposes public career-page/job-board mechanisms for published jobs.

**Critical limitation:** the first-party API is not a global feed of every Workable customer. Access is tied to individual customer accounts.

**JobsRob strategy:**

- support Workable as a source adapter;
- use public company career pages when appropriate;
- add known Workable companies to the source registry;
- do not attempt to enumerate the entire Workable ecosystem through unauthorized means.

**Priority:** MEDIUM / LATER

---

## 5. Sources Not Recommended as Direct API Dependencies

### 5.1 LinkedIn

**Status:** Do not build around a direct LinkedIn Jobs API.

LinkedIn's official Job Posting API is designed for authorized partners/ATS/job-distribution integrations to post and manage jobs, not as a general public job-search API.

Current official documentation states that access is restricted to approved partners and that LinkedIn is not currently accepting new partnerships for the Job Posting API.

**JobsRob strategy:** LinkedIn remains an important discovery destination, but should not be treated as a freely consumable source adapter unless an authorized integration becomes available.

**Priority as direct API:** NONE

**Priority as destination/source to open manually:** HIGH

---

### 5.2 Indeed

**Status:** Do not make it a core direct source at MVP.

Indeed has APIs for specific ecosystem/integration use cases, including publisher and Apply products, but the historical Publisher API should not be assumed to be a suitable new general-purpose job-search aggregation API.

**JobsRob strategy:** treat Indeed as a future/conditional source and re-check current official access requirements before implementing.

**Priority:** LOW for MVP

---

### 5.3 Wellfound

**Status:** Discovery destination; no suitable first-party public aggregation API was established during this research.

Wellfound clearly exposes searchable job listings on its website, including remote jobs and structured information such as salary, location, employment type and experience.

However, this research did not establish a current first-party public jobs API suitable for a third-party aggregator.

**JobsRob strategy:** treat Wellfound as a manual discovery source, future integration candidate, or source to revisit if official developer access becomes available.

**Priority:** LOW for MVP

---

## 6. Remote-Only Sources

### Remotive

**Status:** Useful but constrained

Remotive provides a public Remote Jobs API. Its current documentation places explicit restrictions on redistribution and requires attribution/linking to Remotive. It also states that public API listings are delayed by 24 hours.

This makes Remotive less attractive as a primary real-time radar source.

**Potential use:** supplemental remote discovery, testing, or source comparison.

**Priority:** LOW / OPTIONAL

---

## 7. Government / Specialized Sources

### USAJOBS

**Status:** Technically strong but not central to Robert's target market

USAJOBS provides an official REST Search API for currently open federal job announcements.

The API requires registration for an API key and has explicit terms governing use of the data.

It supports large paginated result sets and rich search filters.

For JobsRob, USAJOBS is not a priority because the system is primarily targeting product/design opportunities across commercial employers.

**Priority:** LOW

---

## 8. Recommended MVP Source Architecture

```text
                    ┌───────────────────┐
                    │   JobsRob Scan    │
                    └─────────┬─────────┘
                              │
             ┌────────────────┼────────────────┐
             ↓                ↓                ↓
       Greenhouse          Lever            Ashby
       company feeds       company feeds    company feeds
             │                │                │
             └────────────────┼────────────────┘
                              ↓
                         Jobicy API
                              │
                              ↓
                     Optional Adzuna
                              │
                              ↓
                       RAW JOB STORE
                              │
                              ↓
                         NORMALIZER
                              │
                              ↓
                        DEDUPLICATOR
                              │
                              ↓
                       JOBSROB ENGINE
```

Direct ATS feeds provide high-quality employer-originated data. Aggregation provides breadth.

---

## 9. Source Adapter Interface

Every source should implement a common interface conceptually equivalent to:

```ts
interface JobSource {
  id: string
  name: string
  type: 'ats' | 'aggregator' | 'career_site' | 'specialized'

  search(params: SourceSearchParams): Promise<RawJob[]>

  getJob?(id: string): Promise<RawJob | null>

  healthCheck?(): Promise<SourceHealth>
}
```

Do not expose provider-specific fields directly to the UI.

---

## 10. Raw vs Normalized Data

Every source response must be preserved before normalization.

```text
RawSourceJob
    ↓
Normalizer
    ↓
NormalizedJob
```

Raw data should retain:

- source ID
- source name
- source URL
- fetched timestamp
- raw payload
- source-specific identifiers
- extraction status

The normalized job should populate the canonical `Job` model.

---

## 11. Provenance

Every important normalized field should be traceable to a source.

Example:

```json
{
  "salary": {
    "raw": "$2,500-$3,000 USD/month",
    "min": 2500,
    "max": 3000,
    "currency": "USD",
    "period": "month",
    "source": "greenhouse",
    "confidence": "high"
  }
}
```

If multiple sources disagree:

```text
Source A: Remote — Latin America
Source B: United States only
```

JobsRob must preserve the conflict rather than silently selecting one.

---

## 12. Deduplication Strategy

The same job may appear on:

```text
Company career page
↓
Greenhouse
↓
LinkedIn
↓
Jobicy
↓
Adzuna
```

Do not treat each listing as a separate opportunity.

### Strong signals

- canonical external job ID
- ATS job ID
- exact application URL
- company + requisition ID

### Medium signals

- normalized company name
- normalized title
- location
- salary
- description similarity

### Weak signals

- title alone
- company alone

Store:

```text
canonical_job_id
duplicate_group_id
source_job_ids
duplicate_confidence
```

The user should see one opportunity with multiple sources, not five copies.

---

## 13. Source Priority When Duplicates Exist

Prefer sources approximately in this order:

```text
1. Employer's direct ATS / career source
2. Employer's official career page
3. Specialized aggregator
4. General aggregator
5. Search/indexing destination
```

For example:

```text
Greenhouse employer listing
>
Jobicy copy
>
Adzuna copy
```

The direct employer source should generally be considered stronger provenance.

---

## 14. Search Strategy

Do not initially search the entire internet for one generic phrase such as:

> "Product Designer"

Instead JobsRob should build queries from Robert's profile.

Conceptually:

```text
ROLE QUERY SET
├── Product Designer
├── Senior Product Designer
├── Product Designer II
├── UX Designer
├── UI/UX Designer
├── Product Design
└── related titles discovered during calibration
```

Title groups should remain configurable.

The search layer should eventually support:

```text
include_titles
exclude_titles
seniority_targets
location_preferences
employment_types
remote_preferences
```

These preferences belong to discovery, not scoring.

---

## 15. Discovery vs Evaluation

### Discovery

Find potentially relevant jobs.

Optimize for:

- recall
- source coverage
- freshness

### Evaluation

Determine whether a job is worth Robert's time.

Optimize for:

- precision
- evidence
- explainability
- hard filters

Do not make source search overly restrictive.

The evaluator decides which discovered roles are actually worthwhile.

---

## 16. Freshness

Each source should record:

```text
fetched_at
source_updated_at
first_seen_at
last_seen_at
```

JobsRob should distinguish:

- newly discovered
- recently updated
- previously seen
- stale
- closed/unavailable

Do not assume a job is new simply because JobsRob fetched it today.

---

## 17. Source Health

Each source should eventually expose:

```text
source_status
last_success
last_failure
latency
jobs_returned
error_count
```

A failed source should not prevent the entire scan.

Example:

```text
Greenhouse     ✓ 132
Lever          ✓ 84
Ashby          ✓ 56
Jobicy         ✓ 100
Adzuna         ⚠ unavailable
```

---

## 18. MVP Implementation Order

### Phase 1
Implement the source abstraction. No scraping yet.

### Phase 2
Implement **Greenhouse adapter** using a small manually curated company registry.

### Phase 3
Implement **Lever adapter**.

### Phase 4
Implement **Ashby adapter**.

### Phase 5
Implement **Jobicy adapter**.

### Phase 6
Normalize all four sources into the same `Job` structure.

### Phase 7
Implement deduplication.

### Phase 8
Run the existing hard-filter and scoring pipeline.

### Phase 9
Evaluate whether Adzuna adds enough incremental coverage to justify another integration.

---

## 19. What NOT to Build Yet

Do not build:

- LinkedIn scraping
- Indeed scraping
- browser automation for job collection
- autonomous application submission
- CAPTCHA bypass
- login automation
- multi-user infrastructure
- cloud database
- complex crawling infrastructure
- dozens of source adapters
- generalized web search

The MVP should prove:

```text
4 sources
→ normalized jobs
→ deduplicated jobs
→ hard filters
→ AI evaluation
→ useful Radar
```

---

## 20. Success Criteria

The acquisition layer is successful when JobsRob can:

1. Fetch jobs from multiple sources.
2. Preserve original source URLs.
3. Preserve raw source evidence.
4. Normalize different source schemas.
5. Deduplicate the same opportunity.
6. Detect source conflicts.
7. Pass clean jobs into the existing decision engine.
8. Explain where important fields came from.
9. Continue scanning if one source fails.
10. Show Robert a substantially smaller, higher-quality set of opportunities than manually browsing job boards.

The ultimate metric is NOT:

> "How many jobs did JobsRob find?"

It is:

> **"How many relevant opportunities did JobsRob surface without making Robert manually inspect dozens of irrelevant listings?"**

---

## 21. Research Notes

This document was researched on **2026-08-18** using current provider documentation where available.

Confirmed during research:

- Greenhouse public Job Board GET endpoints do not require authentication.
- Lever provides public/published posting access through its postings API.
- Ashby provides a public Job Postings API for company job boards and can optionally include compensation.
- Jobicy currently provides a public remote-jobs REST API without an API key.
- Adzuna provides a REST job-search API requiring an app ID/key.
- Workable provides job APIs and public career/job-board mechanisms, but its first-party API is account-scoped.
- LinkedIn's official Job Posting API is partner-restricted and is designed around posting/integration rather than general public job search.
- Remotive provides a public API but has redistribution/attribution and freshness constraints.
- USAJOBS provides an official REST search API with API-key registration and usage terms.
- A suitable first-party public Wellfound jobs API was not established during this research.

When implementing a source, re-check the provider's current documentation and terms rather than relying solely on this document.

---

## 22. Final Recommendation

### Build first

```text
Greenhouse
Lever
Ashby
Jobicy
```

### Evaluate later

```text
Adzuna
Workable
Remotive
USAJOBS
```

### Do not make direct API dependencies for MVP

```text
LinkedIn
Indeed
Wellfound
```

This gives JobsRob a pragmatic balance of:

**coverage + reliability + structured data + maintainability + low complexity.**

The architecture should remain source-agnostic so additional providers can be added later without changing the decision engine.
