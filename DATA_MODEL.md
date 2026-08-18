# Data Model

The JobsRob Data Model is normalized and optimized for decision clarity, tracking both raw job data and AI evaluations.

## 1. Core Job Object (`Job`)

The canonical representation of an opportunity.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier. |
| `title` | `string` | The official job title. |
| `company_id` | `string` | Normalized company identifier. |
| `company_name` | `string` | Official company name. |
| `company_industry` | `string` | Industry/Domain of the company. |
| `description` | `string` | Full raw text description. |
| `location` | `LocationObj` | Structured location and work arrangement data. |
| `work_arrangement` | `enum` | `'remote' \| 'hybrid' \| 'onsite'` |
| `employment_type` | `enum` | `'full_time' \| 'contract' \| 'freelance' \| 'part_time'` |
| `seniority` | `string` | e.g. `'senior'`, `'lead'`, `'staff'` |
| `salary` | `SalaryObj` | Structured compensation data. |
| `working_hours` | `WorkingHoursObj` | Assessment of schedule and demands. |
| `experience_required` | `string` | Raw string (e.g. "5+ years"). |
| `requirements` | `RequirementsObj` | Structured requirements. |
| `application_requirements` | `AppReqObj` | Effort and logistics needed to apply. |
| `hard_filter` | `HardFilterObj` | Immediate disqualifiers. |
| `ai_evaluation` | `AIEvalObj` | The 100-point scoring model. |
| `sources` | `SourceObj[]` | Where this job was found. |
| `duplicate_group` | `DuplicateObj` | Aggregation metadata if found on multiple boards. |
| `status` | `enum` | User state: `'new' \| 'saved' \| 'skipped' \| 'applied'` |
| `canonical_url` | `string` | Primary link for application. |
| `discovered_at` | `string` (ISO) | When JobsRob first saw this. |

## 2. Hard Filter Object (`HardFilterObj`)

Acts as a circuit breaker. If a job triggers a hard filter, it is automatically assigned `verdict: 'skip'` regardless of its AI score.

| Field | Type | Description |
|-------|------|-------------|
| `status` | `enum` | `'pass' \| 'review' \| 'fail'` |
| `reasons` | `enum[]` | E.g. `'equity_only'`, `'us_w2_only'`, `'onsite_required'`, `'extreme_hours'` |
| `warnings` | `string[]` | Medium-severity flags (e.g. "Unpaid take-home test"). |

## 3. Application Requirements (`AppReqObj`)

Captures the friction of applying.

| Field | Type | Description |
|-------|------|-------------|
| `application_url` | `string` | Direct link to the form. |
| `ats` | `string` | The platform (e.g. "Greenhouse", "Workday"). |
| `estimated_effort` | `enum` | `'low' \| 'medium' \| 'high' \| 'very_high'` |
| `take_home` | `object` | `{ required: boolean, estimated_hours?: number, compensated: boolean | 'unknown' }` |

## 4. AI Evaluation Object (`AIEvalObj`)

The 100-point transparent scoring system.

| Field | Type | Description |
|-------|------|-------------|
| `score` | `number` | Must be strictly calculated as the sum of all dimensions (0-100). |
| `verdict` | `enum` | `'apply' \| 'review' \| 'skip'` |
| `dimensions` | `DimensionsObj` | The 7 core evaluation areas. |

### Dimension Architecture (`DimensionsObj`)

Instead of raw numbers, every dimension provides a rationale for transparent explainability.

| Dimension | Points | Description |
|-----------|--------|-------------|
| `role_fit` | 25 | Alignment with core design skills. |
| `compensation_conditions` | 25 | Total reward vs required lifestyle. |
| `location` | 15 | Remote/LATAM viability. |
| `experience` | 10 | Seniority match. |
| `scope` | 10 | Quality of responsibilities. |
| `company` | 10 | Prestige and domain. |
| `application_effort`| 5 | Friction penalty. |

**Structure per dimension:**
```typescript
{
  score: number | null; // null if insufficient evidence
  rationale: string; // "Why did it get this score?"
  confidence: 'high' | 'low' | 'unknown';
}
```

## 5. Working Hours & Salary
- `salary` now tracks `confidence` to distinguish between explicitly stated ranges vs inferred market rates.
- `working_hours` uses enums for `weekend_required` (no, occasional_compensated, frequent_uncompensated) to prevent false-positive rejections.
- `conflicts` explicitly tracks contradictory evidence across multiple sources.
