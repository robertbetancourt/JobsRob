# JobsRob Decision Model

## 1. Purpose
JobsRob is a personal decision engine for Robert Betancourt. It answers the question: "Is this a good opportunity FOR ROBERT?", not "Is this a generally good job?". The model evaluates job opportunities against Robert's profile (Product Designer, ~5 YOE, based in Venezuela), prioritizing the balance of compensation, working conditions, and application effort over prestige or generic ranking metrics.

## 2. Evaluation Pipeline
1. **Source Deduplication:** Group identical roles across different platforms into a single canonical opportunity.
2. **Hard Filtering:** Immediately flag or remove jobs that are fundamentally incompatible based on strict, precise criteria.
3. **AI Opportunity Scoring:** Evaluate the surviving jobs on a 100-point scale across weighted dimensions.
4. **Decision Threshold Categorization:** Map the numeric score to actionable human-readable verdicts.
5. **Human Review:** Robert's ultimate decision (Apply, Save, Skip) overrides any AI score.

## 3. Precision in Hard Compatibility Rules (Hard Reject vs. Negative Signal)
Conditions must be explicitly categorized. Do not treat merely undesirable traits as hard rejects.

**HARD INCOMPATIBILITY (Immediate Reject):**
- **Unpaid / Speculative:** 100% equity-only (unless explicitly allowed by project rules), unpaid internships, commission-only.
- **Explicit Extreme Hours:** Mandatory 12–14h/day expectations explicitly stated.
- **Explicit Constant Availability:** Mandatory 7-day availability or severe 24/7 on-call expectations.
- **Impossible Authorization:** Explicit restriction to US W-2, requiring US security clearance, or residency in a country where Robert cannot legally work without unavailable sponsorship.
- **Unpaid Production Work:** Explicit requirement to design real, production-ready screens for the company's product for free.

**STRONG NEGATIVE SIGNAL (Heavy Penalty, Not a Hard Reject):**
- Demanding or "hustle" culture without explicit mandatory hours.
- Highly diluted scope (e.g., Design + Dev + Marketing) without matching compensation.
- Occasional weekend work (if not properly compensated or unreasonable).

**UNKNOWN / REVIEW (Confidence Reduction, Not a Penalty):**
- Unknown working hours.
- Unknown salary.
- Unclear remote status.

## 4. Scoring Dimensions & Weighting
The 100-point system evaluates:
- **Role & Domain Fit:** 25%
- **Compensation & Conditions:** 25%
- **Location & Work Eligibility:** 15%
- **Experience & Seniority Match:** 10%
- **Scope & Responsibility Quality:** 10%
- **Company / Opportunity Quality:** 10%
- **Application Effort:** 5%

*Total Weights = 100%*

## 5. Scoring Methodology for Each Dimension
- **Role & Domain Fit (0-25 pts):** Strong alignment with Product Design, UX/UI, and domains like Fintech, Neobanks, Crypto, or B2B SaaS.
- **Compensation & Conditions (0-25 pts):** Evaluated jointly. There is NO rigid salary floor. See Section 6 for the detailed framework.
- **Location & Work Eligibility (0-15 pts):** High score for explicitly remote/LATAM-friendly or international contractor setups.
- **Experience & Seniority Match (0-10 pts):** Evaluated by actual scope, NOT just title. Junior, Mid, and Senior titles are perfectly acceptable if the responsibilities, compensation, and conditions are strong. Do not penalize a "Junior" title.
- **Scope & Responsibility Quality (0-10 pts):** High points for end-to-end design and clear responsibilities. Lower points for excessive scope creep ("wear every hat" for no extra pay).
- **Company / Opportunity Quality (0-10 pts):** Does NOT reward prestige or famous brand names. High points are awarded for legitimacy, seriousness of the hiring process, clarity of the job description, product quality, business credibility, and potential for meaningful experience. Unknown companies can score perfectly here.
- **Application Effort (0-5 pts):** Evaluated contextually. See Section 7 for the detailed framework.

## 6. Compensation & Conditions Model
Salary is NOT a hidden hard floor. It is evaluated strictly in relation to working hours, schedule, weekends, on-call expectations, flexibility, responsibilities, and contract type.

- **~$2,000–$2,500+ USD/month** is highly attractive.
- **~$1,000/month** is a meaningful general reference.
- **Sub-$1,000/month** can still be acceptable if conditions are substantially better (e.g., high flexibility, low hours).

**Realistic Evaluation Examples:**
- **A:** $600/mo + 35–40h + remote + reasonable scope + no weekends = **Viable but modest** (Moderate score).
- **B:** $600/mo + 60h+ + weekends + constant availability = **Incompatible** (Severe penalty or Hard Reject).
- **C:** $1,200/mo + 40h + remote + good conditions = **Viable / Moderate** (Good score).
- **D:** $2,500/mo + 40h + remote + good conditions = **Excellent** (Maximum score).
- **E:** $4,500/mo + 65h + weekends + on-call = **Severely Problematic** (Compensation is excellent, but conditions drag the overall dimension score down significantly).

## 7. Contextual Application Effort Model
Application effort is evaluated relative to the opportunity's quality. A high-effort application is not automatically a zero; it depends on whether the effort makes the opportunity irrational to pursue.
- **Low Effort (Resume + Portfolio):** Positive signal.
- **Medium Effort (Questions, Cover Letter):** Neutral signal.
- **High Effort (3-4 hour challenge) + Excellent Opportunity:** Significant cost, but potentially still worth applying (e.g., 2-3 pts).
- **High Effort (4-hour challenge) + Weak Opportunity + Thousands of Applicants:** Strongly negative. Irrationally expensive pursuit (0 pts).

## 8. Missing Data Handling (Unknown ≠ Bad)
Never treat missing information as evidence of a bad condition. 
- Unknown salary ≠ Low salary.
- Unknown hours ≠ Extreme hours.

**Implementation:**
- Do not penalize the numeric score for missing data.
- Reduce the **Confidence Level** (High -> Medium -> Low).
- Explicitly flag the missing information in the **Concerns/Review** section so Robert can investigate.

## 9. Decision Thresholds
- **85–100 = Strong Match:** Excellent balance of compensation, conditions, and effort.
- **70–84 = Good Match:** Solid opportunity, minor concessions.
- **55–69 = Review:** Average fit, or high uncertainty (missing crucial data) that requires manual inspection.
- **40–54 = Low Priority:** Significant mismatches in compensation vs. effort, or poor scope.
- **0–39 = Skip:** Technically passes hard filters but is a poor use of time.

## 10. Explanation Format (Why?)
Every evaluation must avoid being a black box.
- **Score:** 84/100
- **Confidence:** High / Medium / Low
- **Verdict:** Good Match
- **Why:**
  + Strong Product Design alignment
  + Remote/LATAM compatible
  + Strong compensation relative to the 40h/wk expectation
  + Responsibilities match actual experience level despite "Junior" title
- **Concerns:**
  − Application requires a 3-hour challenge
  − Company information is limited (Unknown size)
- **Compensation Assessment:** Sentences explaining the rating relative to hours.
- **Location Assessment:** Sentences explaining work arrangement compatibility.
- **Recommended Projects:** Contextual portfolio mapping (e.g., "B89", "Banexcoin").
