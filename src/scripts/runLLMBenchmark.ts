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
import { analyzeRoleSemantics } from '../pipeline/semanticClassifier';

async function main() {
  const planLines = fs.readFileSync('C:/Users/Robert/OneDrive/Documentos/Proyects/JobsRob/BENCHMARK_PLAN.md', 'utf8').split('\n');
  
  const benchmarks: any[] = [];
  let current: any = {};
  
  for (const line of planLines) {
    if (line.startsWith('### ')) {
       if (current.title) benchmarks.push(current);
       current = { title: line.replace(/### \d+\.\s*/, '').trim() };
    } else if (line.startsWith('- **Expected Taxonomy**:')) {
       current.expected = line.replace('- **Expected Taxonomy**:', '').trim();
    } else if (line.startsWith('- **Application URL**:')) {
       const urlMatch = line.match(/\[Link\]\((.*?)\)/);
       if (urlMatch) current.url = urlMatch[1];
    }
  }
  if (current.title) benchmarks.push(current);

  console.log(`Loaded ${benchmarks.length} benchmarks from plan.`);

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
  
  for (const b of benchmarks) {
    const matched = canonicalJobs.find(j => j.application_url === b.url);
    if (!matched) {
      console.error(`Could not find canonical job for ${b.url}`);
    } else {
      b.job = matched;
    }
  }
  
  let md = `# Role LLM Benchmark Results\n\n`;
  let passCount = 0;
  let ambiguousPass = 0;
  let totalAmbiguous = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  for (const b of benchmarks) {
     if (!b.job) continue;
     console.log(`Analyzing: ${b.job.title}`);
     
     const start = Date.now();
     const llmResult = await analyzeRoleSemantics(b.job);
     const elapsed = Date.now() - start;
     
     if (elapsed < 4500) await new Promise(r => setTimeout(r, 4500 - elapsed));
     
     let expectedFamily = b.expected.split('(')[0].trim();
     let expectedCompats = b.expected.split('(')[1]?.replace(')', '').toLowerCase().split('/').map((s:any) => s.trim().replace(' ', '_'));
     
     if (expectedCompats && expectedCompats.includes('requires_description_analysis')) {
        expectedCompats.push('ambiguous');
     }
     
     let passed = false;
     
     // Check if it's an ambiguous resolution expectation
     if (b.expected.includes("Ambiguous / Requires Description Analysis")) {
         totalAmbiguous++;
         // If it's ambiguous, we just want to see if the LLM successfully classified it into any real family
         if (llmResult.family !== 'Unknown' && llmResult.family !== 'Unknown (LLM Failed)') {
             passed = true;
             ambiguousPass++;
         }
     } else {
         if (llmResult.family === expectedFamily) {
            if (!expectedCompats) {
               passed = true;
            } else {
               for (const ec of expectedCompats) {
                  if (llmResult.compatibility.includes(ec) || ec.includes(llmResult.compatibility)) {
                     passed = true;
                     break;
                  }
               }
            }
         }
     }
     
     if (!passed) {
         if (llmResult.compatibility === 'core' && expectedFamily !== 'Product Design') {
             falsePositives++;
         } else if (llmResult.compatibility.includes('incompatible') && expectedFamily === 'Product Design') {
             falseNegatives++;
         }
     } else if (!b.expected.includes("Ambiguous / Requires Description Analysis")) {
         passCount++;
     }

     md += `### ${b.title}\n`;
     md += `- **Expected Taxonomy**: ${b.expected}\n`;
     md += `- **Gemini Taxonomy**: ${llmResult.family}\n`;
     md += `- **Compatibility**: ${llmResult.compatibility}\n`;
     md += `- **Role Fit**: ${llmResult.role_fit}\n`;
     md += `- **Confidence**: ${llmResult.confidence}\n`;
     md += `- **Evidence**: ${llmResult.evidence}\n`;
     md += `- **PASS / FAIL**: ${passed ? 'PASS ✅' : 'FAIL ❌'}\n\n`;
  }
  
  let totalCases = benchmarks.filter(b=>b.job).length;
  let nonAmbiguousCases = totalCases - totalAmbiguous;
  let systematicProblems = [];
  if (falsePositives > 0) systematicProblems.push("LLM tends to assign 'core' compatibility to non-core design roles (False Positives).");
  if (falseNegatives > 0) systematicProblems.push("LLM tends to assign 'incompatible' to legitimate core design roles (False Negatives).");
  if (passCount < nonAmbiguousCases) systematicProblems.push("LLM sometimes fails exact string-matching with taxonomy family labels.");
  if (systematicProblems.length === 0) systematicProblems.push("None detected.");

  md += `## Summary Statistics\n`;
  md += `- **Total Cases Analyzed**: ${totalCases}\n`;
  md += `- **Total Accuracy (Strict)**: ${((passCount) / nonAmbiguousCases * 100).toFixed(1)}% (${passCount}/${nonAmbiguousCases})\n`;
  md += `- **Ambiguous-Case Resolution Success**: ${totalAmbiguous > 0 ? (ambiguousPass / totalAmbiguous * 100).toFixed(1) + '%' : 'N/A'} (${ambiguousPass}/${totalAmbiguous})\n`;
  md += `- **False Positives**: ${falsePositives}\n`;
  md += `- **False Negatives**: ${falseNegatives}\n`;
  md += `- **Systematic Classification Problems**: \n`;
  systematicProblems.forEach(sp => {
    md += `   - ${sp}\n`;
  });

  fs.writeFileSync('C:/Users/Robert/OneDrive/Documentos/Proyects/JobsRob/ROLE_LLM_BENCHMARK.md', md, 'utf8');
  console.log('Finished. Wrote ROLE_LLM_BENCHMARK.md');
}

main().catch(console.error);
