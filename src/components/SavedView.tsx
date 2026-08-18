import React from 'react';
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react';
import { Job, HumanDecision } from '../types/job';

interface SavedViewProps {
  savedJobs: Job[];
  onSelectJob: (jobId: string) => void;
  onDecision: (jobId: string, decision: HumanDecision) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedJobs,
  onSelectJob,
  onDecision
}) => {
  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Saved Opportunities</h2>
          <div className="view-subtitle">High-priority positions bookmarked for deep review and application.</div>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="empty-state-box">
          <Bookmark size={36} />
          <div className="empty-state-title">No saved opportunities yet</div>
          <div className="empty-state-desc">
            Bookmark promising roles on the Radar tab to keep track of them here.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {savedJobs.map(job => (
            <div 
              key={job.id} 
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</span>
                  <span className={`score-badge verdict-${job.ai_evaluation.verdict}`}>
                    {job.ai_evaluation.score} Score
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {job.company_name} · {job.location.raw} · <span style={{ color: '#38bdf8' }}>{job.salary.raw}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Application Effort: {job.application_requirements.estimated_effort.toUpperCase()} ({job.application_requirements.ats})
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn-action"
                  onClick={() => onSelectJob(job.id)}
                >
                  View Details
                </button>

                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-action btn-apply-primary"
                >
                  <span>Apply</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  className="btn-action"
                  onClick={() => onDecision(job.id, 'review_later')}
                  title="Remove from saved"
                >
                  <Trash2 size={13} color="var(--color-skip)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
