import React from 'react';
import { NavTab } from '../hooks/useJobStore';
import { ScanStats } from '../types/job';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  savedCount: number;
  appliedCount: number;
  companiesCount: number;
  stats: ScanStats;
  onTriggerScan: () => void;
  isScanning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  appliedCount,
  companiesCount,
  onTriggerScan,
  isScanning
}) => {
  return (
    <header className="app-navbar">
      <div className="brand-section">
        <div className="brand-logo">
          <img src="/logo.svg" alt="JobsRob Logo" className="brand-icon" />
          <span>JobsRob</span>
        </div>
        <div className="user-badge" title="Perfil de candidato objetivo">
          Robert Betancourt · Product Designer
        </div>
      </div>

      <nav className="nav-tabs">
        <button className={`nav-tab-btn ${activeTab === 'radar' ? 'active' : ''}`} onClick={() => setActiveTab('radar')}>Radar</button>
        <button className={`nav-tab-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Guardadas {savedCount > 0 && <span className="nav-count-badge">{savedCount}</span>}</button>
        <button className={`nav-tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>Aplicaciones {appliedCount > 0 && <span className="nav-count-badge">{appliedCount}</span>}</button>
        <button className={`nav-tab-btn ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>Empresas {companiesCount > 0 && <span className="nav-count-badge">{companiesCount}</span>}</button>
        <button className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Configuración</button>
      </nav>

      <div className="header-actions">
        <button className="btn-scan" onClick={onTriggerScan} disabled={isScanning}>
          {isScanning ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </header>
  );
};
