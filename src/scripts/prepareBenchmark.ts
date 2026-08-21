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

async function main() {
  console.log('Fetching and normalizing jobs to build benchmark...');
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

  const normalizedJobs = allRawJobs.map(item => {
    if (item.sourceName === 'Greenhouse') return normalizeGreenhouseJob(item.raw as any);
    if (item.sourceName === 'Lever') return normalizeLeverJob(item.raw, item.company);
    return normalizeAshbyJob(item.raw, item.company);
  });

  const canonicalJobs = deduplicateBatch(normalizedJobs, []);
  
  const ambiguous = [];
  const deterministic = [];
  
  for (const job of canonicalJobs) {
    const classification = classifyRole(job.title);
    if (classification.requires_description_analysis) {
      ambiguous.push({ job, classification });
    } else {
      deterministic.push({ job, classification });
    }
  }

  const categories = [
    { name: "Clear Product Design", pattern: /^product designer(\s*,\s*.*)?$/i, required: 3, expected: 'Product Design (Core)' },
    { name: "Product Design Leadership", pattern: /head of product design|director of product design|vp of product design/i, required: 2, expected: 'Design Leadership & Management (Ambiguous / Requires Description Analysis)' },
    { name: "Product Manager - Design Systems", pattern: /product manager.*design system/i, required: 1, expected: 'Product Management (Likely Incompatible)' },
    { name: "Design Systems Designer", pattern: /design system.*designer/i, required: 2, expected: 'Design Systems (Core / Adjacent)' },
    { name: "Design Systems Manager", pattern: /design system.*manager/i, required: 1, expected: 'Design Leadership & Management (Ambiguous / Requires Description Analysis)' },
    { name: "Design Engineer", pattern: /design engineer/i, required: 2, expected: 'Engineering / UI Development (Likely Incompatible)' },
    { name: "UX Engineer", pattern: /ux engineer/i, required: 2, expected: 'Engineering / UI Development (Likely Incompatible)' },
    { name: "UX Researcher", pattern: /ux researcher/i, required: 2, expected: 'UX Research (Likely Incompatible)' },
    { name: "Visual Designer", pattern: /visual designer/i, required: 2, expected: 'Visual & Brand Design (Adjacent / Likely Incompatible)' },
    { name: "Brand Designer", pattern: /brand designer/i, required: 2, expected: 'Visual & Brand Design (Adjacent / Likely Incompatible)' },
    { name: "Product Experience Designer", pattern: /product experience designer/i, required: 1, expected: 'Product Design (Core)' },
    { name: "Creative Technologist", pattern: /creative technologist/i, required: 1, expected: 'Engineering / UI Development (Ambiguous)' },
    { name: "Obvious non-design roles", pattern: /account executive|software engineering|software engineer|sales/i, required: 4, expected: 'Unrelated Domains (Strong Incompatibility)' },
    { name: "Genuinely ambiguous roles", pattern: /product strategist|product operations|customer success|creative director|design lead/i, required: 3, expected: 'Ambiguous / Requires Description Analysis' },
  ];

  const benchmarkJobs = [];
  const usedTitles = new Set();

  for (const cat of categories) {
    let foundCount = 0;
    for (const item of canonicalJobs) {
      if (foundCount >= cat.required) break;
      if (!usedTitles.has(item.title) && cat.pattern.test(item.title)) {
         benchmarkJobs.push({ category: cat.name, expected: cat.expected, title: item.title, company: item.company_name, url: item.application_url });
         usedTitles.add(item.title);
         foundCount++;
      }
    }
  }

  let md = `# Benchmark Evaluation Set\n\n`;
  md += `## Overall Statistics\n`;
  md += `- Total Canonical Jobs: ${canonicalJobs.length}\n`;
  md += `- Confidently classified deterministically: ${deterministic.length}\n`;
  md += `- Ambiguous (likely to require semantic analysis): ${ambiguous.length}\n\n`;
  
  md += `## Benchmark Jobs (${benchmarkJobs.length} cases)\n\n`;
  benchmarkJobs.forEach((b, i) => {
    md += `### ${i+1}. ${b.title} (${b.company})\n`;
    md += `- **Benchmark Category**: ${b.category}\n`;
    md += `- **Expected Taxonomy**: ${b.expected}\n`;
    md += `- **Application URL**: [Link](${b.url})\n\n`;
  });

  fs.writeFileSync('C:/Users/Robert/OneDrive/Documentos/Proyects/JobsRob/BENCHMARK_PLAN.md', md, 'utf8');
  console.log('Generated BENCHMARK_PLAN.md');
}

main().catch(console.error);
