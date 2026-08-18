import React from 'react';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Layers, 
  AlertTriangle, 
  Bookmark, 
  Send 
} from 'lucide-react';
import { Job, AIVerdict } from '../types/job';

interface JobRowProps {
  job: Job;
  isSelected: boolean;
  onSelect: () => void;
}

function getVerdictLabel(verdict: AIVerdict): string {
  switch (verdict) {
    case 'apply': return 'Apply';
    case 'strong_match': return 'Strong';
    case 'review': return 'Review';
    case 'low_priority': return 'Low';
    case 'skip': return 'Skip';
    default: return verdict;
  }
}

export const JobRow: React.FC<JobRowProps> = ({ job, isSelected, onSelect }) => {
  const { ai_evaluation, salary, location, application_requirements, duplicate_group, hard_filter } = job;
  
  return (
    <div 
      className={`job-row ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect();
      }}
    >
      <div className="job-row-top">
        <div className="job-row-title-group">
          <div className="job-row-title" title={job.title}>{job.title}</div>
          <div className="job-row-company">
            <span>{job.company_name}</span>
            {job.company_industry && (
              <>
                <span style={{ color: 'var(--text-dim)' }}>·</span>
                <span style={{ color: 'var(--text-muted)' }}>{job.company_industry}</span>
              </>
            )}
          </div>
        </div>

        <div className={`score-badge verdict-${ai_evaluation.verdict}`}>
          <span>{ai_evaluation.score}</span>
          <span style={{ fontSize: '10px', opacity: 0.85 }}>{getVerdictLabel(ai_evaluation.verdict)}</span>
        </div>
      </div>

      <div className="job-row-tags">
        {/* Location Tag */}
        <span className="job-tag">
          <MapPin size={11} />
          <span>{location.raw}</span>
        </span>

        {/* Salary Tag */}
        <span className="job-tag salary">
          <DollarSign size={11} />
          <span>{salary.raw}</span>
        </span>

        {/* Experience */}
        <span className="job-tag">
          <span>{job.experience_required}</span>
        </span>

        {/* Effort */}
        <span className={`job-tag effort-${application_requirements.estimated_effort}`}>
          <Clock size={11} />
          <span>Effort: {application_requirements.estimated_effort}</span>
        </span>

        {/* Multi-Source Duplicate Badge */}
        {duplicate_group && duplicate_group.duplicate_count > 1 && (
          <span className="job-tag duplicate-badge" title={`Found across: ${duplicate_group.source_names.join(', ')}`}>
            <Layers size={11} />
            <span>{duplicate_group.duplicate_count} sources</span>
          </span>
        )}

        {/* Hard filter warning badge */}
        {hard_filter.status === 'fail' && (
          <span className="job-tag hard-fail">
            <AlertTriangle size={11} />
            <span>Incompatible</span>
          </span>
        )}

        {/* Human review state */}
        {job.status === 'applied' && (
          <span className="job-tag status-badge applied">
            <Send size={10} />
            <span>Applied</span>
          </span>
        )}

        {job.status === 'saved' && (
          <span className="job-tag status-badge saved">
            <Bookmark size={10} />
            <span>Saved</span>
          </span>
        )}

        {job.status === 'skipped' && (
          <span className="job-tag status-badge skipped">
            <span>Skipped</span>
          </span>
        )}
      </div>
    </div>
  );
};
