import React from 'react';
import { Bookmark, ExternalLink } from 'lucide-react';
import { Company } from '../types/job';

interface CompaniesViewProps {
  companies: Company[];
  onToggleSave: (companyId: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  onToggleSave
}) => {
  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Company Radar</h2>
          <div className="view-subtitle">Saved target companies tracked for product excellence, remote culture, and open designer roles.</div>
        </div>
      </div>

      <div className="companies-grid">
        {companies.map(company => (
          <div key={company.id} className="company-card">
            <div className="company-card-header">
              <div>
                <div className="company-card-title">{company.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{company.industry} · {company.region}</div>
              </div>

              <button
                className={`btn-action btn-save ${company.saved ? 'active' : ''}`}
                onClick={() => onToggleSave(company.id)}
                style={{ padding: '4px 8px' }}
              >
                <Bookmark size={12} />
                <span>{company.saved ? 'Tracked' : 'Track'}</span>
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {company.description}
            </p>

            <div style={{
              background: 'var(--bg-panel-subtle)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '11.5px',
              color: 'var(--color-apply)'
            }}>
              <strong>Why interesting:</strong> {company.why_interesting}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Open roles: <strong>{company.open_roles_count}</strong>
              </span>

              <a
                href={company.careers_url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                <span>Careers Portal</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
