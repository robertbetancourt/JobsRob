export type WorkArrangement = 'remote' | 'hybrid' | 'onsite' | 'unknown';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary' | 'freelance' | 'unknown';
export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'unknown';
export type ApplicationEffort = 'low' | 'medium' | 'high' | 'very_high' | 'unknown';
export type AIVerdict = 'apply' | 'strong_match' | 'review' | 'low_priority' | 'skip';
export type HardFilterStatus = 'pass' | 'fail' | 'review' | 'unknown';
export type HumanDecision = 'apply' | 'save' | 'skip' | 'review_later';
export type RejectionReason = 
  | 'compensation'
  | 'location'
  | 'work_authorization'
  | 'working_hours'
  | 'scope'
  | 'seniority'
  | 'application_effort'
  | 'company'
  | 'suspicious'
  | 'not_interesting'
  | 'other';

export type ApplicationStatus = 
  | 'saved'
  | 'preparing'
  | 'applied'
  | 'interview'
  | 'challenge'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface LocationInfo {
  raw: string;
  country: string | null;
  region: string | null;
  city: string | null;
  work_arrangement: WorkArrangement;
  timezone_requirements?: string[];
  residency_required?: boolean;
  work_authorization_required?: boolean;
  relocation_available?: boolean;
}

export interface SalaryInfo {
  min: number | null;
  max: number | null;
  currency: string | null;
  period: 'month' | 'year' | 'hour' | null;
  raw: string;
  source?: 'job_description' | 'range_disclosed' | 'undisclosed' | 'ai_estimate';
  confidence?: 'high' | 'medium' | 'low';
}

export interface WorkingHoursInfo {
  hours_per_day: number | null;
  hours_per_week: number | null;
  schedule: string | null;
  timezone: string | null;
  weekend_required: boolean;
  after_hours_expected: boolean;
  on_call: boolean;
  notes: string | null;
}

export interface RequirementsInfo {
  years_experience: {
    min: number | null;
    max: number | null;
  };
  degree_required: boolean;
  skills: string[];
  languages: string[];
  work_authorization: string[];
  other: string[];
}

export interface ApplicationRequirementsInfo {
  application_url: string;
  ats: string;
  estimated_effort: ApplicationEffort;
  estimated_minutes: number | null;
  cover_letter_required: boolean;
  portfolio_required: boolean;
  references_required: boolean;
  questions_count: number;
  take_home: {
    required: boolean;
    estimated_hours: number | null;
    description?: string;
  };
  video_required: boolean;
}

export interface HardFilterResult {
  status: HardFilterStatus;
  reasons: string[];
  warnings: string[];
}

export interface AIEvaluationDimensions {
  role_fit: number;             // max 25
  compensation_conditions: number; // max 25
  location: number;             // max 15
  experience: number;           // max 10
  scope: number;                // max 10
  application_effort: number;   // max 5
  company: number;              // max 5
  risk: number;                 // max 5
}

export interface AIEvaluation {
  score: number; // 0 - 100
  verdict: AIVerdict;
  dimensions: AIEvaluationDimensions;
  why_it_matches: string[];
  concerns: string[];
  compensation_assessment: string;
  location_assessment: string;
  recommended_projects: string[];
  evaluated_at: string;
}

export interface JobSource {
  id: string;
  source_name: string;
  source_type: 'ats' | 'job_board' | 'company_site' | 'aggregator';
  source_url: string;
  application_url: string;
  discovered_at: string;
}

export interface HumanReview {
  decision: HumanDecision | null;
  reason?: RejectionReason | null;
  notes?: string;
  decided_at?: string;
}

export interface Job {
  id: string;
  title: string;
  company_id: string;
  company_name: string;
  company_logo?: string;
  company_industry?: string;
  description: string;
  location: LocationInfo;
  work_arrangement: WorkArrangement;
  employment_type: EmploymentType;
  seniority: SeniorityLevel;
  salary: SalaryInfo;
  working_hours?: WorkingHoursInfo;
  experience_required: string;
  requirements: RequirementsInfo;
  application_requirements: ApplicationRequirementsInfo;
  hard_filter: HardFilterResult;
  ai_evaluation: AIEvaluation;
  sources: JobSource[];
  duplicate_group?: {
    is_canonical: boolean;
    duplicate_count: number;
    source_names: string[];
  };
  canonical_url: string;
  application_url: string;
  posted_at: string | null;
  discovered_at: string;
  last_seen_at: string;
  human_review?: HumanReview;
  status: 'new' | 'reviewed' | 'saved' | 'skipped' | 'applied';
}

export interface Company {
  id: string;
  name: string;
  website: string;
  careers_url: string;
  industry: string;
  region: string;
  description: string;
  why_interesting: string;
  saved: boolean;
  open_roles_count: number;
  last_checked_at: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  location: string;
  salary_raw: string;
  status: ApplicationStatus;
  applied_at: string;
  next_action?: string | null;
  next_action_date?: string | null;
  application_url: string;
  notes: string;
  history: {
    status: ApplicationStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface ScanStats {
  total_found: number;
  duplicates_removed: number;
  incompatible_removed: number;
  evaluated: number;
  strong_matches: number;
  worth_reviewing: number;
  low_priority: number;
  last_scan_at: string;
}
