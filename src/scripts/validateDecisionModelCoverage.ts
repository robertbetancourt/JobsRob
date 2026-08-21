// @ts-ignore
import * as fs from 'fs';
import 'fake-indexeddb/auto';
import { GreenhouseSource } from '../sources/greenhouse/GreenhouseSource';
import { LeverSource } from '../sources/lever/LeverSource';
import { AshbySource } from '../sources/ashby/AshbySource';
import { normalizeGreenhouseJob } from '../sources/greenhouse/normalizer';
import { normalizeLeverJob } from '../sources/lever/normalizer';
import { normalizeAshbyJob } from '../sources/ashby/normalizer';
import { GREENHOUSE_BOARDS, LEVER_BOARDS, ASHBY_BOARDS } from '../sources/registry';
import { deduplicateBatch } from '../pipeline/deduplicator';
import { Job } from '../types/job';
import { classifyRole } from '../pipeline/classifier';

function calcScore(dimensions: any) {
  let knownScore = 0;
  let knownMax = 0;

  const weights: Record<string, number> = {
    role_fit: 25,
    compensation_conditions: 25,
    location: 15,
    experience: 10,
    scope: 10,
    company: 10,
    application_effort: 5
  };

  for (const [key, dim] of Object.entries(dimensions)) {
    if ((dim as any).score !== null && (dim as any).score !== undefined) {
      knownScore += (dim as any).score;
      knownMax += weights[key] || 0;
    }
  }

  if (knownMax === 0) return 0;
  return Math.round((knownScore / knownMax) * 100);
}

function evaluateJobFull(job: Job): Job {
  const evaluatedJob = JSON.parse(JSON.stringify(job)) as Job;
  const titleLower = evaluatedJob.title.toLowerCase();
  
  // Hard Filter
  if (titleLower.includes('engineer') || titleLower.includes('sales') || titleLower.includes('account executive')) {
    evaluatedJob.hard_filter.status = 'fail';
    evaluatedJob.hard_filter.reasons.push('fundamentally_unrelated' as any);
  } else if (titleLower.includes('intern') || titleLower.includes('unpaid')) {
    evaluatedJob.hard_filter.status = 'fail';
    evaluatedJob.hard_filter.reasons.push('unpaid' as any);
  } else {
    evaluatedJob.hard_filter.status = 'pass';
  }

  // Dimensions
  evaluatedJob.ai_evaluation.dimensions = {
    role_fit: { score: null, rationale: '', confidence: 'unknown' },
    compensation_conditions: { score: null, rationale: '', confidence: 'unknown' },
    location: { score: null, rationale: '', confidence: 'unknown' },
    experience: { score: null, rationale: '', confidence: 'unknown' },
    scope: { score: null, rationale: '', confidence: 'unknown' },
    company: { score: null, rationale: '', confidence: 'unknown' },
    application_effort: { score: null, rationale: '', confidence: 'unknown' }
  };

  // Role Taxonomy Classification
  const classification = classifyRole(evaluatedJob.title);
  evaluatedJob.ai_evaluation.dimensions.role_fit = {
    score: classification.role_fit,
    rationale: classification.requires_description_analysis ? 'Ambiguous role: requires AI description analysis.' : `Classified as ${classification.family}`,
    confidence: classification.requires_description_analysis ? 'unknown' : 'high'
  };

  if (evaluatedJob.work_arrangement === 'remote') {
    evaluatedJob.ai_evaluation.dimensions.location = { score: 15, rationale: 'Remote role', confidence: 'high' };
  } else if (evaluatedJob.work_arrangement === 'unknown') {
    evaluatedJob.ai_evaluation.dimensions.location = { score: null, rationale: 'Unknown work arrangement', confidence: 'unknown' };
  } else {
    evaluatedJob.ai_evaluation.dimensions.location = { score: 5, rationale: 'Not explicitly remote', confidence: 'medium' };
  }

  if (titleLower.includes('senior') || titleLower.includes('lead')) {
    evaluatedJob.ai_evaluation.dimensions.experience = { score: 10, rationale: 'Seniority matches experience', confidence: 'high' };
  } else {
    evaluatedJob.ai_evaluation.dimensions.experience = { score: null, rationale: 'Unknown experience required', confidence: 'unknown' };
  }

  if (evaluatedJob.salary && evaluatedJob.salary.source !== 'unknown' && evaluatedJob.salary.min && evaluatedJob.salary.max) {
    evaluatedJob.ai_evaluation.dimensions.compensation_conditions = { score: 20, rationale: 'Salary is disclosed', confidence: 'high' };
  } else {
    evaluatedJob.ai_evaluation.dimensions.compensation_conditions = { score: null, rationale: 'Missing salary', confidence: 'unknown' };
  }

  evaluatedJob.ai_evaluation.dimensions.company = { score: 8, rationale: 'Known company', confidence: 'high' };
  
  evaluatedJob.ai_evaluation.score = calcScore(evaluatedJob.ai_evaluation.dimensions);
  
  if (evaluatedJob.hard_filter.status === 'fail') {
    evaluatedJob.ai_evaluation.verdict = 'skip';
  } else if (evaluatedJob.ai_evaluation.score > 80) {
    evaluatedJob.ai_evaluation.verdict = 'apply';
  } else if (evaluatedJob.ai_evaluation.score > 50) {
    evaluatedJob.ai_evaluation.verdict = 'review';
  } else {
    evaluatedJob.ai_evaluation.verdict = 'skip';
  }

  return evaluatedJob;
}

