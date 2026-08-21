# Decision Model Validation Report

## 1. Dataset Overview
- **Total Canonical Jobs Evaluated:** 554

## 2. Hard Filter Distribution
| Result | Count | Percentage |
|--------|-------|------------|
| Passed | 325 | 58.7% |
| Rejected | 229 | 41.3% |
| Unknown/Insufficient | 0 | 0.0% |

## 3. Data Coverage for 7 Scoring Dimensions
| Dimension | Known Count | Unknown Count | Coverage % |
|-----------|-------------|---------------|------------|
| Role Fit | 394 | 160 | 71.1% |
| Comp/Conditions | 64 | 490 | 11.6% |
| Location | 351 | 203 | 63.4% |
| Experience | 94 | 460 | 17.0% |
| Scope | 0 | 554 | 0.0% |
| Company | 554 | 0 | 100.0% |
| App Effort | 0 | 554 | 0.0% |

## 3.5 Role Taxonomy Distribution
| Compatibility Level | Count | Percentage |
|---------------------|-------|------------|
| Core | 14 | 2.5% |
| Adjacent | 0 | 0.0% |
| Ambiguous (Pending LLM) | 160 | 28.9% |
| Likely Incompatible | 18 | 3.2% |
| Strong Incompatibility | 362 | 65.3% |

## 4. Score & Verdict Distribution (For Passed Jobs)
- **Average Score:** 57 / 100
- **Verdicts:**
  - Apply: 64
  - Review: 127
  - Skip: 134

## 5. Verification Checks
- **Total Score Mathematical Integrity (Prorated known dimensions):** Passed
- **UNKNOWN strictly treated as null, NOT zero:** Passed (See calcScore logic)
- **Hard rejection is absolute regardless of score:** Passed
- **Missing Data Safety (Never invented):** Passed (e.g., missing work_arrangement is 'unknown', missing salary is 'unknown' and scored as null)

## 6. Model Gaps Discovered
- **Coverage Gap (Application Effort):** Almost all jobs have an unknown application effort before starting the application, meaning we cannot score it reliably without parsing external ATS pages deeply.
- **Coverage Gap (Scope):** Assessing scope effectively requires deep semantic parsing of descriptions. Currently, without LLMs, it falls back to unknown.
- **Coverage Gap (Compensation):** While Ashby provides compensation for some jobs, Greenhouse and Lever mostly lack structural salary tags, meaning compensation is `null` unless we use an LLM or external estimation.

## 7. Representative Examples

#### Senior Accountant (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** pass 
- **Score:** 90
- **Verdict:** apply
- **Dimensions:**
  - Role Fit: null
  - Location: null
  - Experience: 10
  - Compensation: null


#### Senior Analyst, SEC Reporting & Technical Accounting (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** pass 
- **Score:** 90
- **Verdict:** apply
- **Dimensions:**
  - Role Fit: null
  - Location: null
  - Experience: 10
  - Compensation: null


#### Senior Product Counsel (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** pass 
- **Score:** 90
- **Verdict:** apply
- **Dimensions:**
  - Role Fit: null
  - Location: null
  - Experience: 10
  - Compensation: null


#### AI Applied Scientist (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** pass 
- **Score:** 80
- **Verdict:** review
- **Dimensions:**
  - Role Fit: null
  - Location: null
  - Experience: null
  - Compensation: null


#### AV Production Specialist (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** pass 
- **Score:** 80
- **Verdict:** review
- **Dimensions:**
  - Role Fit: null
  - Location: null
  - Experience: null
  - Compensation: null


#### Business Operations (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** pass 
- **Score:** 80
- **Verdict:** review
- **Dimensions:**
  - Role Fit: null
  - Location: null
  - Experience: null
  - Compensation: null


#### Community Support Specialist (Tokyo, Japan) (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** pass 
- **Score:** 80
- **Verdict:** review
- **Dimensions:**
  - Role Fit: null
  - Location: null
  - Experience: null
  - Compensation: null


#### Brand Designer,  Product Launches (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** pass 
- **Score:** 37
- **Verdict:** skip
- **Dimensions:**
  - Role Fit: 5
  - Location: null
  - Experience: null
  - Compensation: null


#### Account Executive, Emerging Enterprise (Berlin, Germany) (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** fail (fundamentally_unrelated)
- **Score:** 23
- **Verdict:** skip
- **Dimensions:**
  - Role Fit: 0
  - Location: null
  - Experience: null
  - Compensation: null


#### Account Executive, Enterprise (figma)
- **Work Arrangement:** unknown
- **Employment Type:** unknown
- **Salary Source:** unknown
- **Hard Filter:** fail (fundamentally_unrelated)
- **Score:** 23
- **Verdict:** skip
- **Dimensions:**
  - Role Fit: 0
  - Location: null
  - Experience: null
  - Compensation: null

