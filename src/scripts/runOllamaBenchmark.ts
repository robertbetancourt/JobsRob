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

const SYSTEM_PROMPT = `You are an expert technical recruiter and UX/UI hiring manager.
Your job is to read a job title and description, and classify the role into one of the following Role Families from our taxonomy:

1. "Product Design"
2. "UX / UI Design"
3. "Design Systems"
4. "Design Leadership & Management"
5. "Visual & Brand Design"
6. "UX Research"
7. "Engineering / UI Development"
8. "Product Management"
9. "Unrelated Domains"
10. "Unknown"

# Taxonomy Rules & Fit Scores
- "Product Design" (core): Score 20-25. End-to-end UX/UI for digital products.
- "UX / UI Design" (core/adjacent): Score 15-25. Focused strictly on journeys, wireframing, or high-fidelity UI.
- "Design Systems" (core/adjacent): Score 15-25. Building component libraries (e.g. in Figma).
- "Design Leadership & Management": Score 10-20. Evaluate IC vs Management ratio.
- "Visual & Brand Design" (adjacent/incompatible): Score 5-15. Marketing, graphic design, branding.
- "UX Research" (likely incompatible): Score 5. Pure research/testing.
- "Engineering / UI Development" (incompatible): Score 0-5. Writing code (e.g. React, frontend). 
- "Product Management" (incompatible): Score 0-5. PMs, roadmap owners.
- "Unrelated Domains" (incompatible): Score 0. Sales, operations, HR, backend, etc.

# Compatibility Labels
Must be exactly one of: "core", "adjacent", "ambiguous", "likely_incompatible", "strong_incompatibility"

# Output Format
Return ONLY valid JSON matching this schema:
{
  "role_family": "string (from the list above)",
  "compatibility": "string (from labels above)",
  "role_fit": number (0-25, or null if absolutely impossible to tell),
  "confidence": "high" | "medium" | "low",
  "evidence": "Short factual rationale extracted from the job description"
}

# CRITICAL RULES - STRICT PRIORITIES
1. PRODUCT MANAGER = PRODUCT MANAGEMENT: If the role title is "Product Manager", "PM", or focuses on roadmaps and business viability, it MUST be classified as "Product Management", even if they manage a "Design System". Never classify a PM as Design Systems.
2. ENGINEERING = ENGINEERING: If the title is "Design Engineer", "UX Engineer", or involves writing production code (React, etc.), it MUST be classified as "Engineering / UI Development". Do not classify engineers as Design Systems, even if they code UI components.
3. DESIGN SYSTEMS DESIGNER: Only classify as "Design Systems" if the primary role is a UX/UI designer designing component libraries.
4. DO NOT invent salary, location, or other job info. ONLY classify the role based on responsibilities and scope.
`;

async function analyzeWithOllama(systemPrompt: string, userPrompt: string): Promise<any> {
    const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'qwen3:8b',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            stream: false,
            format: 'json',
            options: {
                temperature: 0.0
            }
        })
    });
    
    if (!response.ok) {
        throw new Error(`Ollama Error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return JSON.parse(data.message.content);
}

const INCOMPATIBLE_OVERRIDE: Record<string, { fit: number, comp: any }> = {
  'Product Management': { fit: 5, comp: 'likely_incompatible' },
  'Engineering / UI Development': { fit: 0, comp: 'strong_incompatibility' },
  'UX Research': { fit: 5, comp: 'likely_incompatible' },
  'Unrelated Domains': { fit: 0, comp: 'strong_incompatibility' }
};
async function analyzeRoleSemanticsOllama(job: any) {
  const userPrompt = `Job Title: ${job.title}\n\nJob Description:\n${job.description.substring(0, 4000)}`;

  try {
    const result = await analyzeWithOllama(SYSTEM_PROMPT, userPrompt);
    
    const override = INCOMPATIBLE_OVERRIDE[result.role_family];
    return {
      family: result.role_family,
      compatibility: override ? override.comp : (result.compatibility as any),
      role_fit: override ? override.fit : result.role_fit,
      requires_description_analysis: false,
      confidence: result.confidence,
      evidence: result.evidence
    };
  } catch (error) {
    console.error(`LLM Analysis failed for job: ${job.title}`, error);
    return {
      family: 'Unknown (LLM Failed)',
      compatibility: 'ambiguous',
      role_fit: null,
      requires_description_analysis: true,
      confidence: 'low',
      evidence: String(error)
    };
  }
}

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
  
  let md = `# Role LLM Benchmark Results (Ollama Qwen3:8b)\n\n`;
  let passCount = 0;
  let ambiguousPass = 0;
  let totalAmbiguous = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  for (const b of benchmarks) {
     if (!b.job) continue;
     console.log(`Analyzing: ${b.job.title}`);
     
     const llmResult = await analyzeRoleSemanticsOllama(b.job);
     
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
                  // Fallback for LLMs omitting underscores or matching partial strings
                  if (llmResult.compatibility && (llmResult.compatibility.includes(ec) || ec.includes(llmResult.compatibility))) {
                     passed = true;
                     break;
                  }
                  
                  // Allow strong_incompatibility and likely_incompatible to be interchangeable if the fit score is <= 5
                  if ((ec === 'likely_incompatible' || ec === 'strong_incompatibility') &&
                      (llmResult.compatibility === 'likely_incompatible' || llmResult.compatibility === 'strong_incompatibility') &&
                      llmResult.role_fit !== null && llmResult.role_fit <= 5) {
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
         } else if (llmResult.compatibility && llmResult.compatibility.includes('incompatible') && expectedFamily === 'Product Design') {
             falseNegatives++;
         }
     } else if (!b.expected.includes("Ambiguous / Requires Description Analysis")) {
         passCount++;
     }

     md += `### ${b.title}\n`;
     md += `- **Expected Taxonomy**: ${b.expected}\n`;
     md += `- **Gemini Taxonomy**: ${llmResult.family} (Ollama)\n`;
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
