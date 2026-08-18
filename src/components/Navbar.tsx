import React from 'react';
import { 
  Radar, 
  Bookmark, 
  SendHorizontal, 
  Building2, 
  Settings, 
  RefreshCw, 
  User
} from 'lucide-react';
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
          <div className="radar-dot" />
          <span>Job Radar</span>
        </div>
        <div className="user-badge" title="Target Candidate Profile">
          <User size={12} />
          <span>Robert Betancourt · Product Designer</span>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveTab('radar')}
        >
          <Radar size={15} />
          <span>Radar</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={15} />
          <span>Saved</span>
          {savedCount > 0 && <span className="nav-count-badge">{savedCount}</span>}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <SendHorizontal size={15} />
          <span>Applications</span>
          {appliedCount > 0 && <span className="nav-count-badge">{appliedCount}</span>}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          <Building2 size={15} />
          <span>Companies</span>
          {companiesCount > 0 && <span className="nav-count-badge">{companiesCount}</span>}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={15} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="header-actions">
        <button 
          className="btn-scan" 
          onClick={onTriggerScan}
          disabled={isScanning}
        >
          <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
          <span>{isScanning ? 'Scanning...' : 'Search for new jobs'}</span>
        </button>
      </div>
    </header>
  );
};
