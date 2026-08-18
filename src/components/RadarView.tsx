import React from 'react';
import { 
  Job, 
  ScanStats, 
  HumanDecision, 
  RejectionReason 
} from '../types/job';
import { FilterState } from '../hooks/useJobStore';
import { JobList } from './JobList';
import { JobDetail } from './JobDetail';

interface RadarViewProps {
  jobs: Job[];
  totalJobsCount: number;
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  selectedJob: Job | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  stats: ScanStats;
  onDecision: (jobId: string, decision: HumanDecision, reason?: RejectionReason, notes?: string) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({
  jobs,
  totalJobsCount,
  selectedJobId,
  onSelectJob,
  selectedJob,
  filters,
  setFilters,
  stats,
  onDecision
}) => {
  return (
    <div className="radar-view-container">
      {/* Left List Pane */}
      <div className="radar-left-pane">
        {/* Metrics Banner */}
        <div className="scan-metrics-bar">
          <div className="stats-group">
            <div className="stat-item">
              <span>Radar:</span>
              <span className="stat-val highlight">{stats.strong_matches} Strong</span>
            </div>
            <div className="stat-item">
              <span>Review:</span>
              <span className="stat-val">{stats.worth_reviewing}</span>
            </div>
            <div className="stat-item">
              <span>Deduplicated:</span>
              <span className="stat-val">{stats.duplicates_removed}</span>
            </div>
          </div>

          <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
            Last scan: {new Date(stats.last_scan_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Job List Component */}
        <JobList
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={onSelectJob}
          filters={filters}
          setFilters={setFilters}
          totalCount={totalJobsCount}
        />
      </div>

      {/* Right Detail Pane */}
      <div className="radar-right-pane">
        <JobDetail
          job={selectedJob}
          onDecision={onDecision}
        />
      </div>
    </div>
  );
};
