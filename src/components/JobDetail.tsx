import React, { useState } from 'react';
import { Job, HumanDecision, RejectionReason } from '../types/job';

interface JobDetailProps {
  job: Job | null;
  onDecision: (jobId: string, decision: HumanDecision, reason?: RejectionReason, notes?: string) => void;
}

const REJECTION_REASONS: { id: RejectionReason; label: string }[] = [
  { id: 'compensation', label: 'Compensación muy baja' },
  { id: 'working_hours', label: 'Horas de trabajo / Horas extras' },
  { id: 'location', label: 'Incompatibilidad de ubicación / Zona horaria' },
  { id: 'work_authorization', label: 'Barrera de autorización de trabajo' },
  { id: 'scope', label: 'Exceso de alcance (Diseño + Dev + Marketing)' },
  { id: 'application_effort', label: 'Esfuerzo de aplicación muy alto' },
  { id: 'seniority', label: 'Incompatibilidad de seniority' },
  { id: 'company', label: 'Perfil de empresa / Poco interesante' },
  { id: 'suspicious', label: 'Señal sospechosa / Estafa' },
  { id: 'not_interesting', label: 'Poco interesante' },
  { id: 'other', label: 'Otro motivo' }
];

export const JobDetail: React.FC<JobDetailProps> = ({ job, onDecision }) => {
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<RejectionReason>('compensation');
  const [customNote, setCustomNote] = useState('');
  const [activeTab, setActiveTab] = useState<'analysis' | 'logistics' | 'description'>('analysis');

  if (!job) {
    return (
      <div className="empty-state-box">
        <div style={{ fontSize: '18px', fontWeight: 800 }}>Ninguna oportunidad seleccionada</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>Selecciona un elemento de la lista Radar para ver el análisis estructurado.</div>
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
    sources
  } = job;

  const handleConfirmSkip = () => {
    onDecision(job.id, 'skip', selectedReason, customNote);
    setShowSkipModal(false);
  };

  return (
    <div className="detail-panel">
      {/* Action Bar */}
      <div className="detail-top-action-bar">
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={`btn-action-quiet ${job.status === 'applied' ? 'active-apply' : 'primary'}`} onClick={() => { if (job.status !== 'applied') onDecision(job.id, 'apply'); }}>
            {job.status === 'applied' ? 'Aplicada ✓' : 'Marcar como aplicada'}
          </button>
          <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="btn-action-quiet" style={{ textDecoration: 'none' }}>Abrir enlace ↗</a>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={`btn-action-quiet ${job.status === 'saved' ? 'active-save' : ''}`} onClick={() => onDecision(job.id, job.status === 'saved' ? 'review_later' : 'save')}>
            {job.status === 'saved' ? 'Guardada' : 'Guardar'}
          </button>
          <button className={`btn-action-quiet ${job.status === 'skipped' ? 'active-skip' : ''}`} onClick={() => setShowSkipModal(true)}>
            {job.status === 'skipped' ? 'Omitida' : 'Omitir'}
          </button>
        </div>
      </div>

      <div className="detail-body">
        
        {/* Workspace Header */}
        <div className="detail-top-header">
          <h1 className="detail-title">{job.title}</h1>
          <div className="detail-subtitle">
            <span style={{ color: 'var(--text-primary)' }}>{job.company_name}</span>
            {job.company_industry && <span>· {job.company_industry}</span>}
            <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>· Descubierto {new Date(job.discovered_at).toLocaleDateString()}</span>
          </div>
          
          <div className="detail-chips" style={{ marginTop: '12px' }}>
            <span className="ui-chip purple">{salary.raw}</span>
            <span className="ui-chip info">{location.raw}</span>
            <span className="ui-chip neutral" style={{ textTransform: 'capitalize' }}>{job.employment_type.replace('_', ' ')}</span>
            <span className="ui-chip neutral">{job.seniority}</span>
            <span className={`ui-chip ${application_requirements.estimated_effort === 'low' ? 'positive' : application_requirements.estimated_effort === 'high' ? 'warning' : 'neutral'}`}>
              Esfuerzo: {application_requirements.estimated_effort}
            </span>
            <span className="ui-chip neutral">{application_requirements.ats}</span>
          </div>
        </div>

        {hard_filter.status === 'fail' && (
          <div className="ui-card" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
            <div className="ui-card-header" style={{ color: 'var(--color-danger)', borderBottomColor: 'rgba(239, 68, 68, 0.3)' }}>Incompatibilidad estricta</div>
            <ul className="signal-list hard-fail">
              {hard_filter.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* Local Navigation Tabs */}
        <div className="local-tabs">
          <button className={`local-tab ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>Análisis de decisión</button>
          <button className={`local-tab ${activeTab === 'logistics' ? 'active' : ''}`} onClick={() => setActiveTab('logistics')}>Empresa y logística</button>
          <button className={`local-tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Descripción original</button>
        </div>

        {/* Tab Content: Analysis */}
        {activeTab === 'analysis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="ui-card">
              <div className="ui-card-header">
                <span>Evaluación de dimensiones</span>
                <span className={`ui-chip ${ai_evaluation.score >= 80 ? 'positive' : ai_evaluation.score >= 60 ? 'warning' : 'neutral'}`}>
                  {ai_evaluation.verdict.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="ai-score-row">
                <div className="ai-score-hero">
                  <span className={`ai-score-number ${ai_evaluation.score >= 80 ? 'score-strong' : ai_evaluation.score >= 60 ? 'score-review' : 'score-low'}`}>
                    {ai_evaluation.score}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>De 100</span>
                </div>
                <div className="eval-table">
                  <div className="eval-item-container" style={{marginBottom: '12px'}}>
     <div className="eval-row" style={{borderBottom: 'none', paddingBottom: '0'}}>
       <span className="eval-key">Coincidencia de rol y dominio</span>
       <span className="eval-val">{ai_evaluation.dimensions.role_fit?.score ?? '—'} / 25</span>
     </div>
     <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4'}}>{ai_evaluation.dimensions.role_fit?.rationale}</div>
   </div>
                  <div className="eval-item-container" style={{marginBottom: '12px'}}>
     <div className="eval-row" style={{borderBottom: 'none', paddingBottom: '0'}}>
       <span className="eval-key">Compensación y condiciones</span>
       <span className="eval-val">{ai_evaluation.dimensions.compensation_conditions?.score ?? '—'} / 25</span>
     </div>
     <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4'}}>{ai_evaluation.dimensions.compensation_conditions?.rationale}</div>
   </div>
                  <div className="eval-item-container" style={{marginBottom: '12px'}}>
     <div className="eval-row" style={{borderBottom: 'none', paddingBottom: '0'}}>
       <span className="eval-key">Ubicación y elegibilidad</span>
       <span className="eval-val">{ai_evaluation.dimensions.location?.score ?? '—'} / 15</span>
     </div>
     <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4'}}>{ai_evaluation.dimensions.location?.rationale}</div>
   </div>
                  <div className="eval-item-container" style={{marginBottom: '12px'}}>
     <div className="eval-row" style={{borderBottom: 'none', paddingBottom: '0'}}>
       <span className="eval-key">Coincidencia de experiencia</span>
       <span className="eval-val">{ai_evaluation.dimensions.experience?.score ?? '—'} / 10</span>
     </div>
     <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4'}}>{ai_evaluation.dimensions.experience?.rationale}</div>
   </div>
                  <div className="eval-item-container" style={{marginBottom: '12px'}}>
     <div className="eval-row" style={{borderBottom: 'none', paddingBottom: '0'}}>
       <span className="eval-key">Calidad del alcance</span>
       <span className="eval-val">{ai_evaluation.dimensions.scope?.score ?? '—'} / 10</span>
     </div>
     <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4'}}>{ai_evaluation.dimensions.scope?.rationale}</div>
   </div>
                  <div className="eval-row"><span className="eval-key">Calidad de la empresa</span><span className="eval-val">{ai_evaluation.dimensions.company_opportunity_quality ?? 0} / 10</span></div>
                  <div className="eval-item-container" style={{marginBottom: '12px'}}>
     <div className="eval-row" style={{borderBottom: 'none', paddingBottom: '0'}}>
       <span className="eval-key">Esfuerzo de aplicación</span>
       <span className="eval-val">{ai_evaluation.dimensions.application_effort?.score ?? '—'} / 5</span>
     </div>
     <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4'}}>{ai_evaluation.dimensions.application_effort?.rationale}</div>
   </div>
                </div>
              </div>
            </div>

            <div className="context-grid">
              <div className="ui-card">
                <div className="ui-card-header">Evidencia positiva</div>
                <ul className="signal-list matches">
                  {ai_evaluation.why_it_matches.length > 0 ? ai_evaluation.why_it_matches.map((item, idx) => <li key={idx}>{item}</li>) : <li style={{ color: 'var(--text-tertiary)' }}>No se encontraron coincidencias fuertes.</li>}
                </ul>
              </div>
              <div className="ui-card">
                <div className="ui-card-header">Preocupaciones y puntos desconocidos</div>
                <ul className="signal-list warnings">
                  {ai_evaluation.concerns.map((item, idx) => <li key={idx}>{item}</li>)}
                  {ai_evaluation.unknowns && ai_evaluation.unknowns.map((item, idx) => <li key={`u-${idx}`} style={{ color: 'var(--text-tertiary)' }}>Falta: {item}</li>)}
                  {ai_evaluation.concerns.length === 0 && (!ai_evaluation.unknowns || ai_evaluation.unknowns.length === 0) && <li style={{ color: 'var(--text-tertiary)' }}>No se detectaron preocupaciones importantes.</li>}
                </ul>
              </div>
            </div>

            {ai_evaluation.evidence && ai_evaluation.evidence.length > 0 && (
              <div className="ui-card">
                 <div className="ui-card-header">Evidencia contextual directa</div>
                 {ai_evaluation.evidence.map((ev, i) => (
                   <blockquote key={i} style={{ borderLeft: '3px solid var(--border-strong)', paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic', marginBottom: '12px' }}>
                     "{ev.quote}" — <span style={{ color: 'var(--text-tertiary)', fontStyle: 'normal', fontSize: '13px' }}>{ev.context}</span>
                   </blockquote>
                 ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Logistics */}
        {activeTab === 'logistics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="ui-card">
              <div className="ui-card-header">Logística de aplicación</div>
              <ul className="signal-list">
                <li>Plataforma: <strong>{application_requirements.ats}</strong></li>
                <li>Tiempo estimado: <strong>{application_requirements.estimated_minutes ? `~${application_requirements.estimated_minutes} mins` : 'Desconocido'}</strong></li>
                <li>Preguntas personalizadas: <strong>{application_requirements.questions_count}</strong></li>
                <li>Prueba técnica: <strong className={application_requirements.take_home.required ? 'score-skip' : ''}>{application_requirements.take_home.required ? `Requerida (~ ${application_requirements.take_home.estimated_hours || 3} hrs)` : 'No especificada'}</strong></li>
              </ul>
            </div>
            
            <div className="ui-card">
               <div className="ui-card-header">Evaluación de compensación y horas</div>
               <p className="text-block" style={{ marginBottom: '12px' }}><strong>Lógica de compensación:</strong> {ai_evaluation.compensation_assessment}</p>
               <p className="text-block" style={{ marginBottom: '12px' }}><strong>Lógica de ubicación:</strong> {ai_evaluation.location_assessment}</p>
               {working_hours && (
                 <p className="text-block">
                   <strong>Horas de trabajo:</strong> {working_hours.hours_per_week || '40'} hrs/sem. 
                   {working_hours.weekend_required ? ' Fines de semana requeridos.' : ''} 
                   {working_hours.on_call ? ' Guardias requeridas.' : ''}
                 </p>
               )}
            </div>

            {duplicate_group && duplicate_group.duplicate_count > 1 && (
              <div className="ui-card">
                <div className="ui-card-header">Fuentes duplicadas ({duplicate_group.duplicate_count})</div>
                <ul className="signal-list">
                  {sources.map(src => (
                    <li key={src.id}>
                      <a href={src.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {src.source_name} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Description */}
        {activeTab === 'description' && (
          <div className="ui-card">
            <div className="ui-card-header">Descripción original de la oportunidad</div>
            <div className="prose">{job.description}</div>
          </div>
        )}

      </div>

      {/* Rejection Modal */}
      {showSkipModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Registrar motivo de omisión</h3>
            <div className="reasons-grid">
              {REJECTION_REASONS.map(r => (
                <button key={r.id} className={`btn-reason-option ${selectedReason === r.id ? 'selected' : ''}`} onClick={() => setSelectedReason(r.id)}>{r.label}</button>
              ))}
            </div>
            <input type="text" className="text-input" placeholder="Notas opcionales..." value={customNote} onChange={(e) => setCustomNote(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-action-quiet" onClick={() => setShowSkipModal(false)}>Cancelar</button>
              <button className="btn-action-quiet active-skip" onClick={handleConfirmSkip}>Confirmar omisión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
