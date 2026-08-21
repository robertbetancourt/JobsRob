import { JobApplication } from '../types/job';

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-001',
    job_id: 'job-001',
    job_title: 'Senior Product Designer',
    company_name: 'FinScale Labs',
    status: 'preparing',
    applied_at: '2026-08-18T14:00:00Z',
    last_updated_at: new Date().toISOString(),
    next_action: 'Tailor B89 & Banexcoin case studies highlighting treasury flows',
    next_action_date: '2026-08-19',
    notes: 'High alignment with fintech experience. Reviewing 3 application questions.',
  },
  {
    id: 'app-002',
    job_id: 'job-011',
    job_title: 'Senior Product Designer — Mobile Apps & Crypto',
    company_name: 'PayNova Technologies',
    status: 'applied',
    applied_at: '2026-08-18T11:20:00Z',
    last_updated_at: new Date().toISOString(),
    next_action: 'Follow up with recruiter if no response within 5 days',
    next_action_date: '2026-08-23',
    notes: 'Submitted via Greenhouse direct link. Included live Figma prototypes of Banexcoin mobile wallet.',
  }
];
