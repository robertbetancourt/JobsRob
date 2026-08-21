import { Job } from '../types/job';

/**
 * Normalizes strings for comparison (lowercase, trims, removes punctuation)
 */
function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Compares two descriptions by checking the first N characters.
 * Useful for ATS posts that often share identical or highly similar copy.
 */
function isDescriptionSimilar(desc1: string, desc2: string, length = 150): boolean {
  if (!desc1 || !desc2) return false;
  const s1 = normalizeString(desc1).substring(0, length);
  const s2 = normalizeString(desc2).substring(0, length);
  if (s1.length < 50 || s2.length < 50) return false; // Too short to safely compare
  return s1 === s2 || s1.includes(s2) || s2.includes(s1);
}

/**
 * Determines if two jobs are a match.
 */
export function isDuplicate(job1: Job, job2: Job): boolean {
  // Tier 1: Strong Identifiers
  
  // Exact application URL match (if not null/empty and not generic)
  if (job1.application_url && job2.application_url && job1.application_url !== 'Unknown' && job2.application_url !== 'Unknown') {
    // Basic stripping of query params for ATS links
    const url1 = job1.application_url.split('?')[0].replace(/\/$/, '');
    const url2 = job2.application_url.split('?')[0].replace(/\/$/, '');
    if (url1 === url2) return true;
  }

  // Tier 2: Conservative Heuristics
  const comp1 = normalizeString(job1.company_name);
  const comp2 = normalizeString(job2.company_name);
  if (comp1 !== comp2) return false;

  const title1 = normalizeString(job1.title);
  const title2 = normalizeString(job2.title);
  if (title1 !== title2) return false;

  // Companies and Titles match. Now check work arrangement / location.
  if (job1.work_arrangement !== job2.work_arrangement && job1.work_arrangement !== 'unknown' && job2.work_arrangement !== 'unknown') {
    return false; // Different work arrangements means different reqs (e.g., one remote, one onsite)
  }

  // To be safe against identical titles for different reqs (e.g. "Software Engineer"), 
  // require description similarity.
  return isDescriptionSimilar(job1.description, job2.description);
}

/**
 * Merges a duplicate job into a primary job, preserving provenance and status.
 */
export function mergeJobs(primary: Job, duplicate: Job): Job {
  const merged = JSON.parse(JSON.stringify(primary)) as Job;

  // Merge sources
  const existingSourceIds = new Set(merged.sources.map(s => s.id));
  for (const src of duplicate.sources) {
    if (!existingSourceIds.has(src.id)) {
      merged.sources.push(src);
      existingSourceIds.add(src.id);
    }
  }

  // Update duplicate group
  const sourceNames = new Set(merged.sources.map(s => s.source_name));
  merged.duplicate_group = {
    is_canonical: true,
    duplicate_count: merged.sources.length,
    source_names: Array.from(sourceNames)
  };

  // Timestamps
  const pDisc = new Date(merged.discovered_at).getTime();
  const dDisc = new Date(duplicate.discovered_at).getTime();
  merged.discovered_at = pDisc < dDisc ? merged.discovered_at : duplicate.discovered_at;

  const pLast = new Date(merged.last_seen_at).getTime();
  const dLast = new Date(duplicate.last_seen_at).getTime();
  merged.last_seen_at = pLast > dLast ? merged.last_seen_at : duplicate.last_seen_at;

  // We preserve primary's `status` and `ai_evaluation`. 
  // (Assuming `primary` is the one that might already exist in DB and have user interaction).

  return merged;
}

/**
 * Deduplicates a list of new jobs against themselves and existing jobs in the DB.
 * Returns the final array of jobs to upsert.
 */
export function deduplicateBatch(newJobs: Job[], existingJobs: Job[] = []): Job[] {
  const toUpsert: Map<string, Job> = new Map(); // Key: canonical job ID
  
  // 1. Process against existing jobs first
  for (const newJob of newJobs) {
    let matchedExisting = false;
    for (const existing of existingJobs) {
      if (isDuplicate(existing, newJob)) {
        const merged = mergeJobs(existing, newJob);
        toUpsert.set(merged.id, merged);
        matchedExisting = true;
        break;
      }
    }
    
    if (!matchedExisting) {
      // 2. Process against other new jobs we're about to upsert
      let matchedInBatch = false;
      for (const [id, pendingJob] of toUpsert.entries()) {
        if (isDuplicate(pendingJob, newJob)) {
          const merged = mergeJobs(pendingJob, newJob);
          toUpsert.set(id, merged);
          matchedInBatch = true;
          break;
        }
      }

      if (!matchedInBatch) {
        // First time seeing this job, prepare duplicate group initialized
        if (!newJob.duplicate_group) {
          newJob.duplicate_group = {
            is_canonical: true,
            duplicate_count: newJob.sources.length,
            source_names: Array.from(new Set(newJob.sources.map(s => s.source_name)))
          };
        }
        toUpsert.set(newJob.id, newJob);
      }
    }
  }

  return Array.from(toUpsert.values());
}
