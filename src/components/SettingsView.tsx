import React from 'react';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  return (
    <div className="generic-view-container">
      <div className="detail-top-header" style={{ marginBottom: '16px' }}>
        <h2 className="detail-title">Centro de control de decisiones</h2>
        <div className="detail-subtitle">Inspecciona el perfil activo de Robert, los pesos de puntuación y los filtros estrictos.</div>
      </div>

      <div className="settings-grid">
        <div className="ui-card">
          <div className="ui-card-header">Perfil de candidato</div>
          <div className="eval-table">
            <div className="eval-row"><span className="eval-key">Nombre</span><span className="eval-val">Robert Betancourt</span></div>
            <div className="eval-row"><span className="eval-key">Rol / Experiencia</span><span className="eval-val">Product Designer (~5 Yrs)</span></div>
            <div className="eval-row"><span className="eval-key">Base de ubicación</span><span className="eval-val">Venezuela (LATAM)</span></div>
            <div className="eval-row"><span className="eval-key">Salario objetivo</span><span className="eval-val">$2,000–$2,500+ /mo</span></div>
          </div>
        </div>

        <div className="ui-card">
          <div className="ui-card-header">Pesos de dimensiones de IA (100 Puntos)</div>
          <div className="eval-table">
            <div className="eval-row"><span className="eval-key">Coincidencia de rol y dominio</span><span className="eval-val">25</span></div>
            <div className="eval-row"><span className="eval-key">Compensación y condiciones</span><span className="eval-val">25</span></div>
            <div className="eval-row"><span className="eval-key">Ubicación y elegibilidad</span><span className="eval-val">15</span></div>
            <div className="eval-row"><span className="eval-key">Coincidencia de experiencia</span><span className="eval-val">10</span></div>
            <div className="eval-row"><span className="eval-key">Calidad del alcance</span><span className="eval-val">10</span></div>
            <div className="eval-row"><span className="eval-key">Calidad de la empresa</span><span className="eval-val">10</span></div>
            <div className="eval-row"><span className="eval-key">Esfuerzo de aplicación</span><span className="eval-val">5</span></div>
          </div>
        </div>

        <div className="ui-card" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
          <div className="ui-card-header" style={{ color: 'var(--color-danger)', borderBottomColor: 'rgba(239, 68, 68, 0.3)' }}>Descalificadores estrictos</div>
          <ul className="signal-list hard-fail">
            <li>Posiciones no remuneradas, $0, o solo con acciones</li>
            <li>Restricciones W-2 / Residencia exclusiva en EE. UU.</li>
            <li>Horas extremas (12+ horas, fines de semana constantes)</li>
          </ul>
        </div>

        <div className="ui-card">
          <div className="ui-card-header">Operaciones del sistema</div>
          <p className="prose" style={{ fontSize: '13px' }}>Restablece todos los datos de prueba, trabajos guardados, estados de aplicación y evaluaciones omitidas a su estado inicial.</p>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <button className="btn-action-quiet active-skip" onClick={() => { if (window.confirm('Reset all mock data?')) onResetData(); }}>Restablecer datos de fábrica</button>
          </div>
        </div>
      </div>
    </div>
  );
};
