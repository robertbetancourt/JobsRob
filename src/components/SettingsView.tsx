import React from 'react';
import { User, Sliders, Shield, RotateCcw } from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Personal Preferences & Decision Model</h2>
          <div className="view-subtitle">Inspect Robert’s active candidate profile, scoring weights, and hard filter boundaries.</div>
        </div>
      </div>

      {/* Profile summary */}
      <div className="settings-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="var(--color-apply)" />
          <h3 className="settings-heading">Candidate Profile (Source of Truth)</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '12.5px' }}>
          <div>
            <strong>Name:</strong> Robert Betancourt
          </div>
          <div>
            <strong>Experience:</strong> ~5 Years in Product Design / UI/UX
          </div>
          <div>
            <strong>Base Location:</strong> Venezuela (Remote / LATAM timezone overlap)
          </div>
          <div>
            <strong>Target Compensation:</strong> $2,000–$2,500+ USD/mo (No rigid salary floor for healthy conditions)
          </div>
          <div>
            <strong>Key Domains:</strong> Fintech, Neobanks, Crypto Wallets, B2B SaaS, Logistics
          </div>
          <div>
            <strong>Featured Portfolio:</strong> B89, Banexcoin, GIP, Autoandes, BE FIT, Mimik
          </div>
        </div>
      </div>

      {/* AI Scoring Weights */}
      <div className="settings-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="#38bdf8" />
          <h3 className="settings-heading">AI Evaluation Dimension Breakdown (Phase 1 Baseline)</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '12px' }}>
          <div style={{ background: 'var(--bg-panel-subtle)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontWeight: 700 }}>Role & Domain Fit (25%)</div>
            <div style={{ color: 'var(--text-muted)' }}>Product design, UX/UI, fintech/SaaS overlap</div>
          </div>
          <div style={{ background: 'var(--bg-panel-subtle)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontWeight: 700 }}>Comp & Conditions (25%)</div>
            <div style={{ color: 'var(--text-muted)' }}>Salary normalized relative to 40h/wk bounds</div>
          </div>
          <div style={{ background: 'var(--bg-panel-subtle)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontWeight: 700 }}>Location & Eligibility (15%)</div>
            <div style={{ color: 'var(--text-muted)' }}>LATAM contractor compatibility</div>
          </div>
          <div style={{ background: 'var(--bg-panel-subtle)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontWeight: 700 }}>Experience Match (10%)</div>
            <div style={{ color: 'var(--text-muted)' }}>Alignment with ~5 years experience</div>
          </div>
          <div style={{ background: 'var(--bg-panel-subtle)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontWeight: 700 }}>Scope Quality (10%)</div>
            <div style={{ color: 'var(--text-muted)' }}>Ownership vs. multi-hat scope creep</div>
          </div>
          <div style={{ background: 'var(--bg-panel-subtle)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontWeight: 700 }}>Application Effort (5%)</div>
            <div style={{ color: 'var(--text-muted)' }}>Friction & take-home penalty</div>
          </div>
        </div>
      </div>

      {/* Hard Filter Rules */}
      <div className="settings-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--color-skip)" />
          <h3 className="settings-heading">Active Hard Filter Rules (JOB_RULES.md)</h3>
        </div>

        <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li><strong>Reject Unpaid Positions:</strong> $0 / Equity-only opportunities are automatically flagged as incompatible.</li>
          <li><strong>US-Only Work Authorization:</strong> Incompatible W-2 or residency restrictions are flagged immediately.</li>
          <li><strong>Extreme Hours & Burnout:</strong> Mandatory 12+ hour days, weekends, or 24/7 on-call expectations trigger red flags.</li>
          <li><strong>Multi-Source Normalization:</strong> Multiple appearances of the same opportunity are grouped to prevent clutter.</li>
        </ul>
      </div>

      {/* Reset Mock Data */}
      <div className="settings-section-card" style={{ border: '1px solid var(--border-medium)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="settings-heading">Prototype State Reset</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Reset all job decisions, applied trackers, and saved lists back to default mock state.
            </div>
          </div>

          <button
            className="btn-action"
            onClick={() => {
              if (window.confirm('Reset all mock data to initial baseline?')) {
                onResetData();
              }
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Mock Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
