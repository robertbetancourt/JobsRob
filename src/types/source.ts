export interface RawJob {
  source_id: string; // The ID of the source adapter, e.g., 'greenhouse'
  source_name: string; // Display name, e.g., 'Greenhouse'
  source_type: 'job_board' | 'company_site' | 'referral' | 'aggregator';
  external_id: string; // The original ID from the source
  company_name: string;
  title: string;
  source_url: string; // The canonical application URL
  raw_payload: any; // The complete original JSON or response payload
  fetched_at: string; // ISO string
  source_updated_at?: string; // ISO string, if available
}

export interface SourceHealth {
  status: 'healthy' | 'degraded' | 'failed';
  last_success: string | null; // ISO string
  last_failure: string | null; // ISO string
  error_message?: string;
  latency_ms?: number;
}

export interface SourceSearchParams {
  board_token?: string; // For company-specific boards like Greenhouse/Lever
  query?: string;
  location?: string;
  limit?: number;
}

export interface JobSource {
  id: string;
  name: string;
  type: 'ats' | 'aggregator' | 'career_site' | 'specialized';

  search(params: SourceSearchParams): Promise<RawJob[]>;
  getJob?(id: string, params?: SourceSearchParams): Promise<RawJob | null>;
  healthCheck?(): Promise<SourceHealth>;
}
