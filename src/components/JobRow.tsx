import React from 'react';
import { Job, Verdict } from '../types/job';

interface JobRowProps {
  job: Job;
  isSelected: boolean;
  onSelect: () => void;
}

function getVerdictClass(verdict: Verdict): string {
  switch (verdict) {
    case 'apply':
    case 'apply': return 'score-strong';
    case 'review': return 'score-review';
    case 'skip': return 'score-skip';
    default: return 'score-low';
  }
}

export const JobRow: React.FC<JobRowProps> = ({ job, isSelected, onSelect }) => {
  const { ai_evaluation, salary, location, application_requirements, hard_filter } = job;
  
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
      <div className="row-line-1">
        <div className={`row-score ${getVerdictClass(ai_evaluation.verdict)}`}>
          {ai_evaluation.score}
        </div>
        <div className="row-company">{job.company_name}</div>
        <div className="row-title" title={job.title}>{job.title}</div>
        
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          {hard_filter.status === 'fail' && (
            <span className="ui-chip danger">Incompatible</span>
          )}
          {job.status === 'applied' && (
            <span className="ui-chip info">Applied</span>
          )}
          {job.status === 'saved' && (
            <span className="ui-chip positive">Saved</span>
          )}
        </div>
      </div>

      <div className="row-line-2">
        <span className="ui-chip purple">{salary.raw}</span>
        <span className="ui-chip neutral">{location.raw}</span>
        <span className="ui-chip neutral">{job.employment_type.replace('_', ' ')} · {job.seniority}</span>
        <span className={`ui-chip ${application_requirements.estimated_effort === 'low' ? 'positive' : application_requirements.estimated_effort === 'high' ? 'warning' : 'neutral'}`}>
          Effort: {application_requirements.estimated_effort}
        </span>
      </div>
    </div>
  );
};
