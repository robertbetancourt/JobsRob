# Decision Model Validation Suite

This document evaluates the current JobsRob Decision Model architecture (as defined by `DATA_MODEL.md` and `src/types/job.ts`) against 12 deterministic test cases based strictly on `JOB_RULES.md`.

## 1. LOW SALARY / HEALTHY CONDITIONS
**Scenario:** $600/month, 40 hours/week, Remote, Product Designer, No challenge, Reasonable working conditions.
**Expected:** Not automatically incompatible.
* **Dimension Scores:** Role (25/25), Comp & Cond (10/25), Loc (15/15), Exp (10/10), Scope (10/10), Company (8/10), App Effort (5/5).
* **Unknown States:** None.
* **Hard Filters Triggered:** None.
* **Final Score:** ~83/100
* **Final Verdict:** `review`
* **Rationale:** Salary is below target, but healthy conditions and strong role fit make it a viable fallback option.
* **Matches JOB_RULES.md?** YES.

## 2. HIGH SALARY / EXTREME HOURS
**Scenario:** $5,000/month, 12–14 hours/day, 7 days/week, Mandatory weekend work, Constant on-call.
**Expected:** Hard incompatibility regardless of compensation.
* **Dimension Scores:** Role (25/25), Comp & Cond (5/25), Loc (15/15), Exp (10/10), Scope (10/10), Company (5/10), App Effort (5/5).
* **Unknown States:** None.
* **Hard Filters Triggered:** `extreme_hours`, `mandatory_weekends`
* **Final Score:** ~75/100
* **Final Verdict:** `skip`
* **Rationale:** Extremely high compensation does not override the hard rejection for abusive 14-hour days and 7-day weeks.
* **Matches JOB_RULES.md?** YES. The architectural separation of Hard Filter and Score correctly forces a `skip` despite a decent numeric total.

## 3. STRONG ROLE / UNKNOWN COMPANY
**Scenario:** $2,500/month, 40 hours/week, Remote LATAM, Strong Product Design match, Company quality unknown.
**Expected:** Company Quality UNKNOWN, not 0. No false negative.
* **Dimension Scores:** Role (25/25), Comp & Cond (20/25), Loc (15/15), Exp (10/10), Scope (10/10), Company (`null`/10), App Effort (5/5).
* **Unknown States:** `company` = `unknown`.
* **Hard Filters Triggered:** None.
* **Final Score:** 85/100 (Max possible: 90)
* **Final Verdict:** `apply`
* **Rationale:** Excellent fit across the board, but company background is a black box.
* **Matches JOB_RULES.md?** **NO (FLAW).** The dynamic sum architecture strictly adds dimensions. If `company` is `null`, the total score is out of 90 instead of 100. This mathematically penalizes the job by 10 points simply because evidence is missing. The system currently fails to prorate or normalize scores containing `null` dimensions.

## 4. STRONG ROLE / UNPAID TAKE-HOME
**Scenario:** $2,500/month, 40 hours/week, Remote, Excellent role fit, 4-hour unpaid design challenge.
**Expected:** Strong negative signal / hard incompatibility.
* **Dimension Scores:** Role (25/25), Comp & Cond (20/25), Loc (15/15), Exp (10/10), Scope (10/10), Company (8/10), App Effort (0/5).
* **Unknown States:** None.
* **Hard Filters Triggered:** `unpaid_take_home_extreme`
* **Final Score:** 88/100
* **Final Verdict:** `skip`
* **Rationale:** 4-hour unpaid friction triggers the circuit breaker, freezing the high score.
* **Matches JOB_RULES.md?** YES.

## 5. STRONG ROLE / PAID WEEKEND WORK
**Scenario:** $2,500/month, 40 hours/week normally, Occasional weekend work explicitly compensated.
**Expected:** Do not treat this as equivalent to mandatory unpaid weekend work.
* **Dimension Scores:** Role (25/25), Comp & Cond (22/25), Loc (15/15), Exp (10/10), Scope (10/10), Company (8/10), App Effort (5/5).
* **Unknown States:** None.
* **Hard Filters Triggered:** `mandatory_weekends` (Erroneously)
* **Final Score:** 95/100
* **Final Verdict:** `skip` (Erroneously)
* **Rationale:** The data model only has a `weekend_required: boolean` field. It cannot distinguish between abusive unpaid weekends and occasional paid overtime.
* **Matches JOB_RULES.md?** **NO (FLAW).** The boolean flag is too blunt and will trigger false-positive hard rejections.

## 6. JUNIOR ROLE / GOOD OPPORTUNITY
**Scenario:** Junior or Mid-level role, $1,500–$2,000/month, Good working conditions, Strong product design responsibilities.
**Expected:** Do not automatically reject because of seniority.
* **Dimension Scores:** Role (25/25), Comp & Cond (18/25), Loc (15/15), Exp (6/10), Scope (10/10), Company (8/10), App Effort (5/5).
* **Unknown States:** None.
* **Hard Filters Triggered:** None.
* **Final Score:** ~87/100
* **Final Verdict:** `apply`
* **Rationale:** Slight penalty on experience match, but excellent scope and conditions keep it highly competitive.
* **Matches JOB_RULES.md?** YES.

