import { Job, Company, JobApplication, ScanStats } from '../types/job';

// Ensure the sum function strictly enforces the calculation and prorates missing data
const calcScore = (dimensions: any) => {
  let knownScore = 0;
  let knownMax = 0;

  const weights: Record<string, number> = {
    role_fit: 25,
    compensation_conditions: 25,
    location: 15,
    experience: 10,
    scope: 10,
    company: 10,
    application_effort: 5
  };

  for (const [key, dim] of Object.entries(dimensions)) {
    if ((dim as any).score !== null) {
      knownScore += (dim as any).score;
      knownMax += weights[key] || 0;
    }
  }

  if (knownMax === 0) return 0;
  
  // Prorate to 100
  return Math.round((knownScore / knownMax) * 100);
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-001',
    title: 'Senior Product Designer',
    company_id: 'comp-acme',
    company_name: 'Acme Fintech',
    company_industry: 'Financial Technology',
    description: "Acme Fintech is looking for a Senior Product Designer to lead the UX for our next-generation B2B banking dashboard...",
    location: {
      raw: 'Remote (US, LATAM, EMEA)',
      country: null,
      region: 'LATAM',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['EST', 'PST'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'contract',
    seniority: 'senior',
    salary: {
      min: 3000,
      max: 4500,
      currency: 'USD',
      period: 'month',
      raw: '$3,000 – $4,500 / month',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: 'Flexible, 4 core hours overlap',
      timezone: 'EST',
      weekend_required: 'no',
      after_hours_expected: false,
      on_call: false,
      notes: null
    },
    experience_required: '5+ years',
    requirements: {
      years_experience: { min: 5, max: null },
      degree_required: false,
      skills: ['Figma', 'Prototyping', 'Design Systems', 'Fintech', 'B2B'],
      languages: ['English (Fluent)'],
      work_authorization: ['Independent Contractor'],
      other: []
    },
    application_requirements: {
      application_url: 'https://acme.com/jobs/123',
      ats: 'Lever',
      estimated_effort: 'medium',
      estimated_minutes: 15,
      cover_letter_required: false,
      portfolio_required: true,
      references_required: false,
      questions_count: 2,
      take_home: {
        required: false,
        compensated: 'unknown'
      },
      video_required: false
    },
    hard_filter: {
      status: 'pass',
      reasons: [],
      warnings: []
    },
    ai_evaluation: {
      score: 0, // Will be computed
      verdict: 'apply',
      dimensions: {
        role_fit: { score: 25, rationale: "Perfect match with Robert's heavy fintech and B2B systems background.", confidence: 'high' },
        compensation_conditions: { score: 24, rationale: "Strong $3k-$4.5k range. Standard 40h week, flexible schedule.", confidence: 'high' },
        location: { score: 15, rationale: "Explicitly open to LATAM contractors with 4 hours overlap.", confidence: 'high' },
        experience: { score: 10, rationale: "5+ years required matches Robert's exact seniority.", confidence: 'high' },
        scope: { score: 10, rationale: "Core product design focus (dashboard UX/UI). No marketing or dev scope creep.", confidence: 'high' },
        company: { score: null, rationale: "No major prestige signals or red flags found for Acme Fintech.", confidence: 'unknown' },
        application_effort: { score: 5, rationale: "Quick Lever application. No take-home required upfront.", confidence: 'high' }
      },
      why_it_matches: [
        'Direct alignment with past Fintech/B2B projects',
        'Exceptional compensation match',
        'Low friction application'
      ],
      concerns: [],
      evidence: [
        { quote: "lead the UX for our next-generation B2B banking dashboard", context: "Scope perfectly matches B89 experience." }
      ],
      evaluated_at: '2026-08-18T12:00:00Z'
    },
    sources: [],
    canonical_url: 'https://acme.com/jobs/123',
    application_url: 'https://acme.com/jobs/123',
    posted_at: '2026-08-10T00:00:00Z',
    discovered_at: '2026-08-15T00:00:00Z',
    last_seen_at: '2026-08-18T00:00:00Z',
    status: 'new'
  },
  {
    id: 'job-002',
    title: 'Lead UX Designer',
    company_id: 'comp-finscale',
    company_name: 'FinScale Labs',
    company_industry: 'DeFi / Crypto',
    description: "Building the future of decentralized finance. We need a Lead UX Designer to take ownership of the entire product ecosystem...",
    location: {
      raw: 'Remote Worldwide',
      country: null,
      region: 'Worldwide',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: [],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'contract',
    seniority: 'lead',
    salary: {
      min: 2500,
      max: 3000,
      currency: 'USD',
      period: 'month',
      raw: '$2,500 – $3,000 / month',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 9,
      hours_per_week: 45,
      schedule: 'Fast-paced startup environment',
      timezone: null,
      weekend_required: 'frequent_uncompensated',
      after_hours_expected: true,
      on_call: false,
      notes: 'Occasional weekends required during protocol launches'
    },
    experience_required: '7+ years',
    requirements: {
      years_experience: { min: 7, max: null },
      degree_required: false,
      skills: ['UX', 'Web3', 'DeFi', 'Figma'],
      languages: ['English'],
      work_authorization: [],
      other: []
    },
    application_requirements: {
      application_url: 'https://finscale.com/apply',
      ats: 'Email/Form',
      estimated_effort: 'high',
      estimated_minutes: 45,
      cover_letter_required: true,
      portfolio_required: true,
      references_required: false,
      questions_count: 5,
      take_home: {
        required: true,
        estimated_hours: 8,
        compensated: false
      },
      video_required: false
    },
    hard_filter: {
      status: 'fail',
      reasons: ['mandatory_weekends', 'unpaid_take_home_extreme'],
      warnings: ['Demands 8h unpaid test', 'Weekend work expected']
    },
    ai_evaluation: {
      score: 0, // Will be computed
      verdict: 'skip',
      dimensions: {
        role_fit: { score: 20, rationale: "Good domain match in DeFi, but 'Lead' role expects 7+ years.", confidence: 'medium' },
        compensation_conditions: { score: 10, rationale: "Salary is acceptable ($2.5k), but conditions are poor (45h/week, frequent uncompensated weekends).", confidence: 'high' },
        location: { score: 15, rationale: "Fully remote worldwide.", confidence: 'high' },
        experience: { score: 5, rationale: "7+ years required is slightly above Robert's 5 years.", confidence: 'high' },
        scope: { score: 1, rationale: "Taking ownership of entire ecosystem may imply severe scope creep.", confidence: 'medium' },
        company: { score: null, rationale: "Unknown DeFi startup.", confidence: 'unknown' },
        application_effort: { score: 0, rationale: "8-hour unpaid take-home test is highly abusive friction.", confidence: 'high' }
      },
      why_it_matches: ['DeFi domain matches crypto background'],
      concerns: ['Mandatory weekends', 'Unpaid 8h assignment', 'Potential scope creep'],
      evaluated_at: '2026-08-18T12:00:00Z'
    },
    sources: [],
    conflicts: [
      { field: 'location', description: 'LinkedIn listing says Remote (US Only), but company career site says Remote Worldwide.' }
    ],
    canonical_url: 'https://finscale.com/apply',
    application_url: 'https://finscale.com/apply',
    posted_at: '2026-08-15T00:00:00Z',
    discovered_at: '2026-08-17T00:00:00Z',
    last_seen_at: '2026-08-18T00:00:00Z',
    status: 'new'
  }
];

// Mutate scores to strictly compute the prorated sum
MOCK_JOBS.forEach(j => {
  j.ai_evaluation.score = calcScore(j.ai_evaluation.dimensions);
});

export const MOCK_SAVED_JOBS = MOCK_JOBS.filter(j => j.status === 'saved');
export const MOCK_COMPANIES: Company[] = [];
export const MOCK_APPLICATIONS: JobApplication[] = [];
export const INITIAL_SCAN_STATS: ScanStats = {
  total_scanned: 142,
  new_opportunities: 2,
  strong_matches: 1,
  worth_reviewing: 0,
  skipped_automatically: 140,
  last_scan_at: '2026-08-18T14:53:00Z'
};
