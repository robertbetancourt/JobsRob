import React from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types/job';

interface ApplicationsViewProps {
  applications: JobApplication[];
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
  onUpdateDetails: (appId: string, notes: string, nextAction?: string, nextDate?: string) => void;
}

const COLUMNS: { id: ApplicationStatus; title: string }[] = [
  { id: 'preparing', title: 'Preparing' },
  { id: 'applied', title: 'Applied' },
  { id: 'interview', title: 'Interview' },
  { id: 'challenge', title: 'Challenge' },
  { id: 'offer', title: 'Offer' },
  { id: 'rejected', title: 'Archived / Rejected' }
];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onUpdateStatus
}) => {
  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Application Tracker</h2>
          <div className="view-subtitle">Simple, local-first tracker to remember application stages and next actions.</div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state-box">
          <Send size={36} />
          <div className="empty-state-title">No applications tracked yet</div>
          <div className="empty-state-desc">
            When you apply to a role on the Radar, it will automatically appear in this pipeline.
          </div>
        </div>
      ) : (
        <div className="kanban-board">
          {COLUMNS.map(col => {
            const colApps = applications.filter(a => a.status === col.id);
            return (
              <div key={col.id} className="kanban-col">
                <div className="kanban-col-header">
                  <span>{col.title}</span>
                  <span className="nav-count-badge">{colApps.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {colApps.map(app => (
                    <div key={app.id} className="kanban-card">
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {app.job_title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {app.company_name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#38bdf8' }}>
                        {app.salary_raw}
                      </div>

                      {app.next_action && (
                        <div style={{
                          background: 'var(--bg-panel-subtle)',
                          padding: '6px',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          marginTop: '4px'
                        }}>
                          <strong>Next:</strong> {app.next_action}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <select
                          className="select-filter"
                          style={{ fontSize: '10.5px', height: '24px' }}
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                        >
                          {COLUMNS.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>

                        <a 
                          href={app.application_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'var(--text-muted)' }}
                          title="Open application listing"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
