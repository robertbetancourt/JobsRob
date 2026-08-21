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
import { classifyRole } from '../pipeline/classifier';
import { analyzeRoleSemantics } from '../pipeline/semanticClassifier';
import { Job } from '../types/job';

async function runValidation() {
  console.log('Fetching and normalizing jobs to test LLM Semantic Classifier...');
  
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
  
  // Find ambiguous jobs
  const ambiguousJobs = canonicalJobs.filter(j => classifyRole(j.title).requires_description_analysis);
  
  // Deterministic sorting to ensure consistent 20 jobs
  ambiguousJobs.sort((a, b) => a.title.localeCompare(b.title));
  
  const sampleSize = 20;
  const sample = ambiguousJobs.slice(0, sampleSize);
  
  console.log(`Found ${ambiguousJobs.length} ambiguous jobs. Sampling ${sampleSize} for LLM evaluation...`);
  
  const results = [];
  for (const job of sample) {
    console.log(`Analyzing: ${job.title}...`);
    const llmResult = await analyzeRoleSemantics(job);
    results.push({ job, llmResult });
    // Sleep briefly to avoid aggressive rate limits on dummy keys or basic tiers
    await new Promise(r => setTimeout(r, 500));
  }

  const markdown = `# LLM Ambiguous Role Classification Validation

## Evaluation Summary
- **Sample Size:** ${sample.length} jobs (deterministically selected from the "Ambiguous" queue)

## Results

${results.map(r => `### ${r.job.title} (${r.job.company_name})
- **Application URL:** [Link](${r.job.application_url})
- **Predicted Role Family:** \`${r.llmResult.family}\`
- **Compatibility:** \`${r.llmResult.compatibility}\`
- **Role Fit Score:** ${r.llmResult.role_fit !== null ? r.llmResult.role_fit : 'null'}
- **Confidence:** ${r.llmResult.confidence}
- **Evidence Extracted:**
> ${r.llmResult.evidence}

---
`).join('\n')}

`;

  fs.writeFileSync('C:/Users/Robert/OneDrive/Documentos/Proyects/JobsRob/ROLE_LLM_VALIDATION.md', markdown, 'utf8');
  console.log('Successfully generated ROLE_LLM_VALIDATION.md');
}

runValidation().catch(console.error);
