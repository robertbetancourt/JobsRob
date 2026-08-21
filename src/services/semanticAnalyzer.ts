import { Job } from '../types/job';
import { JobRepository } from '../db/JobRepository';

const OLLAMA_URL = 'http://127.0.0.1:11434/api/chat';
const OLLAMA_MODEL = 'qwen3:8b';

const SYSTEM_PROMPT = `You are a semantic classifier for an AI job matching engine.
Your task is to analyze ambiguous job descriptions and categorize them into strict domain families based ONLY on the provided rules.

<rules>
1. If the job is "Product Manager" or "Product Owner", classify it as "Product Management".
2. If the job is "Design Engineer", "UX Engineer", or involves writing UI code (React, HTML/CSS), classify it as "Engineering / UI Development".
3. If the primary role is a designer working on design systems, classify as "Design Systems".
4. If it does not fit any design, UX, or engineering category perfectly, classify it as "Unrelated Domains".
</rules>

Return ONLY a JSON object:
{
  "family": "string",
  "compatibility": "core" | "adjacent" | "ambiguous" | "likely_incompatible" | "strong_incompatibility",
  "role_fit": number | null,
  "confidence": "high" | "medium" | "low"
}`;

export async function analyzeJobWithOllama(job: Job): Promise<void> {
  const userPrompt = `Job Title: ${job.title}\nJob Description: ${job.description.substring(0, 3000)}`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        format: 'json',
        options: {
          temperature: 0.0,
          num_ctx: 2048,
          keep_alive: '10m'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama HTTP error: ${response.status}`);
    }

    const data = await response.json();
    let result;
    try {
      result = JSON.parse(data.message.content.trim());
    } catch {
      result = data.message.content;
    }

    if (typeof result === 'string') {
        result = JSON.parse(result);
    }

    const INCOMPATIBLE_OVERRIDE: Record<string, { compatibility: string; role_fit: number }> = {
      'Unrelated Domains': { compatibility: 'strong_incompatibility', role_fit: 0 },
      'Engineering': { compatibility: 'strong_incompatibility', role_fit: 0 },
      'Engineering / UI Development': { compatibility: 'strong_incompatibility', role_fit: 0 },
      'Product Management': { compatibility: 'likely_incompatible', role_fit: 5 },
    };

    let { family, role_fit, confidence } = result;

    if (INCOMPATIBLE_OVERRIDE[family]) {
      
      role_fit = INCOMPATIBLE_OVERRIDE[family].role_fit;
    }

    const updatedJob: Job = {
      ...job,
      semantic_status: 'completed',
      ai_evaluation: {
        ...job.ai_evaluation,
        verdict: role_fit !== null && role_fit >= 70 ? 'apply' : 'skip',
        dimensions: {
          ...job.ai_evaluation.dimensions,
          role_fit: {
            score: role_fit,
            confidence: confidence || 'medium',
            rationale: `Semantically classified as ${family}`
          }
        }
      }
    };

    await JobRepository.save(updatedJob);
  } catch (error) {
    console.error(`Failed to analyze job ${job.id}:`, error);
    await JobRepository.save({
      ...job,
      semantic_status: 'failed'
    });
  }
}
