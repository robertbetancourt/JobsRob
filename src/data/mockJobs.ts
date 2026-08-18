import { Job, ScanStats } from '../types/job';

export const INITIAL_SCAN_STATS: ScanStats = {
  total_found: 83,
  duplicates_removed: 21,
  incompatible_removed: 17,
  evaluated: 45,
  strong_matches: 8,
  worth_reviewing: 12,
  low_priority: 25,
  last_scan_at: '2026-08-18T13:45:00Z'
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-001',
    title: 'Senior Product Designer',
    company_id: 'comp-finscale',
    company_name: 'FinScale Labs',
    company_industry: 'Fintech & B2B SaaS',
    description: `FinScale Labs is building next-generation treasury and automated cashflow management platforms for high-growth tech companies across the Americas.

We are looking for an experienced Senior Product Designer (~5+ years) to lead the core banking and payments experience. You will collaborate directly with our VP of Product and Lead Engineer to shape complex financial workflows into intuitive, high-fidelity interfaces.

Key Responsibilities:
• Own the end-to-end design lifecycle for our cross-border payments and card issuing products.
• Create high-fidelity interactive prototypes, user flows, and maintain our multi-brand design system in Figma.
• Translate complex financial regulations and accounting data structures into clean, frictionless UX.
• Partner with frontend engineers to ensure pixel-perfect, accessible component delivery.

Requirements:
• 4–6+ years in Product Design / UI/UX with a solid portfolio of shipping complex web/mobile SaaS or Fintech products.
• Deep proficiency in Figma, design systems, and rapid interactive prototyping.
• Fluent English communication (written & spoken).
• Based in Latin America or compatible with EST/EDT time zones.`,
    location: {
      raw: 'Remote — Latin America / Americas',
      country: null,
      region: 'Americas / LATAM',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['EST', 'EDT', 'GMT-4'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'contract',
    seniority: 'senior',
    salary: {
      min: 3200,
      max: 4200,
      currency: 'USD',
      period: 'month',
      raw: '$3,200 – $4,200 / month (USD Contractor)',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: 'Monday – Friday (Flexible Core Hours 10am-3pm EST)',
      timezone: 'EST',
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: 'Clear async culture with standard 40h work week. No weekend work expected.'
    },
    experience_required: '5+ years',
    requirements: {
      years_experience: { min: 5, max: null },
      degree_required: false,
      skills: ['Figma', 'Product Design', 'Fintech', 'Design Systems', 'User Flows', 'Prototyping', 'B2B SaaS'],
      languages: ['English (Fluent)'],
      work_authorization: ['International Contractor (W8-BEN compatible)'],
      other: ['Portfolio showing complex web/mobile fintech workflows']
    },
    application_requirements: {
      application_url: 'https://boards.greenhouse.io/finscalelabs/jobs/4820194',
      ats: 'Greenhouse',
      estimated_effort: 'low',
      estimated_minutes: 8,
      cover_letter_required: false,
      portfolio_required: true,
      references_required: false,
      questions_count: 3,
      take_home: {
        required: false,
        estimated_hours: null,
        description: 'Standard portfolio walkthrough during round 2. No unpaid challenge.'
      },
      video_required: false
    },
    hard_filter: {
      status: 'pass',
      reasons: [],
      warnings: []
    },
    ai_evaluation: {
      score: 94,
      verdict: 'apply',
      dimensions: {
        role_fit: 25,
        compensation_conditions: 24,
        location: 15,
        experience: 10,
        scope: 10,
        application_effort: 5,
        company: 5,
        risk: 0
      },
      why_it_matches: [
        'End-to-end Product Design ownership in high-fit Fintech domain',
        'Explicitly accepts international contractors from Latin America (USD direct payout)',
        'Compensation ($3.2k–$4.2k/mo) is well above Robert’s $2k–$2.5k baseline with healthy boundaries',
        'Experience requirement (~5 yrs) matches Robert’s ~5 years background accurately',
        'Low friction Greenhouse application (8 mins, no take-home test)'
      ],
      concerns: [
        'High candidate interest expected due to strong compensation tier'
      ],
      compensation_assessment: 'Excellent: $3,200–$4,200/month USD for a standard 40h/week remote contractor engagement. Highly competitive relative to LATAM market.',
      location_assessment: 'Fully remote with EST/GMT-4 overlap, ideal for Robert based in Venezuela.',
      recommended_projects: ['B89', 'Banexcoin'],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-001-gh',
        source_name: 'Greenhouse ATS',
        source_type: 'ats',
        source_url: 'https://boards.greenhouse.io/finscalelabs/jobs/4820194',
        application_url: 'https://boards.greenhouse.io/finscalelabs/jobs/4820194',
        discovered_at: '2026-08-18T13:42:00Z'
      }
    ],
    canonical_url: 'https://boards.greenhouse.io/finscalelabs/jobs/4820194',
    application_url: 'https://boards.greenhouse.io/finscalelabs/jobs/4820194',
    posted_at: '2026-08-17T18:30:00Z',
    discovered_at: '2026-08-18T13:42:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-002',
    title: 'Product Designer — Core Banking & Mobile',
    company_id: 'comp-kora',
    company_name: 'Kora Financial',
    company_industry: 'Digital Banking & Neobank',
    description: `Kora is the leading digital wallet and financial platform serving 2M+ active users across Latin America.

We are looking for a Product Designer to take charge of our Core Banking and Onboarding squad. You will design mobile-first experiences for account creation, micro-investments, and everyday payments.

What you’ll do:
• Design intuitive user flows for mobile banking (iOS & Android).
• Run usability tests, analyze retention metrics with product managers, and iterate on key product funnels.
• Maintain cohesive UI design across our design token system in Figma.

Requirements:
• 4+ years designing mobile digital products (Fintech / Neobanks strongly preferred).
• Solid understanding of mobile design guidelines (Human Interface Guidelines & Material Design).
• Spanish native + conversational English.`,
    location: {
      raw: 'Remote — LATAM (Anywhere)',
      country: null,
      region: 'Latin America',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['GMT-3 to GMT-5'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'full_time',
    seniority: 'mid',
    salary: {
      min: 2400,
      max: 3000,
      currency: 'USD',
      period: 'month',
      raw: '$2,400 – $3,000 / month',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: 'Monday – Friday (Standard LATAM business hours)',
      timezone: 'GMT-4',
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: 'Healthy work-life balance with regional holidays observed.'
    },
    experience_required: '4+ years',
    requirements: {
      years_experience: { min: 4, max: null },
      degree_required: false,
      skills: ['Mobile UX', 'Figma', 'Neobank', 'Design Systems', 'User Testing', 'Fintech'],
      languages: ['Spanish (Native)', 'English (Conversational)'],
      work_authorization: ['LATAM contractor'],
      other: ['Mobile product design case studies']
    },
    application_requirements: {
      application_url: 'https://jobs.lever.co/kora/pd-core',
      ats: 'Lever',
      estimated_effort: 'low',
      estimated_minutes: 6,
      cover_letter_required: false,
      portfolio_required: true,
      references_required: false,
      questions_count: 2,
      take_home: {
        required: false,
        estimated_hours: null
      },
      video_required: false
    },
    hard_filter: {
      status: 'pass',
      reasons: [],
      warnings: []
    },
    ai_evaluation: {
      score: 89,
      verdict: 'strong_match',
      dimensions: {
        role_fit: 24,
        compensation_conditions: 23,
        location: 15,
        experience: 9,
        scope: 9,
        application_effort: 5,
        company: 4,
        risk: 0
      },
      why_it_matches: [
        'Exceptional alignment with Robert’s neobank / mobile wallet projects (B89 and Banexcoin)',
        'Full LATAM remote contract in USD ($2.4k–$3.0k/month)',
        'Clear mobile-first Product Design scope with established squad',
        'Streamlined 6-minute Lever application'
      ],
      concerns: [
        'Spanish/English bilingual requirement (aligned with Robert’s profile)'
      ],
      compensation_assessment: 'Strong: $2,400–$3,000/mo exceeds Robert’s $2,000 baseline, offering stable full-time compensation with sustainable conditions.',
      location_assessment: 'Perfect match for Venezuela/LATAM timezones with remote contractor agreement.',
      recommended_projects: ['B89', 'Banexcoin', 'GIP'],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-002-lever',
        source_name: 'Lever ATS',
        source_type: 'ats',
        source_url: 'https://jobs.lever.co/kora/pd-core',
        application_url: 'https://jobs.lever.co/kora/pd-core',
        discovered_at: '2026-08-18T13:40:00Z'
      }
    ],
    canonical_url: 'https://jobs.lever.co/kora/pd-core',
    application_url: 'https://jobs.lever.co/kora/pd-core',
    posted_at: '2026-08-18T09:15:00Z',
    discovered_at: '2026-08-18T13:40:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-003',
    title: 'UI/UX Product Designer (Part-Time / Flexible)',
    company_id: 'comp-edtech-latam',
    company_name: 'EdTech Latam',
    company_industry: 'Education & SaaS',
    description: `EdTech Latam provides interactive learning management tools for universities across Colombia, Mexico, and Venezuela.

We are seeking a Product Designer for a flexible 30-hour per week role. You will work at a relaxed pace improving student dashboards, grading interfaces, and course creators.

Conditions:
• 30 hours per week (6 hours/day, Monday–Friday).
• Zero overtime, 100% asynchronous flexibility.
• Perfect for someone who values work-life balance and calm environments.`,
    location: {
      raw: 'Remote — Venezuela / Latin America',
      country: 'Venezuela',
      region: 'Latin America',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['GMT-4'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'part_time',
    seniority: 'mid',
    salary: {
      min: 850,
      max: 1100,
      currency: 'USD',
      period: 'month',
      raw: '$850 – $1,100 / month (for 30h/week)',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 6,
      hours_per_week: 30,
      schedule: 'Flexible 6 hours/day (No mandatory meetings)',
      timezone: 'GMT-4',
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: 'Exceptional work boundaries: strictly 30h/wk, asynchronous task tracking.'
    },
    experience_required: '3+ years',
    requirements: {
      years_experience: { min: 3, max: null },
      degree_required: false,
      skills: ['Figma', 'UI/UX', 'Web Apps', 'Prototyping', 'Design Systems'],
      languages: ['Spanish'],
      work_authorization: ['LATAM / Local contract'],
      other: []
    },
    application_requirements: {
      application_url: 'https://edtechlatam.com/jobs/designer',
      ats: 'Company Site',
      estimated_effort: 'low',
      estimated_minutes: 5,
      cover_letter_required: false,
      portfolio_required: true,
      references_required: false,
      questions_count: 1,
      take_home: { required: false, estimated_hours: null },
      video_required: false
    },
    hard_filter: {
      status: 'pass',
      reasons: [],
      warnings: []
    },
    ai_evaluation: {
      score: 68,
      verdict: 'review',
      dimensions: {
        role_fit: 20,
        compensation_conditions: 17,
        location: 15,
        experience: 8,
        scope: 8,
        application_effort: 5,
        company: 3,
        risk: -8
      },
      why_it_matches: [
        'Lightweight 30h/week workload with zero overtime pressure',
        'Explicit support for Venezuela-based designers with stable USD payouts',
        'Clean UI/UX design scope without marketing or dev clutter'
      ],
      concerns: [
        'Compensation ($850–$1,100/mo) is below the preferred $2k target, though fair for 30h/wk in Venezuela'
      ],
      compensation_assessment: 'Moderate: Lower than international rate, but represents ~$8.50/hr for reduced 30h workload with no weekend stress. Acceptable fallback or secondary engagement.',
      location_assessment: 'Direct match for Venezuela local conditions.',
      recommended_projects: ['Mimik', 'BE FIT'],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-003-web',
        source_name: 'Company Careers',
        source_type: 'company_site',
        source_url: 'https://edtechlatam.com/jobs/designer',
        application_url: 'https://edtechlatam.com/jobs/designer',
        discovered_at: '2026-08-18T13:30:00Z'
      }
    ],
    canonical_url: 'https://edtechlatam.com/jobs/designer',
    application_url: 'https://edtechlatam.com/jobs/designer',
    posted_at: '2026-08-16T14:00:00Z',
    discovered_at: '2026-08-18T13:30:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-004',
    title: 'Lead Product Designer (Fast-Paced Hustle)',
    company_id: 'comp-hypergrowth',
    company_name: 'HyperGrowth Ventures',
    company_industry: 'Crypto & High-Frequency Trading',
    description: `We are a high-speed trading platform seeking an elite Lead Product Designer willing to do whatever it takes.

Expectations:
• Must be available 12–14 hours per day across global market hours.
• Mandatory weekend on-call shifts to support active crypto release sprints.
• We move fast and break things: you must deliver multiple production flows per day with instant Slack response times (under 5 mins).

Compensation:
• $4,800 – $5,500 USD / month.`,
    location: {
      raw: 'Remote (Worldwide)',
      country: null,
      region: 'Global',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['24/7 on call'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'contract',
    seniority: 'lead',
    salary: {
      min: 4800,
      max: 5500,
      currency: 'USD',
      period: 'month',
      raw: '$4,800 – $5,500 / month',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 13,
      hours_per_week: 65,
      schedule: '7 days a week, 12-14 hours per day',
      timezone: 'UTC',
      weekend_required: true,
      after_hours_expected: true,
      on_call: true,
      notes: 'Severe red flag: Explicit mandatory 12+ hour days, weekend on-call, <5m Slack response SLA.'
    },
    experience_required: '5+ years',
    requirements: {
      years_experience: { min: 5, max: null },
      degree_required: false,
      skills: ['Figma', 'Crypto', 'High-speed UI', 'Immediate Availability'],
      languages: ['English'],
      work_authorization: [],
      other: []
    },
    application_requirements: {
      application_url: 'https://hypergrowth.io/apply/lead-pd',
      ats: 'Custom Form',
      estimated_effort: 'high',
      estimated_minutes: 45,
      cover_letter_required: true,
      portfolio_required: true,
      references_required: true,
      questions_count: 8,
      take_home: {
        required: true,
        estimated_hours: 4,
        description: 'Mandatory 4-hour live test under timed conditions.'
      },
      video_required: true
    },
    hard_filter: {
      status: 'fail',
      reasons: [
        'Extreme and unsustainable working conditions (12–14h/day, mandatory weekends, 24/7 on-call)'
      ],
      warnings: ['Severe burnout risk', 'High application friction (4h timed test + video)']
    },
    ai_evaluation: {
      score: 36,
      verdict: 'skip',
      dimensions: {
        role_fit: 18,
        compensation_conditions: 6,
        location: 10,
        experience: 8,
        scope: 4,
        application_effort: 0,
        company: 0,
        risk: -10
      },
      why_it_matches: [
        'High raw dollar amount ($4.8k–$5.5k/month)',
        'Crypto/Fintech domain overlaps with Banexcoin background'
      ],
      concerns: [
        'SEVERE RED FLAG: Explicit 12–14h daily expectation and mandatory weekend availability',
        'Hourly rate is effectively low when normalized over 65+ hours/week',
        'Aggressive workplace culture contrary to sustainable work boundaries',
        'Extensive 4-hour take-home challenge and video requirements'
      ],
      compensation_assessment: 'Deceptive: While $5k/mo looks high, 65-70h/week equals ~$18/hr under extreme distress. Fails JOB_RULES principle 05 & 06.',
      location_assessment: 'Global remote, but time demands eliminate personal boundaries.',
      recommended_projects: ['Banexcoin'],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-004-cb',
        source_name: 'CryptoJobsList',
        source_type: 'job_board',
        source_url: 'https://cryptojobslist.com/jobs/hypergrowth-lead-pd',
        application_url: 'https://hypergrowth.io/apply/lead-pd',
        discovered_at: '2026-08-18T13:15:00Z'
      }
    ],
    canonical_url: 'https://cryptojobslist.com/jobs/hypergrowth-lead-pd',
    application_url: 'https://hypergrowth.io/apply/lead-pd',
    posted_at: '2026-08-18T06:00:00Z',
    discovered_at: '2026-08-18T13:15:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-005',
    title: 'Senior Product Designer — Patient Portal (US Only)',
    company_id: 'comp-carepoint',
    company_name: 'CarePoint Health US',
    company_industry: 'Healthcare SaaS',
    description: `CarePoint is modernizing hospital check-ins and telehealth portals across 40 US states.

We require a Senior Product Designer located within the United States with active US Citizen or US Permanent Resident (Green Card) status.

Must be eligible for direct W-2 employment. We cannot provide visa sponsorship or hire international 1099/C2C contractors at this time due to federal HIPAA data regulations.`,
    location: {
      raw: 'Remote (United States Residents Only)',
      country: 'United States',
      region: 'North America',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['US Timezones'],
      residency_required: true,
      work_authorization_required: true,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'full_time',
    seniority: 'senior',
    salary: {
      min: 10000,
      max: 12500,
      currency: 'USD',
      period: 'month',
      raw: '$120,000 – $150,000 / year (US W-2 only)',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: '9am – 5pm EST',
      timezone: 'EST',
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: null
    },
    experience_required: '5+ years',
    requirements: {
      years_experience: { min: 5, max: null },
      degree_required: true,
      skills: ['Figma', 'HealthTech', 'HIPAA', 'Design Systems'],
      languages: ['English'],
      work_authorization: ['US Citizen / Green Card W-2 Only'],
      other: ['US background check required']
    },
    application_requirements: {
      application_url: 'https://carepoint.us/careers/pd-109',
      ats: 'Workday',
      estimated_effort: 'medium',
      estimated_minutes: 20,
      cover_letter_required: true,
      portfolio_required: true,
      references_required: true,
      questions_count: 7,
      take_home: { required: false, estimated_hours: null },
      video_required: false
    },
    hard_filter: {
      status: 'fail',
      reasons: [
        'Hard restriction: Strictly requires US Work Authorization / US Residency (W-2 only, no international contractors)'
      ],
      warnings: []
    },
    ai_evaluation: {
      score: 18,
      verdict: 'skip',
      dimensions: {
        role_fit: 12,
        compensation_conditions: 0,
        location: 0,
        experience: 6,
        scope: 0,
        application_effort: 0,
        company: 0,
        risk: -10
      },
      why_it_matches: [
        'Senior Product Designer role scope'
      ],
      concerns: [
        'HARD INCOMPATIBILITY: Mandates US citizenship/residency and W-2 payroll; not accessible from Venezuela',
        'Applying will result in immediate automated ATS rejection'
      ],
      compensation_assessment: 'Not applicable: Cannot be contracted internationally.',
      location_assessment: 'Hard barrier: US territory only.',
      recommended_projects: [],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-005-li',
        source_name: 'LinkedIn Jobs',
        source_type: 'job_board',
        source_url: 'https://linkedin.com/jobs/view/392019482',
        application_url: 'https://carepoint.us/careers/pd-109',
        discovered_at: '2026-08-18T13:00:00Z'
      }
    ],
    canonical_url: 'https://linkedin.com/jobs/view/392019482',
    application_url: 'https://carepoint.us/careers/pd-109',
    posted_at: '2026-08-17T12:00:00Z',
    discovered_at: '2026-08-18T13:00:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-006',
    title: 'Founding Product Designer & UI Lead',
    company_id: 'comp-stealth-app',
    company_name: 'Stealth AI App',
    company_industry: 'Consumer Social / AI',
    description: `We are building a viral AI mobile app in stealth mode. We need a brilliant designer to build our entire brand, Figma files, and mobile UI from scratch.

Compensation:
• 0.5% - 1.5% Equity only.
• Unpaid until our Series A seed funding round closes (estimated Q3 2027).
• Great opportunity to build your portfolio and gain founder experience!`,
    location: {
      raw: 'Remote (Anywhere)',
      country: null,
      region: 'Global',
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
      min: 0,
      max: 0,
      currency: 'USD',
      period: 'month',
      raw: '$0 / month (0.5%–1.5% Equity Only / Unpaid)',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: 'Self-directed',
      timezone: null,
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: 'Unpaid work expectation.'
    },
    experience_required: '3+ years',
    requirements: {
      years_experience: { min: 3, max: null },
      degree_required: false,
      skills: ['Figma', 'UI/UX', 'Mobile App', 'Branding'],
      languages: ['English or Spanish'],
      work_authorization: [],
      other: []
    },
    application_requirements: {
      application_url: 'https://wellfound.com/jobs/stealth-founding-pd',
      ats: 'Wellfound',
      estimated_effort: 'low',
      estimated_minutes: 5,
      cover_letter_required: false,
      portfolio_required: true,
      references_required: false,
      questions_count: 1,
      take_home: { required: false, estimated_hours: null },
      video_required: false
    },
    hard_filter: {
      status: 'fail',
      reasons: [
        'Unpaid work / Equity-only role violates Job Rules (unpaid work is strictly unacceptable)'
      ],
      warnings: ['Exploitative compensation model']
    },
    ai_evaluation: {
      score: 0,
      verdict: 'skip',
      dimensions: {
        role_fit: 10,
        compensation_conditions: -25,
        location: 5,
        experience: 5,
        scope: 5,
        application_effort: 0,
        company: 0,
        risk: -25
      },
      why_it_matches: [],
      concerns: [
        'SEVERE RED FLAG: Completely unpaid role ($0 USD). Job Rules strictly reject unpaid work.'
      ],
      compensation_assessment: 'Zero compensation ($0). Violates fundamental criteria.',
      location_assessment: 'Remote, but invalid due to zero compensation.',
      recommended_projects: [],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-006-wf',
        source_name: 'Wellfound (AngelList)',
        source_type: 'job_board',
        source_url: 'https://wellfound.com/jobs/stealth-founding-pd',
        application_url: 'https://wellfound.com/jobs/stealth-founding-pd',
        discovered_at: '2026-08-18T12:50:00Z'
      }
    ],
    canonical_url: 'https://wellfound.com/jobs/stealth-founding-pd',
    application_url: 'https://wellfound.com/jobs/stealth-founding-pd',
    posted_at: '2026-08-18T04:00:00Z',
    discovered_at: '2026-08-18T12:50:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-007',
    title: 'Senior Product Designer — Design Systems',
    company_id: 'comp-cloudnative',
    company_name: 'CloudNative Studio',
    company_industry: 'Developer Tools & Cloud',
    description: `CloudNative Studio crafts developer infrastructure tools used by over 100k cloud engineers globally.

We are seeking a Senior Product Designer to establish our centralized multi-platform design system and optimize complex cloud resource visualization dashboards.

What you’ll do:
• Architect tokens, components, accessibility standards, and guidelines in Figma and Storybook.
• Partner with product managers to design intuitive workflows for Kubernetes cluster management.
• Mentor product teams on design system usage and UI best practices.

Requirements:
• 5+ years in Product Design with specialized depth in complex Design Systems.
• Excellent English communication and asynchronous workflow habits.`,
    location: {
      raw: 'Remote (Worldwide / Americas)',
      country: null,
      region: 'Americas',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['Flexible overlap with UTC-5'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'full_time',
    seniority: 'senior',
    salary: {
      min: null,
      max: null,
      currency: null,
      period: null,
      raw: 'Competitive Salary (Undisclosed)',
      source: 'undisclosed',
      confidence: 'low'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: 'Flexible Async (Core overlap 3 hours/day)',
      timezone: 'UTC-5',
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: 'Strong asynchronous documentation culture.'
    },
    experience_required: '5+ years',
    requirements: {
      years_experience: { min: 5, max: null },
      degree_required: false,
      skills: ['Figma Tokens', 'Design Systems', 'Storybook', 'B2B SaaS', 'Accessibility', 'Complex UI'],
      languages: ['English (Fluent)'],
      work_authorization: ['Global contractor'],
      other: ['Design system case study']
    },
    application_requirements: {
      application_url: 'https://jobs.ashbyhq.com/cloudnative/designer-systems',
      ats: 'Ashby',
      estimated_effort: 'medium',
      estimated_minutes: 12,
      cover_letter_required: false,
      portfolio_required: true,
      references_required: false,
      questions_count: 4,
      take_home: { required: false, estimated_hours: null },
      video_required: false
    },
    hard_filter: {
      status: 'pass',
      reasons: [],
      warnings: ['Salary is undisclosed in posting']
    },
    ai_evaluation: {
      score: 77,
      verdict: 'review',
      dimensions: {
        role_fit: 23,
        compensation_conditions: 15,
        location: 14,
        experience: 9,
        scope: 9,
        application_effort: 4,
        company: 4,
        risk: -1
      },
      why_it_matches: [
        'Design Systems leadership matches Robert’s proven experience creating scalable Figma component libraries',
        'Strong async culture with global remote contract support',
        'Modern Ashby ATS application (12 mins, no take-home)'
      ],
      concerns: [
        'Salary undisclosed in job posting; must verify range ($2.5k+) during first recruiter touchpoint'
      ],
      compensation_assessment: 'Undisclosed: Company is a well-funded cloud startup. Per JOB_RULES.md, undisclosed salary is not penalized as an automatic rejection, but requires early confirmation.',
      location_assessment: 'Worldwide remote with friendly Americas overlap.',
      recommended_projects: ['Autoandes', 'B89'],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-007-ashby',
        source_name: 'Ashby ATS',
        source_type: 'ats',
        source_url: 'https://jobs.ashbyhq.com/cloudnative/designer-systems',
        application_url: 'https://jobs.ashbyhq.com/cloudnative/designer-systems',
        discovered_at: '2026-08-18T12:30:00Z'
      }
    ],
    canonical_url: 'https://jobs.ashbyhq.com/cloudnative/designer-systems',
    application_url: 'https://jobs.ashbyhq.com/cloudnative/designer-systems',
    posted_at: '2026-08-18T08:00:00Z',
    discovered_at: '2026-08-18T12:30:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-008',
    title: 'Digital Product Designer (Mid-Level)',
    company_id: 'comp-nexus',
    company_name: 'Nexus B2B Cloud',
    company_industry: 'Supply Chain & Logistics SaaS',
    description: `Nexus is streamlining international logistics and supply chain visibility for global shipping carriers.

We are looking for a Mid-Level Digital Product Designer (3–4 years experience) who wants to grow with our product team.

Responsibilities:
• Design end-to-end user flows for customs documentation and cargo tracking.
• Build wireframes, prototypes, and user tests.
• Collaborate with design team lead on design tokens.

Conditions:
• Full-time contractor ($2,200 – $2,800/mo).
• Standard 40 hours/week, 20 days paid time off per year.`,
    location: {
      raw: 'Remote (Latin America / Europe)',
      country: null,
      region: 'Latin America',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['EST or GMT'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'full_time',
    seniority: 'mid',
    salary: {
      min: 2200,
      max: 2800,
      currency: 'USD',
      period: 'month',
      raw: '$2,200 – $2,800 / month + 20 days PTO',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: 'Monday – Friday, Standard Business Hours',
      timezone: 'EST',
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: 'Includes 20 paid vacation days and health stipend.'
    },
    experience_required: '3–4 years',
    requirements: {
      years_experience: { min: 3, max: 4 },
      degree_required: false,
      skills: ['Figma', 'B2B SaaS', 'User Flows', 'Prototyping', 'Logistics'],
      languages: ['English (Fluent)'],
      work_authorization: ['LATAM contractor'],
      other: []
    },
    application_requirements: {
      application_url: 'https://nexusb2b.com/careers/mid-pd',
      ats: 'Greenhouse',
      estimated_effort: 'low',
      estimated_minutes: 8,
      cover_letter_required: false,
      portfolio_required: true,
      references_required: false,
      questions_count: 3,
      take_home: { required: false, estimated_hours: null },
      video_required: false
    },
    hard_filter: {
      status: 'pass',
      reasons: [],
      warnings: []
    },
    ai_evaluation: {
      score: 83,
      verdict: 'strong_match',
      dimensions: {
        role_fit: 22,
        compensation_conditions: 22,
        location: 14,
        experience: 9,
        scope: 8,
        application_effort: 5,
        company: 3,
        risk: 0
      },
      why_it_matches: [
        'Strong compensation ($2.2k–$2.8k/mo) for a mid-level title that Robert comfortably satisfies with ~5 years experience',
        'Includes 20 days paid vacation and standard 40h boundaries',
        'B2B complex workflows directly align with Autoandes and GIP logistics/operations case studies'
      ],
      concerns: [
        'Title is Mid-level rather than Senior, but compensation and scope meet all positive criteria'
      ],
      compensation_assessment: 'Solid: Above Robert’s $2,000 threshold with strong perks and clear boundaries.',
      location_assessment: 'Remote LATAM contractor supported.',
      recommended_projects: ['Autoandes', 'GIP', 'Banexcoin'],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-008-gh',
        source_name: 'Greenhouse ATS',
        source_type: 'ats',
        source_url: 'https://boards.greenhouse.io/nexusb2b/jobs/92019',
        application_url: 'https://boards.greenhouse.io/nexusb2b/jobs/92019',
        discovered_at: '2026-08-18T12:00:00Z'
      }
    ],
    canonical_url: 'https://boards.greenhouse.io/nexusb2b/jobs/92019',
    application_url: 'https://boards.greenhouse.io/nexusb2b/jobs/92019',
    posted_at: '2026-08-17T16:00:00Z',
    discovered_at: '2026-08-18T12:00:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-009',
    title: 'Senior UI/UX & Growth Designer (Multi-Hat)',
    company_id: 'comp-omnicommerce',
    company_name: 'OmniCommerce',
    company_industry: 'E-commerce & Dropshipping',
    description: `Fast-growing e-commerce group looking for a Senior Designer who can do everything.

You will be responsible for:
• Product UX/UI in Figma
• React / HTML / Tailwind CSS front-end development of landing pages
• Social media video editing for TikTok and Instagram ads (CapCut / Premiere)
• Banner production, packaging design, and SEO copywriting
• Daily conversion rate testing across 12 storefronts

Salary: $1,400 – $1,700 / month.`,
    location: {
      raw: 'Remote (LATAM)',
      country: null,
      region: 'Latin America',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: [],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'full_time',
    seniority: 'senior',
    salary: {
      min: 1400,
      max: 1700,
      currency: 'USD',
      period: 'month',
      raw: '$1,400 – $1,700 / month',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 9,
      hours_per_week: 45,
      schedule: 'Fast-paced hustle',
      timezone: 'EST',
      weekend_required: false,
      after_hours_expected: true,
      on_call: false,
      notes: 'Unreasonable scope expectations across design, coding, ads, and video.'
    },
    experience_required: '4+ years',
    requirements: {
      years_experience: { min: 4, max: null },
      degree_required: false,
      skills: ['Figma', 'React', 'HTML/CSS', 'TikTok Video', 'Social Media Ads', 'Graphic Design', 'SEO'],
      languages: ['English & Spanish'],
      work_authorization: [],
      other: []
    },
    application_requirements: {
      application_url: 'https://omnicommerce.co/jobs/designer',
      ats: 'Google Form',
      estimated_effort: 'medium',
      estimated_minutes: 25,
      cover_letter_required: true,
      portfolio_required: true,
      references_required: false,
      questions_count: 6,
      take_home: { required: true, estimated_hours: 2, description: 'Design 3 ad banners and a live mockup' },
      video_required: false
    },
    hard_filter: {
      status: 'review',
      reasons: [],
      warnings: ['Severe scope creep: Product design + frontend coding + social marketing + video editing for low compensation']
    },
    ai_evaluation: {
      score: 31,
      verdict: 'low_priority',
      dimensions: {
        role_fit: 12,
        compensation_conditions: 8,
        location: 10,
        experience: 7,
        scope: 2,
        application_effort: 1,
        company: 1,
        risk: -10
      },
      why_it_matches: [
        'Remote LATAM contract'
      ],
      concerns: [
        'SEVERE SCOPE CREEP: Job requires full-stack React frontend, video ads editing, packaging, and marketing for only $1,400–$1,700/mo',
        'Violates JOB_RULES.md Section 11 & 12 (excessive unrelated responsibilities with inadequate pay)'
      ],
      compensation_assessment: 'Poor value: Combining 4 distinct professions (Product Designer + Frontend Dev + Video Editor + Media Buyer) for $1.5k/mo.',
      location_assessment: 'Remote, but the job responsibilities are heavily fragmented.',
      recommended_projects: [],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-009-gf',
        source_name: 'Job Board Aggregator',
        source_type: 'aggregator',
        source_url: 'https://remoteco.com/jobs/omnicommerce-pd',
        application_url: 'https://omnicommerce.co/jobs/designer',
        discovered_at: '2026-08-18T11:45:00Z'
      }
    ],
    canonical_url: 'https://remoteco.com/jobs/omnicommerce-pd',
    application_url: 'https://omnicommerce.co/jobs/designer',
    posted_at: '2026-08-16T10:00:00Z',
    discovered_at: '2026-08-18T11:45:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-010',
    title: 'Senior UX/UI Designer — Multi-Stage Challenge',
    company_id: 'comp-enterprise-matrix',
    company_name: 'Enterprise Matrix',
    company_industry: 'Enterprise ERP',
    description: `Enterprise Matrix is hiring a Senior UX/UI Designer to redesign our complex ERP procurement workflows.

Application Process:
1. Initial application with 8 detailed behavioral essay questions.
2. Mandatory 5–6 hour unpaid design challenge deliverable prior to any recruiter conversation.
3. 3-minute video introduction.
4. 4 interview panel rounds.

Compensation:
• $2,800 – $3,400 USD / month.`,
    location: {
      raw: 'Remote (Latin America)',
      country: null,
      region: 'Latin America',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['EST'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'full_time',
    seniority: 'senior',
    salary: {
      min: 2800,
      max: 3400,
      currency: 'USD',
      period: 'month',
      raw: '$2,800 – $3,400 / month',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: 'Monday – Friday EST',
      timezone: 'EST',
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: null
    },
    experience_required: '5+ years',
    requirements: {
      years_experience: { min: 5, max: null },
      degree_required: false,
      skills: ['Figma', 'Enterprise ERP', 'UX Flows', 'Information Architecture'],
      languages: ['English (Fluent)'],
      work_authorization: ['LATAM contractor'],
      other: ['Extensive design challenge']
    },
    application_requirements: {
      application_url: 'https://enterprisematrix.io/careers/apply-ux',
      ats: 'Custom ATS',
      estimated_effort: 'very_high',
      estimated_minutes: 360,
      cover_letter_required: true,
      portfolio_required: true,
      references_required: true,
      questions_count: 8,
      take_home: {
        required: true,
        estimated_hours: 6,
        description: 'Mandatory 5-6 hour unpaid ERP redesign assignment before first interview.'
      },
      video_required: true
    },
    hard_filter: {
      status: 'review',
      reasons: [],
      warnings: ['Very high application effort (5-6h upfront challenge + 8 essay questions + video)']
    },
    ai_evaluation: {
      score: 62,
      verdict: 'review',
      dimensions: {
        role_fit: 21,
        compensation_conditions: 21,
        location: 14,
        experience: 9,
        scope: 8,
        application_effort: -8,
        company: 3,
        risk: -6
      },
      why_it_matches: [
        'Good salary range ($2.8k–$3.4k/month) with standard 40h remote contract',
        'Enterprise ERP domain aligns with Robert’s complex workflow experience'
      ],
      concerns: [
        'VERY HIGH APPLICATION EFFORT: Demands 5–6 hour unpaid design challenge before talking to a human recruiter',
        'High candidate volume and multi-stage screening lowers return on invested application time'
      ],
      compensation_assessment: 'Good compensation, but high upfront effort penalty.',
      location_assessment: 'Remote LATAM compliant.',
      recommended_projects: ['B89', 'Autoandes'],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-010-custom',
        source_name: 'Company Portal',
        source_type: 'company_site',
        source_url: 'https://enterprisematrix.io/careers/apply-ux',
        application_url: 'https://enterprisematrix.io/careers/apply-ux',
        discovered_at: '2026-08-18T11:00:00Z'
      }
    ],
    canonical_url: 'https://enterprisematrix.io/careers/apply-ux',
    application_url: 'https://enterprisematrix.io/careers/apply-ux',
    posted_at: '2026-08-16T08:00:00Z',
    discovered_at: '2026-08-18T11:00:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  },
  {
    id: 'job-011',
    title: 'Senior Product Designer — Mobile Apps & Crypto',
    company_id: 'comp-paynova',
    company_name: 'PayNova Technologies',
    company_industry: 'Crypto Payments & Wallets',
    description: `PayNova is an all-in-one payment gateway and crypto debit card provider operating across 12 countries.

We are looking for a Senior Product Designer with experience in mobile financial apps to lead user onboarding, crypto-to-fiat conversion flows, and debit card management.

What you will do:
• Lead product discovery and high-fidelity UX/UI design in Figma for iOS & Android.
• Work with mobile engineers on micro-animations, design tokens, and usability testing.
• Optimize KYC conversion and payment success rates.

Requirements:
• 5+ years experience in Product Design, with strong experience in crypto, fintech, or web3 wallets.
• Demonstrated case studies in mobile apps (Figma prototypes).`,
    location: {
      raw: 'Remote — Latin America (USD Contractor)',
      country: null,
      region: 'Latin America',
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: ['EST or GMT-4'],
      residency_required: false,
      work_authorization_required: false,
      relocation_available: false
    },
    work_arrangement: 'remote',
    employment_type: 'contract',
    seniority: 'senior',
    salary: {
      min: 2800,
      max: 3600,
      currency: 'USD',
      period: 'month',
      raw: '$2,800 – $3,600 / month (USD Contractor)',
      source: 'range_disclosed',
      confidence: 'high'
    },
    working_hours: {
      hours_per_day: 8,
      hours_per_week: 40,
      schedule: 'Monday – Friday (Async-first)',
      timezone: 'EST',
      weekend_required: false,
      after_hours_expected: false,
      on_call: false,
      notes: 'Async communication in Slack and Notion. No weekend work.'
    },
    experience_required: '5+ years',
    requirements: {
      years_experience: { min: 5, max: null },
      degree_required: false,
      skills: ['Figma', 'Crypto Wallets', 'Mobile UX', 'Design Systems', 'Fintech', 'Prototyping'],
      languages: ['English (Fluent)', 'Spanish (Fluent)'],
      work_authorization: ['International Contractor'],
      other: ['Crypto / Fintech portfolio']
    },
    application_requirements: {
      application_url: 'https://boards.greenhouse.io/paynova/jobs/7102941',
      ats: 'Greenhouse',
      estimated_effort: 'low',
      estimated_minutes: 7,
      cover_letter_required: false,
      portfolio_required: true,
      references_required: false,
      questions_count: 3,
      take_home: { required: false, estimated_hours: null },
      video_required: false
    },
    hard_filter: {
      status: 'pass',
      reasons: [],
      warnings: []
    },
    ai_evaluation: {
      score: 91,
      verdict: 'apply',
      dimensions: {
        role_fit: 25,
        compensation_conditions: 23,
        location: 15,
        experience: 10,
        scope: 9,
        application_effort: 5,
        company: 4,
        risk: 0
      },
      why_it_matches: [
        'Direct 1:1 match with Banexcoin (Crypto exchange & wallet) and B89 (Digital neobank) projects',
        'Canonical opportunity aggregated and deduplicated from 3 distinct sources (Greenhouse, Wellfound, LinkedIn)',
        'Healthy $2,800–$3,600/month contractor compensation with low-effort Greenhouse direct application'
      ],
      concerns: [],
      compensation_assessment: 'Strong: $2,800–$3,600/mo USD for remote LATAM contractor. High alignment.',
      location_assessment: 'Fully remote with EST/GMT-4 overlap.',
      recommended_projects: ['Banexcoin', 'B89', 'BE FIT'],
      evaluated_at: '2026-08-18T13:45:10Z'
    },
    sources: [
      {
        id: 'src-011-gh',
        source_name: 'Greenhouse ATS',
        source_type: 'ats',
        source_url: 'https://boards.greenhouse.io/paynova/jobs/7102941',
        application_url: 'https://boards.greenhouse.io/paynova/jobs/7102941',
        discovered_at: '2026-08-18T13:40:00Z'
      },
      {
        id: 'src-011-wf',
        source_name: 'Wellfound',
        source_type: 'job_board',
        source_url: 'https://wellfound.com/jobs/paynova-senior-pd',
        application_url: 'https://wellfound.com/jobs/paynova-senior-pd',
        discovered_at: '2026-08-18T13:42:00Z'
      },
      {
        id: 'src-011-li',
        source_name: 'LinkedIn Jobs',
        source_type: 'job_board',
        source_url: 'https://linkedin.com/jobs/view/992018274',
        application_url: 'https://boards.greenhouse.io/paynova/jobs/7102941',
        discovered_at: '2026-08-18T13:43:00Z'
      }
    ],
    duplicate_group: {
      is_canonical: true,
      duplicate_count: 3,
      source_names: ['Greenhouse ATS', 'Wellfound', 'LinkedIn Jobs']
    },
    canonical_url: 'https://boards.greenhouse.io/paynova/jobs/7102941',
    application_url: 'https://boards.greenhouse.io/paynova/jobs/7102941',
    posted_at: '2026-08-17T20:00:00Z',
    discovered_at: '2026-08-18T13:40:00Z',
    last_seen_at: '2026-08-18T13:45:00Z',
    status: 'new'
  }
];
