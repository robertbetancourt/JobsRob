import React, { useState } from 'react';
import { 
  Send, 
  Bookmark, 
  XCircle, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Briefcase
} from 'lucide-react';
import { 
  Job, 
  HumanDecision, 
  RejectionReason 
} from '../types/job';

interface JobDetailProps {
  job: Job | null;
  onDecision: (jobId: string, decision: HumanDecision, reason?: RejectionReason, notes?: string) => void;
}

const REJECTION_REASONS: { id: RejectionReason; label: string }[] = [
  { id: 'compensation', label: 'Compensation too low' },
  { id: 'working_hours', label: 'Working hours / Overtime' },
  { id: 'location', label: 'Location / Timezone mismatch' },
  { id: 'work_authorization', label: 'Work authorization barrier' },
  { id: 'scope', label: 'Scope creep (Design + Dev + Marketing)' },
  { id: 'application_effort', label: 'Application effort too high' },
  { id: 'seniority', label: 'Seniority mismatch' },
  { id: 'company', label: 'Company profile / Uninteresting' },
  { id: 'suspicious', label: 'Suspicious / Scam signal' },
  { id: 'not_interesting', label: 'Not interesting' },
  { id: 'other', label: 'Other reason' }
];

export const JobDetail: React.FC<JobDetailProps> = ({ job, onDecision }) => {
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<RejectionReason>('compensation');
  const [customNote, setCustomNote] = useState('');

  if (!job) {
    return (
      <div className="empty-state-box">
        <Briefcase size={36} />
        <div className="empty-state-title">No job selected</div>
        <div className="empty-state-desc">Select an opportunity from the Radar list to inspect its AI score and requirements.</div>
      </div>
    );
  }

  const { 
    ai_evaluation, 
    salary, 
    location, 
    working_hours, 
    application_requirements, 
    hard_filter,
    duplicate_group,
    sources,
    human_review
  } = job;

  const handleConfirmSkip = () => {
    onDecision(job.id, 'skip', selectedReason, customNote);
    setShowSkipModal(false);
  };

  return (
    <div className="detail-panel">
      {/* Top Action Bar */}
      <div className="detail-top-action-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-action btn-apply-primary"
          >
            <span>Open Application</span>
            <ExternalLink size={13} />
          </a>

          <button
            className={`btn-action ${job.status === 'applied' ? 'active' : ''}`}
            onClick={() => onDecision(job.id, 'apply')}
            title="Mark as applied and add to tracker"
          >
            <Send size={13} color="var(--color-apply)" />
            <span>{job.status === 'applied' ? 'Applied ✓' : 'Mark as Applied'}</span>
          </button>
        </div>

        <div className="action-buttons-group">
          <button
            className={`btn-action btn-save ${job.status === 'saved' ? 'active' : ''}`}
            onClick={() => onDecision(job.id, job.status === 'saved' ? 'review_later' : 'save')}
          >
            <Bookmark size={13} />
            <span>{job.status === 'saved' ? 'Saved' : 'Save'}</span>
          </button>

          <button
            className={`btn-action btn-skip ${job.status === 'skipped' ? 'active' : ''}`}
            onClick={() => setShowSkipModal(true)}
          >
            <XCircle size={13} />
            <span>{job.status === 'skipped' ? 'Skipped' : 'Skip'}</span>
          </button>
        </div>
      </div>

      {/* Main Detail Body */}
      <div className="detail-body">
        {/* Header Summary */}
        <div className="detail-header-card">
          <div className="detail-role-title">{job.title}</div>
          <div className="detail-company-subtitle">
            <span className="detail-company-name">{job.company_name}</span>
            {job.company_industry && <span>· {job.company_industry}</span>}
            <span>· Discovered {new Date(job.discovered_at).toLocaleDateString()}</span>
          </div>

          <div className="detail-meta-grid">
            <div className="meta-field">
              <span className="meta-label">Compensation</span>
              <span className="meta-value highlight-blue">{salary.raw}</span>
            </div>
            <div className="meta-field">
              <span className="meta-label">Location / Setup</span>
              <span className="meta-value">{location.raw}</span>
            </div>
            <div className="meta-field">
              <span className="meta-label">Employment Type</span>
              <span className="meta-value" style={{ textTransform: 'capitalize' }}>
                {job.employment_type.replace('_', ' ')} · {job.seniority}
              </span>
            </div>
            <div className="meta-field">
              <span className="meta-label">Application Platform</span>
              <span className="meta-value">{application_requirements.ats} (Effort: {application_requirements.estimated_effort})</span>
            </div>
          </div>
        </div>

        {/* Hard Filter Alert if failed */}
        {hard_filter.status === 'fail' && (
          <div style={{
            background: 'var(--color-skip-bg)',
            border: '1px solid var(--color-skip-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <ShieldAlert size={20} color="var(--color-skip)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-skip)', fontSize: '13px' }}>Hard Incompatibility Detected</div>
              <ul style={{ marginTop: '4px', paddingLeft: '16px', fontSize: '12.5px', color: 'var(--text-primary)' }}>
                {hard_filter.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* AI Assessment Card */}
        <div className="ai-assessment-box">
          <div className="ai-header-row">
            <div className="ai-title-group">
              <Sparkles size={18} color="var(--color-apply)" />
              <span style={{ fontWeight: 700, fontSize: '14px' }}>AI Match Assessment</span>
              <span className="ai-pill-badge">Model Recommendation</span>
            </div>

            <div className="ai-verdict-banner">
              <span style={{ color: 'var(--text-muted)' }}>Score:</span>
              <span className="font-mono" style={{ fontSize: '18px', color: 'var(--color-apply)' }}>{ai_evaluation.score}</span>
              <span style={{ color: 'var(--text-muted)' }}>/ 100</span>
              <span className={`score-badge verdict-${ai_evaluation.verdict}`} style={{ marginLeft: '6px' }}>
                {ai_evaluation.verdict.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* 8 Scoring Dimensions */}
          <div className="dimensions-grid">
            <div className="dimension-item">
              <div className="dimension-label-row">
                <span>Role Fit</span>
                <span className="font-mono">{ai_evaluation.dimensions.role_fit}/25</span>
              </div>
              <div className="dimension-bar-track">
                <div className="dimension-bar-fill" style={{ width: `${(Math.max(0, ai_evaluation.dimensions.role_fit) / 25) * 100}%` }} />
              </div>
            </div>

            <div className="dimension-item">
              <div className="dimension-label-row">
                <span>Comp & Hours</span>
                <span className="font-mono">{ai_evaluation.dimensions.compensation_conditions}/25</span>
              </div>
              <div className="dimension-bar-track">
                <div className="dimension-bar-fill" style={{ width: `${(Math.max(0, ai_evaluation.dimensions.compensation_conditions) / 25) * 100}%` }} />
              </div>
            </div>

            <div className="dimension-item">
              <div className="dimension-label-row">
                <span>Location</span>
                <span className="font-mono">{ai_evaluation.dimensions.location}/15</span>
              </div>
              <div className="dimension-bar-track">
                <div className="dimension-bar-fill" style={{ width: `${(Math.max(0, ai_evaluation.dimensions.location) / 15) * 100}%` }} />
              </div>
            </div>

            <div className="dimension-item">
              <div className="dimension-label-row">
                <span>Seniority/Exp</span>
                <span className="font-mono">{ai_evaluation.dimensions.experience}/10</span>
              </div>
              <div className="dimension-bar-track">
                <div className="dimension-bar-fill" style={{ width: `${(Math.max(0, ai_evaluation.dimensions.experience) / 10) * 100}%` }} />
              </div>
            </div>

            <div className="dimension-item">
              <div className="dimension-label-row">
                <span>Scope Quality</span>
                <span className="font-mono">{ai_evaluation.dimensions.scope}/10</span>
              </div>
              <div className="dimension-bar-track">
                <div className="dimension-bar-fill" style={{ width: `${(Math.max(0, ai_evaluation.dimensions.scope) / 10) * 100}%` }} />
              </div>
            </div>

            <div className="dimension-item">
              <div className="dimension-label-row">
                <span>App Effort</span>
                <span className="font-mono">{ai_evaluation.dimensions.application_effort}/5</span>
              </div>
              <div className="dimension-bar-track">
                <div className="dimension-bar-fill" style={{ width: `${(Math.max(0, ai_evaluation.dimensions.application_effort) / 5) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Why it Matches */}
          {ai_evaluation.why_it_matches.length > 0 && (
            <div className="assessment-section">
              <div className="assessment-title matches">
                <CheckCircle2 size={14} color="var(--color-apply)" />
                <span>Why it matches Robert</span>
              </div>
              <ul className="assessment-list">
                {ai_evaluation.why_it_matches.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={13} className="bullet-icon green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Concerns & Risks */}
          {ai_evaluation.concerns.length > 0 && (
            <div className="assessment-section">
              <div className="assessment-title concerns">
                <AlertTriangle size={14} color="var(--color-review)" />
                <span>Concerns & Unknowns</span>
              </div>
              <ul className="assessment-list">
                {ai_evaluation.concerns.map((item, idx) => (
                  <li key={idx}>
                    <AlertTriangle size={13} className="bullet-icon amber" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contextual Assessments */}
          <div className="assessment-context-grid">
            <div className="context-card">
              <span className="context-card-title">Compensation & Workload Assessment</span>
              <p className="context-card-content">{ai_evaluation.compensation_assessment}</p>
            </div>

            <div className="context-card">
              <span className="context-card-title">Location & Eligibility Assessment</span>
              <p className="context-card-content">{ai_evaluation.location_assessment}</p>
            </div>
          </div>

          {/* Recommended Portfolio Projects */}
          {ai_evaluation.recommended_projects.length > 0 && (
            <div className="portfolio-recommendation-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-purple)' }}>
                <Sparkles size={14} />
                <span>Recommended Portfolio Projects to Feature</span>
              </div>
              <div className="portfolio-badge-list">
                {ai_evaluation.recommended_projects.map(proj => (
                  <span key={proj} className="portfolio-chip">
                    <span>{proj}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Application Effort Intelligence */}
        <div className="effort-card">
          <div className="effort-stat">
            <span className="effort-stat-label">Application Friction</span>
            <span className={`effort-stat-val ${application_requirements.estimated_effort === 'low' ? 'highlight-green' : ''}`}>
              {application_requirements.estimated_effort.toUpperCase()}
            </span>
          </div>

          <div className="effort-stat">
            <span className="effort-stat-label">Estimated Time</span>
            <span className="effort-stat-val">
              {application_requirements.estimated_minutes ? `~${application_requirements.estimated_minutes} mins` : 'Unknown'}
            </span>
          </div>

          <div className="effort-stat">
            <span className="effort-stat-label">Questions</span>
            <span className="effort-stat-val">{application_requirements.questions_count} questions</span>
          </div>

          <div className="effort-stat">
            <span className="effort-stat-label">Take-Home Test</span>
            <span className="effort-stat-val">
              {application_requirements.take_home.required ? (
                <span style={{ color: 'var(--color-review)' }}>
                  Required ({application_requirements.take_home.estimated_hours || '3+'} hrs)
                </span>
              ) : (
                <span style={{ color: 'var(--color-apply)' }}>None</span>
              )}
            </span>
          </div>
        </div>

        {/* Duplicate Sources Grouping */}
        {duplicate_group && duplicate_group.duplicate_count > 1 && (
          <div className="sources-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-purple)' }}>
              <Layers size={14} />
              <span>Deduplicated Canonical Opportunity (Found across {duplicate_group.duplicate_count} sources)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {sources.map(src => (
                <div key={src.id} className="source-item-row">
                  <span><strong>{src.source_name}</strong> ({src.source_type})</span>
                  <a href={src.source_url} target="_blank" rel="noopener noreferrer" className="source-link">
                    <span>View original listing</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Working Hours & Boundaries */}
        {working_hours && (
          <div className="job-description-box">
            <h4>Working Hours & Culture</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12.5px' }}>
              <div><strong>Weekly Hours:</strong> {working_hours.hours_per_week || '40'} hrs/week</div>
              <div><strong>Schedule:</strong> {working_hours.schedule || 'Standard business hours'}</div>
              <div><strong>Weekends Required:</strong> {working_hours.weekend_required ? 'Yes (Red flag)' : 'No'}</div>
              <div><strong>On-Call:</strong> {working_hours.on_call ? 'Yes' : 'No'}</div>
            </div>
            {working_hours.notes && (
              <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {working_hours.notes}
              </p>
            )}
          </div>
        )}

        {/* Full Job Description */}
        <div className="job-description-box">
          <h4>Original Job Description</h4>
          <div className="description-text">{job.description}</div>
        </div>

        {/* Human review history if existing */}
        {human_review?.decision && (
          <div style={{
            background: 'var(--bg-card)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px'
          }}>
            <strong>Human Review Recorded:</strong> Decision: <span style={{ textTransform: 'capitalize' }}>{human_review.decision}</span>
            {human_review.reason && <span> · Reason: {human_review.reason}</span>}
            {human_review.notes && <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>Notes: {human_review.notes}</div>}
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {showSkipModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Record Rejection Reason</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Help Job Radar refine future prioritizations for Robert:
            </p>

            <div className="reasons-grid">
              {REJECTION_REASONS.map(r => (
                <button
                  key={r.id}
                  className={`btn-reason-option ${selectedReason === r.id ? 'selected' : ''}`}
                  onClick={() => setSelectedReason(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Optional notes..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                className="btn-action"
                onClick={() => setShowSkipModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-action btn-skip active"
                onClick={handleConfirmSkip}
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
