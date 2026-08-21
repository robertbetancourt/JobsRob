import { Job, Source } from '../../types/job';
import { RawJob } from '../../types/source';

export function normalizeLeverJob(raw: RawJob, companyName: string): Job {
  const p = raw.raw_payload;

  let locationRaw = 'Unknown';
  if (p.categories && p.categories.location) {
    locationRaw = p.categories.location;
  }

  // Work Arrangement Inference
  let workArrangement: Job['work_arrangement'] = 'unknown';
  if (p.workplaceType) {
    const wt = p.workplaceType.toLowerCase();
    if (wt.includes('remote') || wt.includes('distributed')) workArrangement = 'remote';
    else if (wt.includes('hybrid')) workArrangement = 'hybrid';
    else if (wt.includes('onsite') || wt.includes('in-office')) workArrangement = 'onsite';
  } else {
    // Basic fallback from location text if explicit
    const locLower = locationRaw.toLowerCase();
    if (locLower.includes('remote') || locLower.includes('anywhere')) {
      workArrangement = 'remote';
    }
  }

  // Employment Type Inference
  let employmentType: Job['employment_type'] = 'unknown';
  if (p.categories && p.categories.commitment) {
    const cmt = p.categories.commitment.toLowerCase();
    if (cmt.includes('full') && cmt.includes('time')) employmentType = 'full_time';
    else if (cmt.includes('contract')) employmentType = 'contract';
    else if (cmt.includes('freelance')) employmentType = 'freelance';
    else if (cmt.includes('part') && cmt.includes('time')) employmentType = 'part_time';
  }

  // Assemble full description from descriptionPlain and lists
  let fullDescription = p.descriptionPlain || p.description || '';
  if (p.lists && Array.isArray(p.lists)) {
    p.lists.forEach((list: any) => {
      if (list.text) fullDescription += `\n\n### ${list.text}\n`;
      if (list.content) {
        // Content might be HTML lists or plain text
        // If it's HTML, we'll just keep it as is, or strip tags if we only want plain text.
        // For simplicity and to avoid stripping valid text, we'll concatenate it.
        fullDescription += list.content;
      }
    });
  }

  if (!fullDescription.trim()) {
    fullDescription = 'No description available';
  }

  const sourceRecord: Source = {
    id: raw.external_id,
    source_name: raw.source_name,
    source_type: raw.source_type,
    source_url: raw.source_url,
    application_url: raw.source_url,
    discovered_at: raw.fetched_at
  };

  return {
    id: `lever-${raw.external_id}`,
    title: raw.title,
    company_id: `comp-${companyName.toLowerCase().replace(/\\W+/g, '-')}`,
    company_name: companyName,
    company_industry: null,
    description: fullDescription,
    location: {
      raw: locationRaw,
      country: null,
      region: null,
      city: null,
      work_arrangement: workArrangement,
      timezone_requirements: [],
      residency_required: null,
      work_authorization_required: null,
      relocation_available: null
    },
    work_arrangement: workArrangement,
    employment_type: employmentType,
    seniority: 'unknown',
    salary: {
      min: null,
      max: null,
      currency: 'USD',
      period: 'unknown',
      raw: 'Unknown',
      source: 'unknown',
      confidence: 'unknown'
    },
    working_hours: {
      hours_per_day: null,
      hours_per_week: null,
      schedule: null,
      timezone: null,
      weekend_required: 'unknown',
      after_hours_expected: null,
      on_call: null,
      notes: null
    },
    experience_required: 'unknown',
    requirements: {
      years_experience: { min: null, max: null },
      degree_required: null,
      skills: [],
      languages: [],
      work_authorization: [],
      other: []
    },
    application_requirements: {
      application_url: raw.source_url,
      ats: 'Lever',
      estimated_effort: 'unknown',
      estimated_minutes: null,
      cover_letter_required: null,
      portfolio_required: null,
      references_required: null,
      questions_count: 0,
      take_home: {
        required: null,
        compensated: 'unknown'
      },
      video_required: null
    },
    hard_filter: {
      status: 'review',
      reasons: [],
      warnings: []
    },
    ai_evaluation: {
      score: 0,
      verdict: 'review',
      dimensions: {
        role_fit: { score: null, rationale: '', confidence: 'unknown' },
        compensation_conditions: { score: null, rationale: '', confidence: 'unknown' },
        location: { score: null, rationale: '', confidence: 'unknown' },
        experience: { score: null, rationale: '', confidence: 'unknown' },
        scope: { score: null, rationale: '', confidence: 'unknown' },
        company: { score: null, rationale: '', confidence: 'unknown' },
        application_effort: { score: null, rationale: '', confidence: 'unknown' }
      },
      why_it_matches: [],
      concerns: [],
      evaluated_at: raw.fetched_at
    },
    sources: [sourceRecord],
    canonical_url: raw.source_url,
    application_url: raw.source_url,
    posted_at: raw.source_updated_at || raw.fetched_at,
    discovered_at: raw.fetched_at,
    last_seen_at: raw.fetched_at,
    status: 'new'
  };
}
