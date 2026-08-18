import React from 'react';
import { Company } from '../types/job';

interface CompaniesViewProps {
  companies: Company[];
  onToggleSave: (companyId: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({ companies, onToggleSave }) => {
  return (
    <div className="generic-view-container">
      <div className="detail-top-header" style={{ marginBottom: '16px' }}>
        <h2 className="detail-title">Radar de empresas</h2>
        <div className="detail-subtitle">Empresas en seguimiento conocidas por la excelencia de sus productos y sólida cultura remota.</div>
      </div>

      <div className="companies-grid">
        {companies.map(company => (
          <div key={company.id} className="ui-card" style={{ padding: '20px', gap: '12px', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{company.name}</div>
                <button className={`btn-action-quiet ${company.saved ? 'active-save' : ''}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => onToggleSave(company.id)}>
                  {company.saved ? 'Siguiendo' : 'Seguir'}
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span className="ui-chip neutral">{company.industry}</span>
                <span className="ui-chip info">{company.region}</span>
              </div>
              
              <p className="prose" style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>{company.description}</p>
              
              <div style={{ background: 'var(--bg-panel)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Por qué es interesante</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{company.why_interesting}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <span className="ui-chip neutral">Roles abiertos: {company.open_roles_count}</span>
              <a href={company.careers_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>Carreras ↗</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
