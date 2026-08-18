export type WorkArrangement = 'remote' | 'hybrid' | 'onsite';
export type EmploymentType = 'full_time' | 'contract' | 'freelance' | 'part_time';
export type JobStatus = 'new' | 'saved' | 'skipped' | 'applied';
export type Verdict = 'apply' | 'review' | 'skip' | 'save';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';
export type ApplicationStatus = 'preparing' | 'applied' | 'interview' | 'challenge' | 'offer' | 'rejected';

export interface Location {
  raw: string;
  country: string | null;
  region: string | null;
  city: string | null;
  work_arrangement: WorkArrangement;
  timezone_requirements: string[];
  residency_required: boolean;
  work_authorization_required: boolean;
  relocation_available: boolean;
}

export interface Salary {
  min: number | null;
  max: number | null;
  currency: string;
  period: 'year' | 'month' | 'hour';
  raw: string;
  source: 'range_disclosed' | 'inferred' | 'external_estimate' | 'unknown';
  confidence: ConfidenceLevel;
}

export interface WorkingHours {
  hours_per_day: number | null;
  hours_per_week: number | null;
  schedule: string | null;
  timezone: string | null;
  weekend_required: 'no' | 'occasional_compensated' | 'frequent_uncompensated' | 'unknown';
  after_hours_expected: boolean;
  on_call: boolean;
  notes: string | null;
}

export interface TakeHomeAssignment {
  required: boolean;
  estimated_hours?: number | null;
  description?: string;
  compensated: boolean | 'unknown';
}

export interface ApplicationRequirements {
  application_url: string;
  ats: string;
  estimated_effort: 'low' | 'medium' | 'high' | 'very_high' | 'unknown';
  estimated_minutes: number | null;
  cover_letter_required: boolean;
  portfolio_required: boolean;
  references_required: boolean;
  questions_count: number;
  take_home: TakeHomeAssignment;
  video_required: boolean;
}

export type HardFilterReason = 
  | 'equity_only' 
  | 'unpaid' 
  | 'us_w2_only' 
  | 'onsite_required' 
  | 'extreme_hours' 
  | 'mandatory_weekends' 
  | 'clear_scam'
  | 'unpaid_take_home_extreme';

export interface HardFilter {
  status: 'pass' | 'review' | 'fail';
  reasons: HardFilterReason[];
  warnings: string[];
}

export interface DimensionEvaluation {
  score: number | null;
  rationale: string;
  confidence: ConfidenceLevel;
}

export interface AIEvaluation {
  score: number; // Must strictly equal sum of dimension scores (ignoring nulls)
  verdict: Verdict;
  dimensions: {
    role_fit: DimensionEvaluation; // 25
    compensation_conditions: DimensionEvaluation; // 25
    location: DimensionEvaluation; // 15
    experience: DimensionEvaluation; // 10
    scope: DimensionEvaluation; // 10
    company: DimensionEvaluation; // 10
    application_effort: DimensionEvaluation; // 5
  };
  why_it_matches: string[];
  concerns: string[];
  evidence?: Array<{ quote: string; context: string }>;
  unknowns?: string[];
  evaluated_at: string; // ISO timestamp
}

export interface Source {
  id: string;
  source_name: string;
  source_type: 'job_board' | 'company_site' | 'referral' | 'aggregator';
  source_url: string;
  application_url: string | null;
  discovered_at: string;
}

export interface DuplicateGroup {
  is_canonical: boolean;
  duplicate_count: number;
  source_names: string[];
}


export interface DataConflict {
  field: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  company_id: string;
  company_name: string;
  company_industry: string | null;
  description: string;
  location: Location;
  work_arrangement: WorkArrangement;
  employment_type: EmploymentType;
  seniority: string;
  salary: Salary;
  working_hours: WorkingHours;
  experience_required: string;
  requirements: {
    years_experience: { min: number | null; max: number | null };
    degree_required: boolean;
    skills: string[];
    languages: string[];
    work_authorization: string[];
    other: string[];
  };
  application_requirements: ApplicationRequirements;
  hard_filter: HardFilter;
  ai_evaluation: AIEvaluation;
  sources: Source[];
  conflicts?: DataConflict[];
  duplicate_group?: DuplicateGroup;
  canonical_url: string;
  application_url: string;
  posted_at: string; // ISO
  discovered_at: string; // ISO
  last_seen_at: string; // ISO
  status: JobStatus;
}

export interface JobApplication {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  status: ApplicationStatus;
  applied_at: string;
  last_updated_at: string;
  notes: string;
  next_action?: string;
  next_action_date?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  region: string;
  description: string;
  why_interesting: string;
  open_roles_count: number;
  careers_url: string;
  saved: boolean;
}

export type HumanDecision = 'apply' | 'save' | 'skip' | 'review_later';
export type RejectionReason = 
  | 'compensation' 
  | 'working_hours' 
  | 'location' 
  | 'work_authorization' 
  | 'scope' 
  | 'application_effort' 
  | 'seniority' 
  | 'company' 
  | 'suspicious' 
  | 'not_interesting' 
  | 'other';

export interface ScanStats {
  total_scanned: number;
  new_opportunities: number;
  strong_matches: number;
  worth_reviewing: number;
  skipped_automatically: number;
  last_scan_at: string; // ISO
}
