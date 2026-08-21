import { Job } from '../types/job';
import { generateStructuredAnalysis } from '../ai/llm';
import { RoleClassification } from './classifier';

export interface LLMRoleClassification extends RoleClassification {
  confidence: string;
  evidence: string;
}

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

export async function analyzeRoleSemantics(job: Job): Promise<LLMRoleClassification> {
  const userPrompt = `Job Title: ${job.title}\n\nJob Description:\n${job.description.substring(0, 4000)}`;

  try {
    const result = await generateStructuredAnalysis(SYSTEM_PROMPT, userPrompt);
    
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
    // Fallback to unknown if API fails
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
