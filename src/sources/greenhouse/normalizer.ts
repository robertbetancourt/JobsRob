import { Job, Source } from '../../types/job';
import { RawJob } from '../../types/source';

export function normalizeGreenhouseJob(raw: RawJob): Job {
  const p = raw.raw_payload;

  // Extract location from office and location fields
  let locationRaw = 'Unknown';
  if (p.location && p.location.name) {
    locationRaw = p.location.name;
  }
  const offices = p.offices || [];
  if (offices.length > 0 && locationRaw === 'Unknown') {
    locationRaw = offices.map((o: any) => o.name).join(', ');
  }

  // Very rudimentary heuristics for remote/work arrangement (can be improved later)
  let workArrangement: Job['work_arrangement'] = 'unknown';
  const locLower = locationRaw.toLowerCase();
  if (locLower.includes('remote') || locLower.includes('anywhere')) {
    workArrangement = 'remote';
  } else if (locLower.includes('hybrid')) {
    workArrangement = 'hybrid';
  }

  // Fallback description
  const description = p.content || (p.data_compliance && p.data_compliance[0] ? p.data_compliance[0].description : '') || 'No description available';

  const sourceRecord: Source = {
    id: raw.external_id,
    source_name: raw.source_name,
    source_type: raw.source_type,
    source_url: raw.source_url,
    application_url: raw.source_url,
    discovered_at: raw.fetched_at
  };

  return {
    id: `gh-${raw.external_id}`,
    title: raw.title,
    company_id: `comp-${raw.company_name.toLowerCase().replace(/\W+/g, '-')}`,
    company_name: raw.company_name,
    company_industry: null, // Unknown
    description: description,
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
    employment_type: 'unknown', // Unknown unless proven otherwise
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
      ats: 'Greenhouse',
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
