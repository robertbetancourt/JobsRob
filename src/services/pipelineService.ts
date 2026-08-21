import { GreenhouseSource } from '../sources/greenhouse/GreenhouseSource';
import { LeverSource } from '../sources/lever/LeverSource';
import { AshbySource } from '../sources/ashby/AshbySource';
import { normalizeGreenhouseJob } from '../sources/greenhouse/normalizer';
import { normalizeLeverJob } from '../sources/lever/normalizer';
import { normalizeAshbyJob } from '../sources/ashby/normalizer';
import { GREENHOUSE_BOARDS, LEVER_BOARDS, ASHBY_BOARDS } from '../sources/registry';
import { deduplicateBatch } from '../pipeline/deduplicator';
import { JobRepository } from '../db/JobRepository';
import { Job, ScanStats } from '../types/job';
import { classifyRole } from '../pipeline/classifier';

function basicEvaluateJob(job: Job): Job {
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

export async function runFullPipelineScan(): Promise<ScanStats> {
  const greenhouse = new GreenhouseSource();
  const lever = new LeverSource();
  const ashby = new AshbySource();

  const allRawJobs: { sourceName: string, raw: any, company: string }[] = [];

  // Fetch Greenhouse
  for (const board of GREENHOUSE_BOARDS) {
    try {
      const raw = await greenhouse.search({ board_token: board.board_token });
      raw.forEach(r => allRawJobs.push({ sourceName: 'Greenhouse', raw: r, company: board.company_name }));
    } catch (e) {
      console.error(`Failed fetching Greenhouse board ${board.company_name}`, e);
    }
  }

  // Fetch Lever
  for (const board of LEVER_BOARDS) {
    try {
      const raw = await lever.search({ board_token: board.board_token });
      raw.forEach(r => allRawJobs.push({ sourceName: 'Lever', raw: r, company: board.company_name }));
    } catch (e) {
      console.error(`Failed fetching Lever board ${board.company_name}`, e);
    }
  }

  // Fetch Ashby
  for (const board of ASHBY_BOARDS) {
    try {
      const raw = await ashby.search({ board_token: board.board_token });
      raw.forEach(r => allRawJobs.push({ sourceName: 'Ashby', raw: r, company: board.company_name }));
    } catch (e) {
      console.error(`Failed fetching Ashby board ${board.company_name}`, e);
    }
  }

  // Normalize and initially evaluate
  const normalizedJobs: Job[] = allRawJobs.map(item => {
    let job: Job;
    if (item.sourceName === 'Greenhouse') {
      job = normalizeGreenhouseJob(item.raw as any);
    } else if (item.sourceName === 'Lever') {
      job = normalizeLeverJob(item.raw, item.company);
    } else {
      job = normalizeAshbyJob(item.raw, item.company);
    }
    const evaluated = basicEvaluateJob(job);
    evaluated.semantic_status = classifyRole(job.title).requires_description_analysis ? 'pending' : 'not_required';
    return evaluated;
  });

  // Load existing and deduplicate
  const existingJobs = await JobRepository.getAll();
  const deduplicatedJobs = deduplicateBatch(normalizedJobs, existingJobs);

  // Save to IndexedDB
  await JobRepository.saveMany(deduplicatedJobs);

  // Compile metrics
  let hardFiltered = 0;
  let aiRejected = 0;
  let strongMatches = 0;
  let worthReviewing = 0;

  for (const job of deduplicatedJobs) {
    if (job.hard_filter.status === 'fail') hardFiltered++;
    if (job.ai_evaluation.verdict === 'skip') aiRejected++;
    if (job.ai_evaluation.verdict === 'apply') strongMatches++;
    if (job.ai_evaluation.verdict === 'review') worthReviewing++;
  }

  return {
    total_scanned: normalizedJobs.length,
    new_opportunities: deduplicatedJobs.length,
    strong_matches: strongMatches,
    worth_reviewing: worthReviewing,
    skipped_automatically: hardFiltered + aiRejected,
    last_scan_at: new Date().toISOString()
  };
}
