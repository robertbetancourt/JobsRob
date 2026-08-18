import React, { useEffect } from 'react';
import { Search, Inbox } from 'lucide-react';
import { Job } from '../types/job';
import { FilterState } from '../hooks/useJobStore';
import { JobRow } from './JobRow';

interface JobListProps {
  jobs: Job[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
  filters,
  setFilters,
  totalCount
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const currentIndex = jobs.findIndex(j => j.id === selectedJobId);
        if (currentIndex < jobs.length - 1) onSelectJob(jobs[currentIndex + 1].id);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const currentIndex = jobs.findIndex(j => j.id === selectedJobId);
        if (currentIndex > 0) onSelectJob(jobs[currentIndex - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jobs, selectedJobId, onSelectJob]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filter toolbar */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="search-input-wrapper">
            <Search size={14} />
            <input
              type="text"
              className="search-input"
              placeholder="Search roles, companies..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>
          <select
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
          >
            <option value="score_desc">Highest AI Score</option>
            <option value="date_desc">Newest Discovered</option>
            <option value="salary_desc">Highest Comp</option>
            <option value="effort_asc">Lowest Effort</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="filter-select"
            value={filters.verdict}
            onChange={(e) => setFilters(prev => ({ ...prev, verdict: e.target.value as FilterState['verdict'] }))}
          >
            <option value="all">All Verdicts</option>
            <option value="apply">Apply</option>
            <option value="strong_match">Strong Match</option>
            <option value="review">Review</option>
            <option value="low_priority">Low Priority</option>
            <option value="skip">Skip</option>
          </select>
          <select
            className="filter-select"
            value={filters.workArrangement}
            onChange={(e) => setFilters(prev => ({ ...prev, workArrangement: e.target.value as FilterState['workArrangement'] }))}
          >
            <option value="all">All Locations</option>
            <option value="latam">LATAM / VZLA</option>
            <option value="remote">All Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select
            className="filter-select"
            value={filters.effort}
            onChange={(e) => setFilters(prev => ({ ...prev, effort: e.target.value as FilterState['effort'] }))}
          >
            <option value="all">Any Effort</option>
            <option value="low">Low Effort (≤10m)</option>
            <option value="medium">Medium Effort</option>
            <option value="high">High Effort</option>
            <option value="very_high">Take-Home Test</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '8px 16px', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Showing {jobs.length} / {totalCount} opportunities</span>
        <span>Use ↑ ↓ or J / K to navigate</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {jobs.length === 0 ? (
          <div className="empty-state-box">
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>No matches found</div>
            <div style={{ fontSize: '12px' }}>Adjust filters to see more opportunities.</div>
          </div>
        ) : (
          jobs.map(job => (
            <JobRow
              key={job.id}
              job={job}
              isSelected={job.id === selectedJobId}
              onSelect={() => onSelectJob(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
