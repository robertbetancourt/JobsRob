import { Job, Source } from '../../types/job';
import { RawJob } from '../../types/source';

export function normalizeAshbyJob(raw: RawJob, companyName: string): Job {
  const p = raw.raw_payload;

  let locationRaw = 'Unknown';
  if (p.location) {
    locationRaw = p.location;
  }

  // Work Arrangement Inference
  let workArrangement: Job['work_arrangement'] = 'unknown';
  
  if (p.isRemote === true) {
    workArrangement = 'remote';
  } else if (p.workplaceType) {
    const wt = p.workplaceType.toLowerCase();
    if (wt.includes('remote')) workArrangement = 'remote';
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
  if (p.employmentType) {
    const cmt = p.employmentType.toLowerCase();
    if (cmt.includes('full')) employmentType = 'full_time';
    else if (cmt.includes('contract')) employmentType = 'contract';
    else if (cmt.includes('intern')) employmentType = 'contract';
    else if (cmt.includes('part')) employmentType = 'part_time';
  }

  // Compensation / Salary extraction
  let salary: Job['salary'] = {
    min: null,
    max: null,
    currency: 'USD',
    period: 'unknown',
    raw: 'Unknown',
    source: 'unknown',
    confidence: 'unknown'
  };

  if (p.compensation && p.compensation.compensationTiers && Array.isArray(p.compensation.compensationTiers) && p.compensation.compensationTiers.length > 0) {
    // We grab the first tier as representative if multiple exist
    const tier = p.compensation.compensationTiers[0];
    if (tier && tier.components && Array.isArray(tier.components)) {
      const salaryComponent = tier.components.find((c: any) => c.compensationType === 'Salary' || c.compensationType === 'Hourly');
      if (salaryComponent) {
        salary.min = salaryComponent.minValue || null;
        salary.max = salaryComponent.maxValue || null;
        if (salaryComponent.currencyCode) {
          salary.currency = salaryComponent.currencyCode;
        }
        
        const interval = salaryComponent.interval || '';
        if (interval.includes('YEAR')) salary.period = 'year';
        else if (interval.includes('MONTH')) salary.period = 'month';
        else if (interval.includes('HOUR')) salary.period = 'hour';

        if (tier.tierSummary) {
          salary.raw = tier.tierSummary;
        } else if (salary.min && salary.max) {
          salary.raw = `${salary.min} - ${salary.max} ${salary.currency}`;
        }
        
        salary.source = 'range_disclosed';
        salary.confidence = 'high';
      }
    }
  }

  let fullDescription = p.descriptionPlain || p.descriptionHtml || 'No description available';

  const sourceRecord: Source = {
    id: raw.external_id,
    source_name: raw.source_name,
    source_type: raw.source_type,
    source_url: raw.source_url,
    application_url: p.applyUrl || raw.source_url,
    discovered_at: raw.fetched_at
  };

  return {
    id: `ashby-${raw.external_id}`,
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
    salary,
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
      application_url: p.applyUrl || raw.source_url,
      ats: 'Ashby',
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
    application_url: p.applyUrl || raw.source_url,
    posted_at: raw.source_updated_at || raw.fetched_at,
    discovered_at: raw.fetched_at,
    last_seen_at: raw.fetched_at,
    status: 'new'
  };
}
