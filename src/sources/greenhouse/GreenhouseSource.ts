import { JobSource, RawJob, SourceHealth, SourceSearchParams } from '../../types/source';

export class GreenhouseSource implements JobSource {
  id = 'greenhouse';
  name = 'Greenhouse';
  type = 'ats' as const;

  async search(params: SourceSearchParams): Promise<RawJob[]> {
    if (!params.board_token) {
      throw new Error('Greenhouse board_token is required for search');
    }

    const url = `https://boards-api.greenhouse.io/v1/boards/${params.board_token}/jobs?content=true`;
    const fetchedAt = new Date().toISOString();

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Greenhouse API returned ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || !data.jobs || !Array.isArray(data.jobs)) {
        return [];
      }

      return data.jobs.map((job: any): RawJob => {
        return {
          source_id: this.id,
          source_name: this.name,
          source_type: 'job_board',
          external_id: String(job.id),
          company_name: data.name || params.board_token,
          title: job.title,
          source_url: job.absolute_url,
          raw_payload: job,
          fetched_at: fetchedAt,
          source_updated_at: job.updated_at
        };
      });
    } catch (error) {
      console.error(`Failed to fetch Greenhouse jobs for ${params.board_token}:`, error);
      return [];
    }
  }

  async healthCheck(): Promise<SourceHealth> {
    try {
      // Fetch a known board (e.g. greenhouse's own board) to check if API is alive
      const start = Date.now();
      const response = await fetch('https://boards-api.greenhouse.io/v1/boards/greenhouse/jobs');
      const latency = Date.now() - start;

      if (response.ok) {
        return {
          status: 'healthy',
          last_success: new Date().toISOString(),
          last_failure: null,
          latency_ms: latency
        };
      } else {
        return {
          status: 'failed',
          last_success: null,
          last_failure: new Date().toISOString(),
          error_message: `HTTP ${response.status}`,
          latency_ms: latency
        };
      }
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
