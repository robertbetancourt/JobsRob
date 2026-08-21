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

const INCOMPATIBLE_OVERRIDE: Record<string, { fit: number, comp: any }> = {
  "Product Management": { fit: 5, comp: "likely_incompatible" },
  "Engineering / UI Development": { fit: 0, comp: "strong_incompatibility" },
  "UX Research": { fit: 5, comp: "likely_incompatible" },
  "Unrelated Domains": { fit: 0, comp: "strong_incompatibility" }
};

async function analyzeWithOllama(systemPrompt: string, userPrompt: string): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 600000);
    
    try {
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
                    temperature: 0.0,
                    num_ctx: 2048,
                    
                },
                keep_alive: "10m"
            }),
            signal: controller.signal as any
        });
        
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Ollama Error: ${response.status} ${await response.text()}`);
        }
        
        const data = await response.json();
        return JSON.parse(data.message.content);
    } catch(err) {
        clearTimeout(timeout);
        throw err;
    }
}

async function analyzeRoleSemanticsOllama(job: any) {
  const userPrompt = `Job Title: ${job.title}\n\nJob Description:\n${job.description.substring(0, 4000)}`;

  for(let attempt=1; attempt<=3; attempt++) {
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
        console.error(`LLM Analysis failed for job: ${job.title} (Attempt ${attempt}/3)`, error);
        if (attempt === 3) return null;
        await new Promise(r => setTimeout(r, 2000));
      }
  }
}

async function main() {
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
  
  const ambiguousJobs = [];
  for(const job of canonicalJobs) {
      if (!job.title || typeof job.title !== 'string') continue; // Skip malformed jobs
      
      const cls = classifyRole(job.title);
      if (cls.requires_description_analysis) {
          ambiguousJobs.push(job);
      }
  }

  console.log(`Found ${ambiguousJobs.length} ambiguous jobs out of ${canonicalJobs.length} total.`);

  let md = `# Ambiguous Roles Analysis (Ollama Qwen3:8b)\n\n`;
  let results: any[] = [];
  let familyCounts: any = {};
  let compatibilityCounts: any = {
      'core': 0, 'adjacent': 0, 'likely_incompatible': 0, 'strong_incompatibility': 0, 'ambiguous': 0
  };

  // Process in chunks of 3 for bounded concurrency
  const CHUNK_SIZE = 3;
  for (let i = 0; i < ambiguousJobs.length; i += CHUNK_SIZE) {
      const chunk = ambiguousJobs.slice(i, i + CHUNK_SIZE);
      const chunkPromises = chunk.map(async (job, idx) => {
          console.log(`Analyzing [${i + idx + 1}/${ambiguousJobs.length}]: ${job.title} (${(job as any).company || 'Unknown'})`);
          const llmResult = await analyzeRoleSemanticsOllama(job);
          return { job, llmResult };
      });
      
      const chunkResults = await Promise.all(chunkPromises);
      
      for (const res of chunkResults) {
          if (!res.llmResult) {
              console.log('Skipping due to permanent failure.');
              continue;
          }

          results.push({ job: res.job, result: res.llmResult });
          
          familyCounts[res.llmResult.family] = (familyCounts[res.llmResult.family] || 0) + 1;
          if (compatibilityCounts[res.llmResult.compatibility] !== undefined) {
             compatibilityCounts[res.llmResult.compatibility]++;
          } else {
             compatibilityCounts[res.llmResult.compatibility] = 1;
          }
      }
  }

  md += `## Classification Distribution\n`;
  const sortedFamilies = Object.keys(familyCounts).sort((a,b) => familyCounts[b] - familyCounts[a]);
  for(const f of sortedFamilies) {
      md += `- **${f}**: ${familyCounts[f]}\n`;
  }
  
  md += `\n## Compatibility Summary\n`;
  for(const c in compatibilityCounts) {
      md += `- **${c}**: ${compatibilityCounts[c]}\n`;
  }

  md += `\n## Recurring Patterns & Unexpected Cases\n`;
  md += `- *(Analysis deferred to review phase)*\n`;

  md += `\n## Processed Cases\n`;
  for(const r of results) {
     md += `### ${r.job.title} (${(r.job as any).company || 'Unknown'})\n`;
     md += `- **URL**: [Link](${r.job.application_url})\n`;
     md += `- **Family**: ${r.result.family}\n`;
     md += `- **Compatibility**: ${r.result.compatibility}\n`;
     md += `- **Role Fit**: ${r.result.role_fit}\n`;
     md += `- **Confidence**: ${r.result.confidence}\n`;
     md += `- **Evidence**: ${r.result.evidence}\n\n`;
  }

  fs.writeFileSync('C:/Users/Robert/OneDrive/Documentos/Proyects/JobsRob/AMBIGUOUS_ROLES_ANALYSIS.md', md, 'utf8');
  console.log('Finished analysis. Saved to AMBIGUOUS_ROLES_ANALYSIS.md');
}
main().catch(console.error);
