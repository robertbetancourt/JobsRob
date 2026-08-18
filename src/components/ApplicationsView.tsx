import React from 'react';
import { JobApplication, ApplicationStatus } from '../types/job';

interface ApplicationsViewProps {
  applications: JobApplication[];
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
  onUpdateDetails: (appId: string, notes: string, nextAction?: string, nextDate?: string) => void;
}

const COLUMNS: { id: ApplicationStatus; title: string }[] = [
  { id: 'preparing', title: 'Preparación' },
  { id: 'applied', title: 'Aplicado' },
  { id: 'interview', title: 'Entrevista' },
  { id: 'challenge', title: 'Prueba' },
  { id: 'offer', title: 'Oferta' },
  { id: 'rejected', title: 'Rechazado' }
];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ applications, onUpdateStatus }) => {
  return (
    <div className="generic-view-container" style={{ maxWidth: '100%', padding: '48px 24px' }}>
      <div className="detail-top-header" style={{ marginBottom: '16px' }}>
        <h2 className="detail-title">Seguimiento de aplicaciones</h2>
        <div className="detail-subtitle">Rastreador local y simple para recordar etapas de aplicación y próximas acciones.</div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state-box">
          <div style={{ fontSize: '16px', fontWeight: 700 }}>No hay aplicaciones en seguimiento</div>
          <div style={{ fontSize: '14px', marginTop: '4px' }}>Marca un trabajo como Aplicado para verlo aquí.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {COLUMNS.map(col => {
            const colApps = applications.filter(a => a.status === col.id);
            return (
              <div key={col.id} style={{ minWidth: '240px', background: 'var(--bg-panel)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '16px', borderBottom: '2px solid var(--border-strong)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span>{col.title}</span>
                  <span className="ui-chip neutral">{colApps.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {colApps.map(app => (
                    <div key={app.id} className="ui-card" style={{ padding: '16px', gap: '8px', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{app.job_title}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{app.company_name}</div>
                      {app.next_action && (
                        <div style={{ fontSize: '12px', color: 'var(--color-warning)', marginTop: '8px', background: 'var(--color-warning-bg)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                          Siguiente: {app.next_action}
                        </div>
                      )}
                      <select className="filter-select" style={{ width: '100%', marginTop: '8px' }} value={app.status} onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}>
                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
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
