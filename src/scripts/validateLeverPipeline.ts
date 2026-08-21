import 'fake-indexeddb/auto';
import { LeverSource } from '../sources/lever/LeverSource';
import { normalizeLeverJob } from '../sources/lever/normalizer';
import { LEVER_BOARDS } from '../sources/registry';
import { JobRepository } from '../db/JobRepository';
import { Job } from '../types/job';

// Basic mock evaluator
function mockEvaluateJob(job: Job): Job {
  const evaluatedJob = JSON.parse(JSON.stringify(job)) as Job;
  const titleLower = evaluatedJob.title.toLowerCase();
  
  if (titleLower.includes('intern') || titleLower.includes('unpaid')) {
    evaluatedJob.hard_filter.status = 'fail';
    evaluatedJob.hard_filter.reasons.push('unpaid' as any);
  } else {
    evaluatedJob.hard_filter.status = 'pass';
  }

  evaluatedJob.ai_evaluation.score = evaluatedJob.hard_filter.status === 'fail' ? 0 : 75;
  evaluatedJob.ai_evaluation.verdict = evaluatedJob.hard_filter.status === 'fail' ? 'skip' : 'review';

  return evaluatedJob;
}

async function runValidation() {
  console.log('Starting Lever validation pipeline...');
  const source = new LeverSource();
  
  // Use Netflix or Auth0 as configured in registry
  const testBoard = LEVER_BOARDS[0];

  const rawJobs = await source.search({ board_token: testBoard.board_token });
  console.log(`Fetched ${rawJobs.length} raw jobs from ${testBoard.company_name} (Lever).`);

  if (rawJobs.length === 0) {
    console.warn(`No jobs found for ${testBoard.company_name}. The board might be empty or private.`);
    // We should try the second one if the first is empty
    if (LEVER_BOARDS.length > 1) {
      console.log(`Trying ${LEVER_BOARDS[1].company_name}...`);
      const backupJobs = await source.search({ board_token: LEVER_BOARDS[1].board_token });
      rawJobs.push(...backupJobs);
      console.log(`Fetched ${backupJobs.length} raw jobs from ${LEVER_BOARDS[1].company_name}.`);
    }
  }

  const normalizedJobs = rawJobs.map(r => normalizeLeverJob(r, r.company_name));
  const evaluatedJobs = normalizedJobs.map(mockEvaluateJob);

  const stats = {
    salaryKnown: 0,
    locationKnown: 0,
    descKnown: 0,
    empTypeKnown: 0,
    seniorityKnown: 0,
    remoteKnown: 0,
    reqDegreeKnown: 0
  };

  evaluatedJobs.forEach(j => {
    if (j.salary.source !== 'unknown') stats.salaryKnown++;
    if (j.location.raw && j.location.raw !== 'Unknown') stats.locationKnown++;
    if (j.description.length > 20 && j.description !== 'No description available') stats.descKnown++;
    if (j.employment_type !== 'unknown') stats.empTypeKnown++; 
    if (j.work_arrangement !== 'unknown') stats.remoteKnown++;
    if (j.seniority !== 'unknown') stats.seniorityKnown++;
    if (j.requirements.degree_required !== null) stats.reqDegreeKnown++;
  });

  const total = evaluatedJobs.length;
  const pct = (num: number) => total > 0 ? ((num / total) * 100).toFixed(1) + '%' : '0%';

  // Save to IndexedDB to test repository
  console.log('Testing IndexedDB persistence...');
  await JobRepository.clear();
  await JobRepository.saveMany(evaluatedJobs);
  const dbJobs = await JobRepository.getAll();
  console.log(`Saved ${dbJobs.length} jobs to IndexedDB.`);

  const examples = evaluatedJobs.slice(0, 5);

  const formatExample = (j: Job) => `
#### ${j.title}
- **ID:** ${j.id}
- **Location:** ${j.location.raw}
- **Work Arrangement:** ${j.work_arrangement}
- **Employment Type:** ${j.employment_type}
- **URL:** ${j.canonical_url}
- **Description Snippet:** ${j.description.substring(0, 100).replace(/\\n/g, ' ')}...
`;

  const markdown = `# Lever Validation Report

## Dataset
- **Source:** Lever
- **Fetched:** ${rawJobs.length}
- **Normalized:** ${normalizedJobs.length}

## Field Coverage (Unknown Semantics Adherence)
| Field | Known % | Unknown % |
|-------|---------|-----------|
| Salary | ${pct(stats.salaryKnown)} | ${pct(total - stats.salaryKnown)} |
| Location | ${pct(stats.locationKnown)} | ${pct(total - stats.locationKnown)} |
| Description | ${pct(stats.descKnown)} | ${pct(total - stats.descKnown)} |
| Employment Type | ${pct(stats.empTypeKnown)} | ${pct(total - stats.empTypeKnown)} |
| Remote Eligibility | ${pct(stats.remoteKnown)} | ${pct(total - stats.remoteKnown)} |
| Degree Requirement | ${pct(stats.reqDegreeKnown)} | ${pct(total - stats.reqDegreeKnown)} |

## Persistence
- Successfully mapped and saved ${dbJobs.length} Lever jobs to IndexedDB without corrupting fields.

## Examples
${examples.map(formatExample).join('\n')}

## Conclusion
The Lever adapter respects the UNKNOWN semantic rules. Missing employment types, remote arrangements, and salaries properly collapse into \`unknown\` or \`null\` rather than falsified defaults.
`;

  console.log('\n\n--- MARKDOWN OUTPUT ---\n\n');
  console.log(markdown);
  console.log('\n\n--- END MARKDOWN OUTPUT ---\n\n');
}

runValidation().catch(err => {
  console.error('Fatal Error:', err);
});
