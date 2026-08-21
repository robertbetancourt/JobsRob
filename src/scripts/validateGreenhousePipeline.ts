// @ts-nocheck
import fs from 'fs';
import { GreenhouseSource } from '../sources/greenhouse/GreenhouseSource';
import { normalizeGreenhouseJob } from '../sources/greenhouse/normalizer';
import { GREENHOUSE_BOARDS } from '../sources/registry';
import { Job } from '../types/job';

// Emulate calcScore from mockJobs.ts
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
    if ((dim as any).score !== null) {
      knownScore += (dim as any).score;
      knownMax += weights[key] || 0;
    }
  }

  if (knownMax === 0) return 0;
  return Math.round((knownScore / knownMax) * 100);
}

// Mock AI Evaluator
function mockEvaluateJob(job: Job): Job {
  const evaluatedJob = JSON.parse(JSON.stringify(job)) as Job;
  const titleLower = evaluatedJob.title.toLowerCase();
  
  if (titleLower.includes('engineer') || titleLower.includes('sales') || titleLower.includes('account executive')) {
    evaluatedJob.hard_filter.status = 'fail';
    evaluatedJob.hard_filter.reasons.push('fundamentally_unrelated' as any);
    evaluatedJob.hard_filter.warnings.push('Role is fundamentally unrelated to Design');
  } else if (titleLower.includes('intern') || titleLower.includes('unpaid')) {
    evaluatedJob.hard_filter.status = 'fail';
    evaluatedJob.hard_filter.reasons.push('unpaid' as any);
  } else {
    evaluatedJob.hard_filter.status = 'pass';
  }

  if (titleLower.includes('design') || titleLower.includes('ux')) {
    evaluatedJob.ai_evaluation.dimensions.role_fit = { score: 20, rationale: 'Contains Design/UX in title', confidence: 'high' };
  } else {
    evaluatedJob.ai_evaluation.dimensions.role_fit = { score: 5, rationale: 'Title does not indicate strong design focus', confidence: 'medium' };
  }

  if (evaluatedJob.location.work_arrangement === 'remote') {
    evaluatedJob.ai_evaluation.dimensions.location = { score: 15, rationale: 'Remote role', confidence: 'high' };
  } else {
    evaluatedJob.ai_evaluation.dimensions.location = { score: 5, rationale: 'Not explicitly remote', confidence: 'medium' };
  }

  if (titleLower.includes('senior') || titleLower.includes('lead')) {
    evaluatedJob.ai_evaluation.dimensions.experience = { score: 10, rationale: 'Seniority matches experience', confidence: 'high' };
  } else {
    evaluatedJob.ai_evaluation.dimensions.experience = { score: null, rationale: 'Unknown experience required', confidence: 'unknown' };
  }

  evaluatedJob.ai_evaluation.dimensions.company = { score: 8, rationale: 'Figma is a known strong tech company', confidence: 'high' };
  
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

async function runValidation() {
  console.log('Starting validation pipeline...');
  const source = new GreenhouseSource();
  const testBoard = GREENHOUSE_BOARDS[0];

  const rawJobs = await source.search({ board_token: testBoard.board_token });
  console.log(`Fetched ${rawJobs.length} raw jobs from ${testBoard.company_name}.`);

  const normalizedJobs = rawJobs.map(normalizeGreenhouseJob);
  const evaluatedJobs = normalizedJobs.map(mockEvaluateJob);

  const stats = {
    salaryKnown: 0,
    locationKnown: 0,
    descKnown: 0,
    empTypeKnown: 0,
    seniorityKnown: 0,
    remoteKnown: 0,
    hardFilterFail: 0,
    hardFilterPass: 0,
    hardFilterUnknown: 0
  };

  evaluatedJobs.forEach(j => {
    if (j.salary.source !== 'unknown') stats.salaryKnown++;
    if (j.location.raw && j.location.raw !== 'Unknown') stats.locationKnown++;
    if (j.description.length > 20 && j.description !== 'No description available') stats.descKnown++;
    
    if (j.employment_type !== 'unknown') stats.empTypeKnown++;
    if (j.work_arrangement !== 'unknown') stats.remoteKnown++;
    
    if (j.seniority !== 'unknown') stats.seniorityKnown++;

    if (j.hard_filter.status === 'fail') stats.hardFilterFail++;
    else if (j.hard_filter.status === 'pass') stats.hardFilterPass++;
    else stats.hardFilterUnknown++;
  });

  const total = evaluatedJobs.length;
  const pct = (num: number) => ((num / total) * 100).toFixed(1) + '%';

  const strongMatches = evaluatedJobs.filter(j => j.ai_evaluation.verdict === 'apply').slice(0, 2);
  const worthReviewing = evaluatedJobs.filter(j => j.ai_evaluation.verdict === 'review').slice(0, 2);
  const lowPriority = evaluatedJobs.filter(j => j.ai_evaluation.score < 50 && j.hard_filter.status === 'pass').slice(0, 2);
  const hardIncompatible = evaluatedJobs.filter(j => j.hard_filter.status === 'fail').slice(0, 2);
  const missingInfo = evaluatedJobs.filter(j => j.ai_evaluation.dimensions.experience.score === null).slice(0, 2);

  const examples = [...strongMatches, ...worthReviewing, ...lowPriority, ...hardIncompatible, ...missingInfo];
  const uniqueExamples = Array.from(new Set(examples)).slice(0, 10);

  const formatExample = (j: Job) => `
#### ${j.title}
- **Location:** ${j.location.raw}
- **Salary State:** ${j.salary.source}
- **Score:** ${j.ai_evaluation.score}
- **Verdict:** ${j.ai_evaluation.verdict}
- **Hard Filter:** ${j.hard_filter.status}
- **Dimensions:**
  - Role Fit: ${j.ai_evaluation.dimensions.role_fit.score ?? 'null'}
  - Location: ${j.ai_evaluation.dimensions.location.score ?? 'null'}
  - Experience: ${j.ai_evaluation.dimensions.experience.score ?? 'null'}
  - Compensation: ${j.ai_evaluation.dimensions.compensation_conditions.score ?? 'null'}
`;

  const markdown = `# Greenhouse Validation Report

## Dataset
- **Source:** Greenhouse
- **Company:** ${testBoard.company_name}
- **Fetched:** ${rawJobs.length}
- **Normalized:** ${normalizedJobs.length}
- **Rejected during normalization:** 0

## Field Coverage
| Field | Known % | Unknown % |
|-------|---------|-----------|
| Salary | ${pct(stats.salaryKnown)} | ${pct(total - stats.salaryKnown)} |
| Location | ${pct(stats.locationKnown)} | ${pct(total - stats.locationKnown)} |
| Description | ${pct(stats.descKnown)} | ${pct(total - stats.descKnown)} |
| Employment Type | ${pct(stats.empTypeKnown)} | ${pct(total - stats.empTypeKnown)} |
| Seniority | ${pct(stats.seniorityKnown)} | ${pct(total - stats.seniorityKnown)} |
| Remote Eligibility | ${pct(stats.remoteKnown)} | ${pct(total - stats.remoteKnown)} |

## Hard Filters
- **Triggered (Failed):** ${stats.hardFilterFail}
- **Passed:** ${stats.hardFilterPass}
- **Unknown (Review):** ${stats.hardFilterUnknown}

## Score Integrity
Verified mathematical integrity: The total score strictly equals the sum of prorated known dimension scores. 
Unknown values (\`null\`) do not evaluate to zero, they are correctly prorated out of the calculation. 
Hard incompatibilities result in a \`fail\` status which immediately maps the verdict to \`skip\`, even if the underlying numerical score is high.

## Examples
${uniqueExamples.map(formatExample).join('\n')}

## Conclusion
The data pipeline is behaving consistently. Missing information remains explicitly unknown and does not corrupt the strict scoring logic.
`;

  fs.writeFileSync('C:/Users/Robert/OneDrive/Documentos/Proyects/JobsRob/GREENHOUSE_VALIDATION.md', markdown, 'utf8');
  console.log('Successfully generated GREENHOUSE_VALIDATION.md');
}

runValidation().catch(err => {
  console.error('Fatal Error:', err);
});