## 7. US-ONLY ELIGIBILITY
**Scenario:** Excellent role and salary, explicitly requires US work authorization. No international contractor option.
**Expected:** Hard incompatibility.
* **Dimension Scores:** Role (25/25), Comp & Cond (25/25), Loc (0/15), Exp (10/10), Scope (10/10), Company (10/10), App Effort (5/5).
* **Unknown States:** None.
* **Hard Filters Triggered:** `us_w2_only`
* **Final Score:** 85/100
* **Final Verdict:** `skip`
* **Rationale:** Structurally blocked by residency rules.
* **Matches JOB_RULES.md?** YES.

## 8. MISSING SALARY
**Scenario:** Strong role fit, Remote LATAM, Salary not disclosed.
**Expected:** Do not invent a salary. Represent compensation as UNKNOWN and explain the uncertainty.
* **Dimension Scores:** Role (25/25), Comp & Cond (`null`/25), Loc (15/15), Exp (10/10), Scope (10/10), Company (8/10), App Effort (5/5).
* **Unknown States:** `salary` = `unknown`, `Comp & Cond` = `unknown`.
* **Hard Filters Triggered:** None.
* **Final Score:** 73/100 (Max possible: 75)
* **Final Verdict:** `review`
* **Rationale:** Score appears extremely low, but it's actually a perfect match missing 25 points of data.
* **Matches JOB_RULES.md?** **NO (FLAW).** Same normalization flaw as Case 3. A missing salary permanently handicaps the numeric score, burying a potentially great job at the bottom of the Radar.

## 9. MISSING WORKING HOURS
**Scenario:** Strong role, Good salary, Working hours not specified.
**Expected:** Do not assume 40 hours/week. Represent working-hours evidence as UNKNOWN.
* **Dimension Scores:** Role (25/25), Comp & Cond (`null`/25), Loc (15/15), Exp (10/10), Scope (10/10), Company (8/10), App Effort (5/5).
* **Unknown States:** `working_hours` = `unknown`.
* **Hard Filters Triggered:** None.
* **Final Score:** ~73/100
* **Final Verdict:** `review`
* **Rationale:** We cannot evaluate conditions without hours. 
* **Matches JOB_RULES.md?** **NO (FLAW).** Suffers the same 25-point null penalty flaw.

## 10. CONFLICTING EVIDENCE
**Scenario:** One source says remote LATAM. Another source says US-only.
**Expected:** Represent the conflict explicitly rather than silently selecting one value.
* **Dimension Scores:** Loc (7/15)
* **Unknown States:** None.
* **Hard Filters Triggered:** None.
* **Final Score:** ~80/100
* **Final Verdict:** `review`
* **Rationale:** The AI averages the difference.
* **Matches JOB_RULES.md?** **NO (FLAW).** The `Job` data model has no structured way to represent conflicting multi-source data. It forces the AI to pick one or average them, losing the explicit conflict state.

## 11. MULTI-SCOPE / UNDERPAID
**Scenario:** $600/month. Expected to design product UX/UI, code frontend, handle branding, marketing and social media.
**Expected:** Strong scope-quality penalty. Explain compensation does not reflect breadth.
* **Dimension Scores:** Role (10/25), Comp & Cond (5/25), Loc (15/15), Exp (10/10), Scope (1/10), Company (5/10), App Effort (5/5).
* **Unknown States:** None.
* **Hard Filters Triggered:** None.
* **Final Score:** ~51/100
* **Final Verdict:** `skip`
* **Rationale:** Severe scope creep mismatching Robert's specialized Product Design focus, compounded by low pay.
* **Matches JOB_RULES.md?** YES.

## 12. EXCELLENT COMPENSATION / EXTREME APPLICATION
**Scenario:** $3,500/month, excellent role fit, remote. 5 interview rounds + 8-hour unpaid take-home + multiple additional assignments.
**Expected:** Application Effort should significantly affect the evaluation. Do not treat as equivalent to low-friction.
* **Dimension Scores:** Role (25/25), Comp & Cond (25/25), Loc (15/15), Exp (10/10), Scope (10/10), Company (10/10), App Effort (0/5).
* **Unknown States:** None.
* **Hard Filters Triggered:** `unpaid_take_home_extreme`
* **Final Score:** 95/100
* **Final Verdict:** `skip`
* **Rationale:** The extreme friction correctly zeroes out the application score and triggers a hard rejection.
* **Matches JOB_RULES.md?** YES.

---

## Validation Summary

### Failures & Inconsistencies Discovered
1. **The Null Handicap (Cases 3, 8, 9):** The `calcScore` logic strictly sums values. If a 25-point dimension like Compensation is `null` (Unknown), the job's maximum score becomes 75/100. This is a severe false negative. Unknowns must be mathematically neutralized so they don't act as penalties.
2. **Boolean Weekend Rigidity (Case 5):** `working_hours.weekend_required: boolean` is too blunt. It triggers a hard rejection for occasional paid overtime.
3. **Multi-Source Conflict Blindness (Case 10):** The data model cannot formally declare "Source A contradicts Source B". It forces a merged state.

### Recommended Fixes (Do NOT implement until approved)
1. **Dynamic Score Normalization:** The total score must be prorated. `(Sum of Known Dimensions / Total Weight of Known Dimensions) * 100`. This ensures a job with unknown salary is scored out of 75 and normalized up to a 100-point scale, preventing false negatives.
2. **Nuanced Working Hours:** Upgrade `weekend_required` to an enum: `'no' | 'occasional_compensated' | 'frequent_uncompensated' | 'unknown'`.
3. **Conflict Object:** Add a `conflicts: { field: string, description: string }[]` array to the data model to explicitly highlight divergent source data to the user.
