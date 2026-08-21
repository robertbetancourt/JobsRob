import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Layers, Check } from 'lucide-react';
import { ScanStats } from '../types/job';

interface ScanModalProps {
  isScanning: boolean;
  scanStep: number;
  stats: ScanStats;
  onClose: () => void;
}

export const ScanModal: React.FC<ScanModalProps> = ({
  isScanning,
  scanStep,
  stats
}) => {
  if (!isScanning) return null;

  return (
    <div className="modal-overlay">
      <div className="scan-modal-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="var(--color-apply)" />
          <h3 className="modal-title">Job Radar Pipeline Execution</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Step 1 */}
          <div className={`scan-progress-step ${scanStep >= 1 ? (scanStep === 1 ? 'active' : 'done') : ''}`}>
            {scanStep > 1 ? (
              <CheckCircle2 size={18} color="var(--color-apply)" />
            ) : (
              <Loader2 size={18} className="animate-spin" color="var(--color-apply)" />
            )}
            <div>
              <div style={{ fontWeight: 600 }}>1. Gathering configured sources</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Checking Greenhouse, Lever, Ashby, Wellfound & LinkedIn for Product Design roles...
              </div>
            </div>
          </div>

          {/* Step 2 */}
          {scanStep >= 2 && (
            <div className={`scan-progress-step ${scanStep >= 2 ? (scanStep === 2 ? 'active' : 'done') : ''}`}>
              {scanStep > 2 ? (
                <CheckCircle2 size={18} color="var(--color-apply)" />
              ) : (
                <Layers size={18} className="animate-spin" color="#38bdf8" />
              )}
              <div>
                <div style={{ fontWeight: 600 }}>2. Deduplication & Hard Filtering</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Found 83 postings · Merged 21 duplicates · Removed 17 incompatible (unpaid / US-only)
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {scanStep >= 3 && (
            <div className={`scan-progress-step ${scanStep >= 3 ? (scanStep === 3 ? 'active' : 'done') : ''}`}>
              {scanStep > 3 ? (
                <CheckCircle2 size={18} color="var(--color-apply)" />
              ) : (
                <Sparkles size={18} className="animate-spin" color="var(--color-purple)" />
              )}
              <div>
                <div style={{ fontWeight: 600 }}>3. AI Evaluation & Match Intelligence</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Evaluating 45 candidate roles against Robert’s ~5yr profile, LATAM bounds & portfolio...
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {scanStep >= 4 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--color-apply-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginTop: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-apply)', fontWeight: 700, fontSize: '13.5px', marginBottom: '8px' }}>
                <Check size={18} />
                <span>Scan Completed</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span><strong>{stats.strong_matches}</strong> strong matches</span>
                <span><strong>{stats.worth_reviewing}</strong> worth reviewing</span>
                <span style={{ color: 'var(--text-muted)' }}>{stats.skipped_automatically} skipped automatically</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