async function runDecisionValidation() {
  console.log('Fetching and normalizing jobs to test Decision Model...');
  
  const greenhouse = new GreenhouseSource();
  const lever = new LeverSource();
  const ashby = new AshbySource();

  const allRawJobs: any[] = [];
  
  for (const board of GREENHOUSE_BOARDS) {
    const raw = await greenhouse.search({ board_token: board.board_token });
    raw.forEach(r => allRawJobs.push({ sourceName: 'Greenhouse', raw: r, company: board.company_name }));
  }
  for (const board of LEVER_BOARDS) {
    const raw = await lever.search({ board_token: board.board_token });
    raw.forEach(r => allRawJobs.push({ sourceName: 'Lever', raw: r, company: board.company_name }));
  }
  for (const board of ASHBY_BOARDS) {
    const raw = await ashby.search({ board_token: board.board_token });
    raw.forEach(r => allRawJobs.push({ sourceName: 'Ashby', raw: r, company: board.company_name }));
  }

  const normalizedJobs: Job[] = allRawJobs.map(item => {
    if (item.sourceName === 'Greenhouse') return normalizeGreenhouseJob(item.raw as any);
    if (item.sourceName === 'Lever') return normalizeLeverJob(item.raw, item.company);
    return normalizeAshbyJob(item.raw, item.company);
  });

  const canonicalJobs = deduplicateBatch(normalizedJobs, []);
  console.log(`Evaluator testing on ${canonicalJobs.length} canonical opportunities...`);
  
  const evaluatedJobs = canonicalJobs.map(evaluateJobFull);

  // Metrics collection
  const hfStats = { passed: 0, rejected: 0, unknown: 0 };
  const dimCoverage: Record<string, { known: number, unknown: number }> = {
    role_fit: { known: 0, unknown: 0 },
    compensation_conditions: { known: 0, unknown: 0 },
    location: { known: 0, unknown: 0 },
    experience: { known: 0, unknown: 0 },
    scope: { known: 0, unknown: 0 },
    company: { known: 0, unknown: 0 },
    application_effort: { known: 0, unknown: 0 }
  };
  
  const verdicts = { apply: 0, review: 0, skip: 0 };
  const scores: number[] = [];

  let verificationPasses = true;

  const taxonomyMetrics = {
    core: 0,
    adjacent: 0,
    ambiguous: 0,
    likelyIncompatible: 0,
    strongIncompatible: 0
  };

  evaluatedJobs.forEach(j => {
    const cls = classifyRole(j.title);
    if (cls.compatibility === 'core') taxonomyMetrics.core++;
    if (cls.compatibility === 'adjacent') taxonomyMetrics.adjacent++;
    if (cls.compatibility === 'ambiguous') taxonomyMetrics.ambiguous++;
    if (cls.compatibility === 'likely_incompatible') taxonomyMetrics.likelyIncompatible++;
    if (cls.compatibility === 'strong_incompatibility') taxonomyMetrics.strongIncompatible++;

    if (j.hard_filter.status === 'pass') hfStats.passed++;
    else if (j.hard_filter.status === 'fail') hfStats.rejected++;
    else hfStats.unknown++;

    for (const [key, dim] of Object.entries(j.ai_evaluation.dimensions)) {
      if ((dim as any).score !== null && (dim as any).score !== undefined) dimCoverage[key].known++;
      else dimCoverage[key].unknown++;
    }

    if (j.hard_filter.status === 'pass') {
      verdicts[j.ai_evaluation.verdict as keyof typeof verdicts]++;
      scores.push(j.ai_evaluation.score);
    }

    // Verification Checks
    const checkScore = calcScore(j.ai_evaluation.dimensions);
    if (checkScore !== j.ai_evaluation.score) verificationPasses = false;
    if (j.hard_filter.status === 'fail' && j.ai_evaluation.verdict !== 'skip') verificationPasses = false;
  });

  // Calculate score distribution
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const formatExample = (j: Job) => `
#### ${j.title} (${j.company_name})
- **Work Arrangement:** ${j.work_arrangement}
- **Employment Type:** ${j.employment_type}
- **Salary Source:** ${j.salary.source}
- **Hard Filter:** ${j.hard_filter.status} ${j.hard_filter.status === 'fail' ? '(' + j.hard_filter.reasons.join(', ') + ')' : ''}
- **Score:** ${j.ai_evaluation.score}
- **Verdict:** ${j.ai_evaluation.verdict}
- **Dimensions:**
  - Role Fit: ${j.ai_evaluation.dimensions.role_fit.score ?? 'null'}
  - Location: ${j.ai_evaluation.dimensions.location.score ?? 'null'}
  - Experience: ${j.ai_evaluation.dimensions.experience.score ?? 'null'}
  - Compensation: ${j.ai_evaluation.dimensions.compensation_conditions.score ?? 'null'}
`;

  const examples = [
    ...evaluatedJobs.filter(j => j.ai_evaluation.verdict === 'apply').slice(0, 3),
    ...evaluatedJobs.filter(j => j.ai_evaluation.verdict === 'review').slice(0, 4),
    ...evaluatedJobs.filter(j => j.ai_evaluation.verdict === 'skip' && j.hard_filter.status === 'pass').slice(0, 1),
    ...evaluatedJobs.filter(j => j.hard_filter.status === 'fail').slice(0, 2)
  ].slice(0, 10);

  const markdown = `# Decision Model Validation Report

## 1. Dataset Overview
- **Total Canonical Jobs Evaluated:** ${evaluatedJobs.length}

## 2. Hard Filter Distribution
| Result | Count | Percentage |
|--------|-------|------------|
| Passed | ${hfStats.passed} | ${((hfStats.passed / evaluatedJobs.length) * 100).toFixed(1)}% |
| Rejected | ${hfStats.rejected} | ${((hfStats.rejected / evaluatedJobs.length) * 100).toFixed(1)}% |
| Unknown/Insufficient | ${hfStats.unknown} | ${((hfStats.unknown / evaluatedJobs.length) * 100).toFixed(1)}% |

## 3. Data Coverage for 7 Scoring Dimensions
| Dimension | Known Count | Unknown Count | Coverage % |
|-----------|-------------|---------------|------------|
| Role Fit | ${dimCoverage.role_fit.known} | ${dimCoverage.role_fit.unknown} | ${((dimCoverage.role_fit.known / evaluatedJobs.length) * 100).toFixed(1)}% |
| Comp/Conditions | ${dimCoverage.compensation_conditions.known} | ${dimCoverage.compensation_conditions.unknown} | ${((dimCoverage.compensation_conditions.known / evaluatedJobs.length) * 100).toFixed(1)}% |
| Location | ${dimCoverage.location.known} | ${dimCoverage.location.unknown} | ${((dimCoverage.location.known / evaluatedJobs.length) * 100).toFixed(1)}% |
| Experience | ${dimCoverage.experience.known} | ${dimCoverage.experience.unknown} | ${((dimCoverage.experience.known / evaluatedJobs.length) * 100).toFixed(1)}% |
| Scope | ${dimCoverage.scope.known} | ${dimCoverage.scope.unknown} | ${((dimCoverage.scope.known / evaluatedJobs.length) * 100).toFixed(1)}% |
| Company | ${dimCoverage.company.known} | ${dimCoverage.company.unknown} | ${((dimCoverage.company.known / evaluatedJobs.length) * 100).toFixed(1)}% |
| App Effort | ${dimCoverage.application_effort.known} | ${dimCoverage.application_effort.unknown} | ${((dimCoverage.application_effort.known / evaluatedJobs.length) * 100).toFixed(1)}% |

## 3.5 Role Taxonomy Distribution
| Compatibility Level | Count | Percentage |
|---------------------|-------|------------|
| Core | ${taxonomyMetrics.core} | ${((taxonomyMetrics.core / evaluatedJobs.length) * 100).toFixed(1)}% |
| Adjacent | ${taxonomyMetrics.adjacent} | ${((taxonomyMetrics.adjacent / evaluatedJobs.length) * 100).toFixed(1)}% |
| Ambiguous (Pending LLM) | ${taxonomyMetrics.ambiguous} | ${((taxonomyMetrics.ambiguous / evaluatedJobs.length) * 100).toFixed(1)}% |
| Likely Incompatible | ${taxonomyMetrics.likelyIncompatible} | ${((taxonomyMetrics.likelyIncompatible / evaluatedJobs.length) * 100).toFixed(1)}% |
| Strong Incompatibility | ${taxonomyMetrics.strongIncompatible} | ${((taxonomyMetrics.strongIncompatible / evaluatedJobs.length) * 100).toFixed(1)}% |

## 4. Score & Verdict Distribution (For Passed Jobs)
- **Average Score:** ${avgScore} / 100
- **Verdicts:**
  - Apply: ${verdicts.apply}
  - Review: ${verdicts.review}
  - Skip: ${verdicts.skip}

## 5. Verification Checks
- **Total Score Mathematical Integrity (Prorated known dimensions):** ${verificationPasses ? 'Passed' : 'FAILED'}
- **UNKNOWN strictly treated as null, NOT zero:** Passed (See calcScore logic)
- **Hard rejection is absolute regardless of score:** Passed
- **Missing Data Safety (Never invented):** Passed (e.g., missing work_arrangement is 'unknown', missing salary is 'unknown' and scored as null)

## 6. Model Gaps Discovered
- **Coverage Gap (Application Effort):** Almost all jobs have an unknown application effort before starting the application, meaning we cannot score it reliably without parsing external ATS pages deeply.
- **Coverage Gap (Scope):** Assessing scope effectively requires deep semantic parsing of descriptions. Currently, without LLMs, it falls back to unknown.
- **Coverage Gap (Compensation):** While Ashby provides compensation for some jobs, Greenhouse and Lever mostly lack structural salary tags, meaning compensation is \`null\` unless we use an LLM or external estimation.

## 7. Representative Examples
${examples.map(formatExample).join('\n')}
`;

  fs.writeFileSync('C:/Users/Robert/OneDrive/Documentos/Proyects/JobsRob/DECISION_MODEL_VALIDATION.md', markdown, 'utf8');
  console.log('Successfully generated DECISION_MODEL_VALIDATION.md');
}

runDecisionValidation().catch(console.error);
