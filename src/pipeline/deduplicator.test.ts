import { describe, it, expect } from 'vitest';
import { isDuplicate, mergeJobs, deduplicateBatch } from './deduplicator';
import { Job } from '../types/job';

function createMockJob(overrides: Partial<Job> = {}): Job {
  return {
    id: 'mock-1',
    title: 'Software Engineer',
    company_id: 'comp-1',
    company_name: 'Tech Corp',
    company_industry: null,
    description: 'We are looking for a Software Engineer to join our core product team. You will be building scalable systems...',
    location: { raw: 'Remote', country: null, region: null, city: null, work_arrangement: 'remote', timezone_requirements: [], residency_required: null, work_authorization_required: null, relocation_available: null },
    work_arrangement: 'remote',
    employment_type: 'full_time',
    seniority: 'unknown',
    salary: { min: null, max: null, currency: 'USD', period: 'unknown', raw: '', source: 'unknown', confidence: 'unknown' },
    working_hours: { hours_per_day: null, hours_per_week: null, schedule: null, timezone: null, weekend_required: 'unknown', after_hours_expected: null, on_call: null, notes: null },
    experience_required: 'unknown',
    requirements: { years_experience: { min: null, max: null }, degree_required: null, skills: [], languages: [], work_authorization: [], other: [] },
    application_requirements: { application_url: 'https://example.com/apply', ats: 'Unknown', estimated_effort: 'unknown', estimated_minutes: null, cover_letter_required: null, portfolio_required: null, references_required: null, questions_count: 0, take_home: { required: null, compensated: 'unknown' }, video_required: null },
    hard_filter: { status: 'pass', reasons: [], warnings: [] },
    ai_evaluation: { score: 0, verdict: 'review', dimensions: {} as any, why_it_matches: [], concerns: [], evaluated_at: '2026-08-18T00:00:00Z' },
    sources: [{ id: 'src-1', source_name: 'Greenhouse', source_type: 'job_board', source_url: 'https://example.com/1', application_url: 'https://example.com/apply', discovered_at: '2026-08-18T00:00:00Z' }],
    canonical_url: 'https://example.com/apply',
    application_url: 'https://example.com/apply',
    posted_at: '2026-08-18T00:00:00Z',
    discovered_at: '2026-08-18T00:00:00Z',
    last_seen_at: '2026-08-18T00:00:00Z',
    status: 'new',
    ...overrides
  };
}

describe('Job Deduplicator', () => {
  it('identifies exact application URL match as duplicate', () => {
    const job1 = createMockJob({ id: '1', application_url: 'https://boards.greenhouse.io/techcorp/jobs/12345' });
    const job2 = createMockJob({ id: '2', application_url: 'https://boards.greenhouse.io/techcorp/jobs/12345?gh_src=jobicy' });
    
    expect(isDuplicate(job1, job2)).toBe(true);
  });

  it('identifies identical company, title, remote status and similar description as duplicate', () => {
    const job1 = createMockJob({ application_url: 'https://example.com/a' });
    const job2 = createMockJob({ 
      application_url: 'https://example.com/b', 
      description: 'We are looking for a Software Engineer to join our core product team. You will be building scalable systems and testing...' 
    });
    
    expect(isDuplicate(job1, job2)).toBe(true);
  });

  it('does NOT identify same company/title but different location arrangement as duplicate', () => {
    const job1 = createMockJob({ work_arrangement: 'remote', application_url: 'https://example.com/a' });
    const job2 = createMockJob({ work_arrangement: 'onsite', application_url: 'https://example.com/b' });
    
    expect(isDuplicate(job1, job2)).toBe(false);
  });

  it('does NOT identify same company/title/location but different requisitions as duplicate', () => {
    const job1 = createMockJob({ description: 'Frontend engineer for marketing site.', application_url: 'https://example.com/a' });
    const job2 = createMockJob({ description: 'Backend engineer for payment processing.', application_url: 'https://example.com/b' });
    
    expect(isDuplicate(job1, job2)).toBe(false);
  });

  it('does NOT identify unrelated jobs with similar titles as duplicate', () => {
    const job1 = createMockJob({ company_name: 'Tech Corp', application_url: 'https://example.com/a' });
    const job2 = createMockJob({ company_name: 'Another Corp', application_url: 'https://example.com/b' });
    
    expect(isDuplicate(job1, job2)).toBe(false);
  });

  it('merges duplicate jobs retaining provenance', () => {
    const job1 = createMockJob({ 
      id: '1', 
      discovered_at: '2026-08-18T10:00:00Z', 
      last_seen_at: '2026-08-18T10:00:00Z',
      sources: [{ id: 'src-1', source_name: 'Greenhouse', source_type: 'job_board', source_url: 'https://example.com/1', application_url: null, discovered_at: '2026-08-18T10:00:00Z' }]
    });
    const job2 = createMockJob({ 
      id: '2', 
      discovered_at: '2026-08-18T08:00:00Z', // older
      last_seen_at: '2026-08-18T12:00:00Z', // newer
      sources: [{ id: 'src-2', source_name: 'Jobicy', source_type: 'aggregator', source_url: 'https://jobicy.com/1', application_url: null, discovered_at: '2026-08-18T08:00:00Z' }]
    });

    const merged = mergeJobs(job1, job2);
    
    expect(merged.id).toBe('1');
    expect(merged.sources.length).toBe(2);
    expect(merged.duplicate_group?.duplicate_count).toBe(2);
    expect(merged.duplicate_group?.source_names).toContain('Greenhouse');
    expect(merged.duplicate_group?.source_names).toContain('Jobicy');
    expect(merged.discovered_at).toBe('2026-08-18T08:00:00Z');
    expect(merged.last_seen_at).toBe('2026-08-18T12:00:00Z');
  });

  it('deduplicateBatch works correctly across new and existing jobs', () => {
    const existing = [
      createMockJob({ id: 'db-1', application_url: 'https://example.com/apply' })
    ];
    const newJobs = [
      createMockJob({ id: 'new-1', application_url: 'https://example.com/apply', sources: [{ id: 'src-2', source_name: 'Lever', source_type: 'job_board', source_url: 'url', application_url: null, discovered_at: '1' }] }),
      createMockJob({ id: 'new-2', title: 'Data Scientist', application_url: 'https://example.com/other' })
    ];

    const result = deduplicateBatch(newJobs, existing);
    
    expect(result.length).toBe(2);
    const mergedDb1 = result.find(j => j.id === 'db-1');
    expect(mergedDb1).toBeDefined();
    expect(mergedDb1?.sources.length).toBe(2);

    const new2 = result.find(j => j.id === 'new-2');
    expect(new2).toBeDefined();
    expect(new2?.duplicate_group?.duplicate_count).toBe(1);
  });
});
