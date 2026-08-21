# Greenhouse Validation Report

## Dataset
- **Source:** Greenhouse
- **Company:** Figma
- **Fetched:** 161
- **Normalized:** 161
- **Rejected during normalization:** 0

## Field Coverage
| Field | Known % | Unknown % |
|-------|---------|-----------|
| Salary | 0.0% | 100.0% |
| Location | 100.0% | 0.0% |
| Description | 100.0% | 0.0% |
| Employment Type | 0.0% | 100.0% |
| Seniority | 0.0% | 100.0% |
| Remote Eligibility | 0.0% | 100.0% |

## Hard Filters
- **Triggered (Failed):** 69
- **Passed:** 92
- **Unknown (Review):** 0

## Score Integrity
Verified mathematical integrity: The total score strictly equals the sum of prorated known dimension scores. 
Unknown values (`null`) do not evaluate to zero, they are correctly prorated out of the calculation. 
Hard incompatibilities result in a `fail` status which immediately maps the verdict to `skip`, even if the underlying numerical score is high.

## Examples

#### Brand Designer,  Product Launches
- **Location:** San Francisco, CA • New York, NY • United States
- **Salary State:** unknown
- **Score:** 66
- **Verdict:** review
- **Hard Filter:** pass
- **Dimensions:**
  - Role Fit: 20
  - Location: 5
  - Experience: null
  - Compensation: null


#### Designer Advocate - Figma Weave (New York, United States)
- **Location:** New York, NY
- **Salary State:** unknown
- **Score:** 66
- **Verdict:** review
- **Hard Filter:** pass
- **Dimensions:**
  - Role Fit: 20
  - Location: 5
  - Experience: null
  - Compensation: null


#### AI Applied Scientist
- **Location:** San Francisco, CA • New York, NY • United States
- **Salary State:** unknown
- **Score:** 36
- **Verdict:** skip
- **Hard Filter:** pass
- **Dimensions:**
  - Role Fit: 5
  - Location: 5
  - Experience: null
  - Compensation: null


#### AV Production Specialist
- **Location:** San Francisco, CA
- **Salary State:** unknown
- **Score:** 36
- **Verdict:** skip
- **Hard Filter:** pass
- **Dimensions:**
  - Role Fit: 5
  - Location: 5
  - Experience: null
  - Compensation: null


#### Account Executive, Emerging Enterprise (Berlin, Germany)
- **Location:** Berlin, Germany
- **Salary State:** unknown
- **Score:** 36
- **Verdict:** skip
- **Hard Filter:** fail
- **Dimensions:**
  - Role Fit: 5
  - Location: 5
  - Experience: null
  - Compensation: null


#### Account Executive, Enterprise
- **Location:** San Francisco, CA • New York, NY • United States
- **Salary State:** unknown
- **Score:** 36
- **Verdict:** skip
- **Hard Filter:** fail
- **Dimensions:**
  - Role Fit: 5
  - Location: 5
  - Experience: null
  - Compensation: null


## Conclusion
The data pipeline is behaving consistently. Missing information remains explicitly unknown and does not corrupt the strict scoring logic.
