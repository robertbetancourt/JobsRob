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
  // Keyboard navigation support (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const currentIndex = jobs.findIndex(j => j.id === selectedJobId);
        if (currentIndex < jobs.length - 1) {
          onSelectJob(jobs[currentIndex + 1].id);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const currentIndex = jobs.findIndex(j => j.id === selectedJobId);
        if (currentIndex > 0) {
          onSelectJob(jobs[currentIndex - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jobs, selectedJobId, onSelectJob]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Filter toolbar */}
      <div className="filter-toolbar">
        <div className="filter-search-row">
          <div className="search-input-wrapper">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search by title, company, skills (e.g. Fintech, Figma)..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>

          <select
            className="select-filter"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
            title="Sort jobs"
          >
            <option value="score_desc">Highest AI Score</option>
            <option value="date_desc">Newest Discovered</option>
            <option value="salary_desc">Highest Compensation</option>
            <option value="effort_asc">Lowest Application Effort</option>
          </select>
        </div>

        {/* Verdict Pills */}
        <div className="filter-pills-row">
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '2px' }}>Verdict:</span>
          
          {(['all', 'apply', 'strong_match', 'review', 'low_priority', 'skip'] as const).map(v => (
            <button
              key={v}
              className={`filter-pill ${filters.verdict === v ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, verdict: v }))}
            >
              {v === 'all' ? 'All Roles' : v.replace('_', ' ')}
            </button>
          ))}

          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px', marginRight: '2px' }}>Location:</span>
          <select
            className="select-filter"
            value={filters.workArrangement}
            onChange={(e) => setFilters(prev => ({ ...prev, workArrangement: e.target.value as FilterState['workArrangement'] }))}
          >
            <option value="all">All Locations</option>
            <option value="latam">LATAM / Venezuela</option>
            <option value="remote">All Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            className="select-filter"
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

      {/* List count summary */}
      <div style={{ padding: '6px 14px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)', fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Showing <strong>{jobs.length}</strong> of {totalCount} opportunities</span>
        <span style={{ fontSize: '10.5px' }}>Tip: Use ↑ ↓ or J / K keys to navigate</span>
      </div>

      {/* Jobs Scroll list */}
      <div className="job-list-scroll">
        {jobs.length === 0 ? (
          <div className="empty-state-box">
            <Inbox size={32} />
            <div className="empty-state-title">No matching opportunities</div>
            <div className="empty-state-desc">
              Try adjusting your search keywords or broadening verdict and effort filters.
            </div>
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
