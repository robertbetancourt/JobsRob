import { GreenhouseSource } from '../sources/greenhouse/GreenhouseSource';
import { normalizeGreenhouseJob } from '../sources/greenhouse/normalizer';
import { GREENHOUSE_BOARDS } from '../sources/registry';

async function main() {
  console.log('Testing Greenhouse Source Integration...\n');

  const source = new GreenhouseSource();
  const testBoard = GREENHOUSE_BOARDS[0];

  console.log(`Fetching jobs for ${testBoard.company_name} (${testBoard.board_token})...`);

  const rawJobs = await source.search({ board_token: testBoard.board_token });

  console.log(`\nFetched ${rawJobs.length} raw jobs.\n`);

  if (rawJobs.length === 0) {
    console.log('No jobs found. The board might be empty or the token might be invalid.');
    return;
  }

  // Normalize all
  const normalizedJobs = rawJobs.map(normalizeGreenhouseJob);

  // Print a summary of the first 5
  console.log('--- Summary of First 5 Jobs ---\n');
  normalizedJobs.slice(0, 5).forEach((job, idx) => {
    const raw = rawJobs[idx];
    console.log(`[${idx + 1}] External ID: ${raw.external_id}`);
    console.log(`    Title: ${job.title}`);
    console.log(`    Company: ${job.company_name}`);
    console.log(`    Location: ${job.location.raw}`);
    console.log(`    URL: ${job.canonical_url}`);
    console.log(`    Description Exists: ${job.description.length > 50 ? 'Yes (' + job.description.substring(0, 30) + '...)' : 'No/Too short'}`);
    console.log(`    Compensation Known: ${job.salary.source !== 'unknown' ? 'Yes' : 'No'}`);
    console.log(`    Fetched At: ${raw.fetched_at}`);
    console.log(`    Source Updated At: ${raw.source_updated_at || 'Unknown'}`);
    console.log('');
  });

  // Example of Normalized Output
  console.log('--- Example Normalized Job (JSON) ---');
  console.log(JSON.stringify(normalizedJobs[0], null, 2));
}

main().catch(err => {
  console.error('Fatal Error:', err);
});
