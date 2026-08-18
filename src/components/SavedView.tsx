import React from 'react';
import { Job, HumanDecision } from '../types/job';

interface SavedViewProps {
  savedJobs: Job[];
  onSelectJob: (jobId: string) => void;
  onDecision: (jobId: string, decision: HumanDecision) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({ savedJobs, onSelectJob, onDecision }) => {
  return (
    <div className="generic-view-container">
      <div className="detail-top-header" style={{ marginBottom: '16px' }}>
        <h2 className="detail-title">Oportunidades guardadas</h2>
        <div className="detail-subtitle">Posiciones de alta prioridad guardadas para revisión profunda y aplicación.</div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="empty-state-box">
          <div style={{ fontSize: '16px', fontWeight: 700 }}>No hay oportunidades guardadas</div>
          <div style={{ fontSize: '14px', marginTop: '4px' }}>Guarda roles en la pestaña Radar para verlos aquí.</div>
        </div>
      ) : (
        <div className="ui-card" style={{ padding: '0', gap: '0' }}>
          {savedJobs.map((job, idx) => (
            <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: idx < savedJobs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{job.title}</div>
                  <span className="ui-chip positive">Puntaje: {job.ai_evaluation.score}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 700 }}>{job.company_name}</span>
                  <span className="ui-chip neutral">{job.location.raw}</span>
                  <span className="ui-chip purple">{job.salary.raw}</span>
                  <span className={`ui-chip ${job.application_requirements.estimated_effort === 'low' ? 'positive' : job.application_requirements.estimated_effort === 'high' ? 'warning' : 'neutral'}`}>
                    Esfuerzo: {job.application_requirements.estimated_effort}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button className="btn-action-quiet" onClick={() => onSelectJob(job.id)}>Detalles</button>
                <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="btn-action-quiet active-apply" style={{ textDecoration: 'none' }}>Aplicar</a>
                <button className="btn-action-quiet" onClick={() => onDecision(job.id, 'review_later')}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
