import { JobApplication } from '../types/job';

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-001',
    job_id: 'job-001',
    job_title: 'Senior Product Designer',
    company_name: 'FinScale Labs',
    location: 'Remote — Latin America / Americas',
    salary_raw: '$3,200 – $4,200 / month',
    status: 'preparing',
    applied_at: '2026-08-18T14:00:00Z',
    next_action: 'Tailor B89 & Banexcoin case studies highlighting treasury flows',
    next_action_date: '2026-08-19',
    application_url: 'https://boards.greenhouse.io/finscalelabs/jobs/4820194',
    notes: 'High alignment with fintech experience. Reviewing 3 application questions.',
    history: [
      {
        status: 'saved',
        timestamp: '2026-08-18T13:48:00Z',
        note: 'Saved from Radar scan'
      },
      {
        status: 'preparing',
        timestamp: '2026-08-18T14:00:00Z',
        note: 'Moved to preparing for submission'
      }
    ]
  },
  {
    id: 'app-002',
    job_id: 'job-011',
    job_title: 'Senior Product Designer — Mobile Apps & Crypto',
    company_name: 'PayNova Technologies',
    location: 'Remote — Latin America (USD Contractor)',
    salary_raw: '$2,800 – $3,600 / month',
    status: 'applied',
    applied_at: '2026-08-18T11:20:00Z',
    next_action: 'Follow up with recruiter if no response within 5 days',
    next_action_date: '2026-08-23',
    application_url: 'https://boards.greenhouse.io/paynova/jobs/7102941',
    notes: 'Submitted via Greenhouse direct link. Included live Figma prototypes of Banexcoin mobile wallet.',
    history: [
      {
        status: 'applied',
        timestamp: '2026-08-18T11:20:00Z',
        note: 'Submitted application on Greenhouse'
      }
    ]
  }
];
