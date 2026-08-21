import { JobSource, RawJob, SourceSearchParams, SourceHealth } from '../../types/source';

export class AshbySource implements JobSource {
  id = 'ashby';
  name = 'Ashby';
  type = 'ats' as const;

  async search(params: SourceSearchParams): Promise<RawJob[]> {
    if (!params.board_token) {
      throw new Error("AshbySource requires a board_token to fetch company postings.");
    }

    const url = `https://api.ashbyhq.com/posting-api/job-board/${params.board_token}?includeCompensation=true`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from Ashby`);
      }
      const data = await response.json();
      
      const now = new Date().toISOString();

      if (!data.jobs || !Array.isArray(data.jobs)) {
        return [];
      }

      return data.jobs.map((job: any): RawJob => ({
        source_id: this.id,
        source_name: this.name,
        source_type: 'job_board',
        external_id: job.id,
        company_name: params.board_token || 'Unknown Company',
        title: job.title || 'Unknown Title',
        source_url: job.jobUrl,
        raw_payload: job,
        fetched_at: now,
        source_updated_at: job.publishedAt ? new Date(job.publishedAt).toISOString() : undefined
      }));
    } catch (error) {
      console.error(`Failed to fetch Ashby jobs for ${params.board_token}:`, error);
      return [];
    }
  }

  async healthCheck(): Promise<SourceHealth> {
    try {
      // Test against a known public board, e.g. ashby
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/ashby?includeCompensation=true`);
      if (res.ok) {
        return {
          status: 'healthy',
          last_success: new Date().toISOString(),
          last_failure: null
        };
      }
      throw new Error(`HTTP ${res.status}`);
    } catch (error: any) {
      return {
        status: 'failed',
        last_success: null,
        last_failure: new Date().toISOString(),
        error_message: error.message
      };
    }
  }
}
