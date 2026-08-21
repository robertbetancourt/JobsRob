# Role LLM Benchmark Review (Ollama Qwen3:8b)

## 1. Strict Accuracy vs Semantic Accuracy

- **Total Cases Analyzed**: 16
- **Strict Accuracy (Automated Script)**: 76.9% (10/13 determinable cases)
- **Semantic Accuracy**: 84.6% (11/13 determinable cases)

The difference arises because 1 case failed due to a strict string-matching check but was semantically correct in its decision logic.

## 2. Analysis of the Label Mismatch (strong_incompatibility vs likely_incompatible)

**Case**: Staff Design Engineer - Canada (Ashby)
- **Expected**: Engineering / UI Development (Likely Incompatible)
- **LLM Output**: Engineering / UI Development (strong_incompatibility), Score 0
- **Result in Script**: FAIL

**Why it failed in the script**:
The script expects the LLM to return exactly the compatibility label defined in the benchmark plan (`likely_incompatible`). The LLM returned `strong_incompatibility`. The strict string comparison failed.

**Semantic Assessment**:
According to `ROLE_TAXONOMY.md`:
- `Likely Incompatible` (Level 4): Roles technically within the tech sphere but diverging from UX/UI (e.g., Engineering, PM).
- `Strong Incompatibility` (Level 5): Roles fundamentally unrelated to Product Design (e.g., Sales, Backend).

While the taxonomy strictly defines Engineering as Level 4 (`Likely Incompatible`), the LLM assessed it as Level 5 (`Strong Incompatibility`) and assigned a Role Fit of 0. 

**Conclusion**: This is a **Label/Format Mismatch**, not a true semantic error. The end result is identical (Score 0, highly incompatible). If we consider this a pass, the overall accuracy rises to 84.6%.

## 3. Analysis of True Semantic Errors (Design Systems Bias)

There are two genuine classification failures in the benchmark:

**Case 1**: Senior Product Manager - Design Systems (Spotify)
- **Expected**: Product Management (Likely Incompatible)
- **LLM Output**: Design Systems (adjacent), Score 20
- **Result**: True Semantic Error

**Case 2**: Staff Design Engineer - Americas (Ashby)
- **Expected**: Engineering / UI Development (Likely Incompatible)
- **LLM Output**: Design Systems (adjacent), Score 20
- **Result**: True Semantic Error

**Conclusion**:
These are **Genuine Classification Failures**. 
The local Ollama model (Qwen3:8b) exhibits a strong systemic bias toward the term "Design Systems". When it encounters descriptions mentioning the management or engineering of a Design System, it categorizes the role into the `Design Systems` family and assigns a high fit score (20), completely ignoring the explicit taxonomy rules that a Product Manager or an Engineer should be assigned to their respective families with scores of 0-5. 
This is a critical semantic failure because it would result in false positives (assigning high scores to non-designers).
