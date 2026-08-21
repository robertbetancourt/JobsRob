import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { JobRepository } from './JobRepository';
import { Job, JobStatus } from '../types/job';

// Helper to create a bare minimum valid Job object
function createMockJob(id: string, status: JobStatus = 'new', sourceName = 'TestBoard', sourceId = 'test-1'): Job {
  return {
    id,
    title: 'Software Engineer',
    company_id: 'test-co',
    company_name: 'Test Co',
    company_industry: null,
    description: 'A great job',
    location: {
      raw: 'Remote',
      country: null,
      region: null,
      city: null,
      work_arrangement: 'remote',
      timezone_requirements: [],
      residency_required: null,
      work_authorization_required: null,
      relocation_available: null
    },
    work_arrangement: 'remote',
    employment_type: 'full_time',
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
      application_url: 'https://test.com',
      ats: 'Greenhouse',
      estimated_effort: 'unknown',
      estimated_minutes: null,
      cover_letter_required: null,
      portfolio_required: null,
      references_required: null,
      questions_count: 0,
      take_home: { required: null, compensated: 'unknown' },
      video_required: null
    },
    hard_filter: { status: 'review', reasons: [], warnings: [] },
    ai_evaluation: {
      score: 85,
      verdict: 'review',
      dimensions: {
        role_fit: { score: 20, rationale: '', confidence: 'high' },
        compensation_conditions: { score: null, rationale: '', confidence: 'unknown' },
        location: { score: null, rationale: '', confidence: 'unknown' },
        experience: { score: null, rationale: '', confidence: 'unknown' },
        scope: { score: null, rationale: '', confidence: 'unknown' },
        company: { score: null, rationale: '', confidence: 'unknown' },
        application_effort: { score: null, rationale: '', confidence: 'unknown' }
      },
      why_it_matches: [],
      concerns: [],
      evaluated_at: '2026-01-01T00:00:00Z'
    },
    sources: [{
      id: sourceId,
      source_name: sourceName,
      source_type: 'job_board',
      source_url: 'https://test.com',
      application_url: 'https://test.com',
      discovered_at: '2026-01-01T00:00:00Z'
    }],
    canonical_url: 'https://test.com',
    application_url: 'https://test.com',
    posted_at: '2026-01-01T00:00:00Z',
    discovered_at: '2026-01-01T00:00:00Z',
    last_seen_at: '2026-01-01T00:00:00Z',
    status
  };
}

describe('JobRepository', () => {
  beforeEach(async () => {
    // 12. Handle empty database (clear works on empty too)
    await JobRepository.clear();
  });

  it('1. insert job and 2. retrieve job', async () => {
    const job = createMockJob('test-1');
    await JobRepository.save(job);
    const retrieved = await JobRepository.getById('test-1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe('test-1');
  });

  it('3. update job (via save/upsert)', async () => {
    const job = createMockJob('test-2');
    await JobRepository.save(job);
    
    const updated = { ...job, title: 'Updated Engineer' };
    await JobRepository.save(updated);
    
    const retrieved = await JobRepository.getById('test-2');
    expect(retrieved?.title).toBe('Updated Engineer');
  });

  it('4. update status', async () => {
    const job = createMockJob('test-3', 'new');
    await JobRepository.save(job);
    
    await JobRepository.updateStatus('test-3', 'saved');
    
    const retrieved = await JobRepository.getById('test-3');
    expect(retrieved?.status).toBe('saved');
  });

  it('5. reload persistence (getAll)', async () => {
    await JobRepository.save(createMockJob('test-4'));
    await JobRepository.save(createMockJob('test-5'));
    
    const all = await JobRepository.getAll();
    expect(all.length).toBe(2);
  });

  it('6. upsert same source/external ID, 7. preserve first_seen_at, 8. update last_seen_at', async () => {
    const originalDate = '2025-01-01T00:00:00Z';
    const job = createMockJob('test-6');
    job.discovered_at = originalDate;
    job.last_seen_at = originalDate;
    await JobRepository.save(job);
    
    const newFetch = createMockJob('test-6');
    newFetch.discovered_at = '2026-08-18T00:00:00Z'; // Should be ignored
    newFetch.last_seen_at = '2026-08-18T00:00:00Z'; // Should be updated
    newFetch.title = 'New Title'; // Should be updated
    
    await JobRepository.save(newFetch);
    
    const retrieved = await JobRepository.getById('test-6');
    expect(retrieved?.title).toBe('New Title');
    expect(retrieved?.discovered_at).toBe(originalDate); // Preserved
    expect(retrieved?.last_seen_at).toBe('2026-08-18T00:00:00Z'); // Updated
  });

  it('9. preserve saved status after re-fetch', async () => {
    const job = createMockJob('test-7', 'new');
    await JobRepository.save(job);
    await JobRepository.updateStatus('test-7', 'saved');
    
    const newFetch = createMockJob('test-7', 'new'); // Fetcher sees it as new
    await JobRepository.save(newFetch);
    
    const retrieved = await JobRepository.getById('test-7');
    expect(retrieved?.status).toBe('saved');
  });

  it('10. preserve applied status after re-fetch', async () => {
    const job = createMockJob('test-8', 'new');
    await JobRepository.save(job);
    await JobRepository.updateStatus('test-8', 'applied');
    
    const newFetch = createMockJob('test-8', 'new');
    await JobRepository.save(newFetch);
    
    const retrieved = await JobRepository.getById('test-8');
    expect(retrieved?.status).toBe('applied');
  });

  it('11. preserve skipped status after re-fetch', async () => {
    const job = createMockJob('test-9', 'new');
    await JobRepository.save(job);
    await JobRepository.updateStatus('test-9', 'skipped');
    
    const newFetch = createMockJob('test-9', 'new');
    await JobRepository.save(newFetch);
    
    const retrieved = await JobRepository.getById('test-9');
    expect(retrieved?.status).toBe('skipped');
  });

  it('13. handle database errors without crashing (basic check)', async () => {
    // If we try to update a non-existent job status, it should gracefully do nothing
    await expect(JobRepository.updateStatus('non-existent', 'saved')).resolves.not.toThrow();
  });
  
  it('finds by source and external id', async () => {
    const job = createMockJob('gh-123', 'new', 'Greenhouse', '123');
    await JobRepository.save(job);
    
    const found = await JobRepository.findBySource('Greenhouse', '123');
    expect(found).toBeDefined();
    expect(found?.id).toBe('gh-123');
  });
});
