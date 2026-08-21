import { JobSource, RawJob, SourceSearchParams, SourceHealth } from '../../types/source';

export class LeverSource implements JobSource {
  id = 'lever';
  name = 'Lever';
  type = 'ats' as const;

  async search(params: SourceSearchParams): Promise<RawJob[]> {
    if (!params.board_token) {
      throw new Error("LeverSource requires a board_token to fetch company postings.");
    }

    const url = `https://api.lever.co/v0/postings/${params.board_token}?mode=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from Lever`);
      }
      const data = await response.json();
      
      const now = new Date().toISOString();

      return data.map((job: any): RawJob => ({
        source_id: this.id,
        source_name: this.name,
        source_type: 'job_board',
        external_id: job.id,
        company_name: params.board_token || 'Unknown Company',
        title: job.text || 'Unknown Title',
        source_url: job.hostedUrl,
        raw_payload: job,
        fetched_at: now,
        source_updated_at: job.createdAt ? new Date(job.createdAt).toISOString() : undefined
      }));
    } catch (error) {
      console.error(`Failed to fetch Lever jobs for ${params.board_token}:`, error);
      return [];
    }
  }

  async healthCheck(): Promise<SourceHealth> {
    try {
      // Test against a known public board, e.g. spotify
      const res = await fetch(`https://api.lever.co/v0/postings/spotify?mode=json`);
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
