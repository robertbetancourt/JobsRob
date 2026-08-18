import { useJobStore } from './hooks/useJobStore';
import { Navbar } from './components/Navbar';
import { RadarView } from './components/RadarView';
import { SavedView } from './components/SavedView';
import { ApplicationsView } from './components/ApplicationsView';
import { CompaniesView } from './components/CompaniesView';
import { SettingsView } from './components/SettingsView';
import { ScanModal } from './components/ScanModal';

export function App() {
  const {
    activeTab,
    setActiveTab,
    jobs,
    filteredJobs,
    savedJobs,
    companies,
    applications,
    stats,
    selectedJobId,
    setSelectedJobId,
    selectedJob,
    filters,
    setFilters,
    isScanning,
    scanStep,
    triggerScan,
    handleDecision,
    handleUpdateApplicationStatus,
    handleUpdateApplicationDetails,
    handleToggleCompanySaved,
    resetToDefaultMockData
  } = useJobStore();

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedJobs.length}
        appliedCount={applications.length}
        companiesCount={companies.filter(c => c.saved).length}
        stats={stats}
        onTriggerScan={triggerScan}
        isScanning={isScanning}
      />

      <main className="main-content">
        {activeTab === 'radar' && (
          <RadarView
            jobs={filteredJobs}
            totalJobsCount={jobs.length}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
            selectedJob={selectedJob}
            filters={filters}
            setFilters={setFilters}
            stats={stats}
            onDecision={handleDecision}
          />
        )}

        {activeTab === 'saved' && (
          <SavedView
            savedJobs={savedJobs}
            onSelectJob={(id) => {
              setSelectedJobId(id);
              setActiveTab('radar');
            }}
            onDecision={handleDecision}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationsView
            applications={applications}
            onUpdateStatus={handleUpdateApplicationStatus}
            onUpdateDetails={handleUpdateApplicationDetails}
          />
        )}

        {activeTab === 'companies' && (
          <CompaniesView
            companies={companies}
            onToggleSave={handleToggleCompanySaved}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            onResetData={resetToDefaultMockData}
          />
        )}
      </main>

      <ScanModal
        isScanning={isScanning}
        scanStep={scanStep}
        stats={stats}
        onClose={() => {}}
      />
    </div>
  );
}

export default App;
