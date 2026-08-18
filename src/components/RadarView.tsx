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
        <div className="scan-metrics-bar">
          <div className="stats-group">
            <div className="stat-item">
              <span className="stat-val score-strong" style={{ marginRight: '4px' }}>{stats.strong_matches}</span>
              <span>Fuerte</span>
            </div>
            <div className="stat-item">
              <span className="stat-val" style={{ marginRight: '4px' }}>{stats.worth_reviewing}</span>
              <span>Revisar</span>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Última búsqueda: {new Date(stats.last_scan_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

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
