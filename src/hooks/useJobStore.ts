import { runFullPipelineScan } from '../services/pipelineService';
import { JobRepository } from '../db/JobRepository';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Job, 
  Company, 
  JobApplication, 
  ScanStats, 
  HumanDecision, 
  ApplicationStatus,
  Verdict
} from '../types/job';
import { MOCK_JOBS, INITIAL_SCAN_STATS } from '../data/mockJobs';
import { MOCK_COMPANIES } from '../data/mockCompanies';
import { INITIAL_APPLICATIONS } from '../data/mockApplications';

const STORAGE_KEY_JOBS = 'jobsrob_jobs_v1';
const STORAGE_KEY_COMPANIES = 'jobsrob_companies_v1';
const STORAGE_KEY_APPLICATIONS = 'jobsrob_applications_v1';
const STORAGE_KEY_STATS = 'jobsrob_scan_stats_v1';

export type NavTab = 'radar' | 'saved' | 'applications' | 'companies' | 'settings';

export interface FilterState {
  searchQuery: string;
  verdict: 'all' | Verdict;
  workArrangement: 'all' | 'remote' | 'latam' | 'hybrid';
  effort: 'all' | 'low' | 'medium' | 'high' | 'very_high';
  status: 'all' | 'new' | 'reviewed' | 'saved' | 'skipped' | 'applied';
  sortBy: 'score_desc' | 'score_asc' | 'date_desc' | 'salary_desc' | 'effort_asc';
}

export function useJobStore() {
  const [activeTab, setActiveTab] = useState<NavTab>('radar');
  
  // Load persisted or initial jobs
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOBS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse jobs from localStorage', e);
    }
    return MOCK_JOBS;
  });

  // Load persisted or initial companies
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPANIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse companies from localStorage', e);
    }
    return MOCK_COMPANIES;
  });

  // Load persisted or initial applications
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse applications from localStorage', e);
    }
    return INITIAL_APPLICATIONS;
  });

  // Scan stats
  const [stats, setStats] = useState<ScanStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse stats from localStorage', e);
    }
    return INITIAL_SCAN_STATS;
  });

  // Selected job ID
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    return MOCK_JOBS[0]?.id || null;
  });

  // Scanning animation state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    verdict: 'all',
    workArrangement: 'all',
    effort: 'all',
    status: 'all',
    sortBy: 'score_desc'
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error(e);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(companies));
    } catch (e) {
      console.error(e);
    }
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }, [stats]);

  // Selected Job Object
  const selectedJob = useMemo(() => {
    return jobs.find(j => j.id === selectedJobId) || jobs[0] || null;
  }, [jobs, selectedJobId]);

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchCompany = job.company_name.toLowerCase().includes(query);
        const matchDesc = job.description.toLowerCase().includes(query);
        const matchSkills = job.requirements.skills.some(s => s.toLowerCase().includes(query));
        const matchLocation = job.location.raw.toLowerCase().includes(query);
        if (!matchTitle && !matchCompany && !matchDesc && !matchSkills && !matchLocation) {
          return false;
        }
      }

      // Verdict filter
      if (filters.verdict !== 'all') {
        if (job.ai_evaluation.verdict !== filters.verdict) {
          return false;
        }
      }

      // Work arrangement
      if (filters.workArrangement !== 'all') {
        if (filters.workArrangement === 'remote') {
          if (job.work_arrangement !== 'remote') return false;
        } else if (filters.workArrangement === 'latam') {
          const isLatam = job.location.raw.toLowerCase().includes('latam') || 
                          job.location.raw.toLowerCase().includes('latin america') ||
                          job.location.raw.toLowerCase().includes('venezuela');
          if (!isLatam) return false;
        } else if (filters.workArrangement === 'hybrid') {
          if (job.work_arrangement !== 'hybrid') return false;
        }
      }

      // Effort
      if (filters.effort !== 'all') {
        if (job.application_requirements.estimated_effort !== filters.effort) {
          return false;
        }
      }

      // Status
      if (filters.status !== 'all') {
        if (job.status !== filters.status) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'score_desc') {
        return b.ai_evaluation.score - a.ai_evaluation.score;
      }
      if (filters.sortBy === 'score_asc') {
        return a.ai_evaluation.score - b.ai_evaluation.score;
      }
      if (filters.sortBy === 'date_desc') {
        return new Date(b.discovered_at).getTime() - new Date(a.discovered_at).getTime();
      }
      if (filters.sortBy === 'salary_desc') {
        const salA = a.salary.max || a.salary.min || 0;
        const salB = b.salary.max || b.salary.min || 0;
        return salB - salA;
      }
      if (filters.sortBy === 'effort_asc') {
        const effortRank: Record<string, number> = { low: 1, medium: 2, high: 3, very_high: 4, unknown: 5 };
        return (effortRank[a.application_requirements.estimated_effort] || 5) - 
               (effortRank[b.application_requirements.estimated_effort] || 5);
      }
      return 0;
    });
  }, [jobs, filters]);

  // Saved Jobs
  const savedJobs = useMemo(() => {
    return jobs.filter(j => j.status === 'saved' );
  }, [jobs]);

  // Action Handlers
  const handleDecision = useCallback((jobId: string, decision: HumanDecision, notes?: string) => {
    const now = new Date().toISOString();
    
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id !== jobId) return job;

      let newStatus: Job['status'] = 'reviewed' as any;
      if (decision === 'save') newStatus = 'saved';
      if (decision === 'skip') newStatus = 'skipped';
      if (decision === 'apply') newStatus = 'applied';

      return {
    refreshJobs,
        ...job,
        status: newStatus as any
      };
    }));

    if (decision === 'apply') {
      const targetJob = jobs.find(j => j.id === jobId);
      if (targetJob) {
        setApplications(prev => {
          const existing = prev.find(a => a.job_id === jobId);
          if (existing) {
            return prev.map(a => a.job_id === jobId ? { ...a, status: 'applied' } : a);
          }
          const newApp: JobApplication = {
            id: 'app-' + Date.now(),
            job_id: targetJob.id,
            job_title: targetJob.title,
            company_name: targetJob.company_name,
            status: 'applied',
            applied_at: now,
            last_updated_at: now,
            notes: notes || 'Applied via ' + targetJob.application_requirements.ats
          };
          return [newApp, ...prev];
        });
      }
    }
  }, [jobs]);

  const handleUpdateApplicationStatus = useCallback((appId: string, newStatus: ApplicationStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
    refreshJobs,
        ...app,
        status: newStatus,
        
      };
    }));
  }, []);

  // Update application notes & next action
  const handleUpdateApplicationDetails = useCallback((appId: string, notes: string, nextAction?: string, nextDate?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
    refreshJobs,
        ...app,
        notes,
        next_action: nextAction,
        next_action_date: nextDate
      };
    }));
  }, []);

  // Toggle company saved state
  const handleToggleCompanySaved = useCallback((companyId: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id !== companyId) return c;
      return { ...c, saved: !c.saved };
    }));
  }, []);

  // Trigger Real Scan
  const refreshJobs = useCallback(async () => {
    const loadedJobs = await JobRepository.getAll();
    setJobs(loadedJobs);
  }, []);
  const triggerScan = useCallback(async () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStep(1); // Searching sources
    
    try {
      await new Promise(r => setTimeout(r, 500));
      setScanStep(2); // Deduplication
      
      const stats = await runFullPipelineScan();
      
      setScanStep(3); // AI scoring
      await new Promise(r => setTimeout(r, 500));
      
      setScanStep(4); // Finalizing
      setStats(stats);
      refreshJobs();
      
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
      setScanStep(0);
    }
  }, [isScanning, refreshJobs]);

  // Reset to initial mock state
  const resetToDefaultMockData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_JOBS);
    localStorage.removeItem(STORAGE_KEY_COMPANIES);
    localStorage.removeItem(STORAGE_KEY_APPLICATIONS);
    localStorage.removeItem(STORAGE_KEY_STATS);
    setJobs(MOCK_JOBS);
    setCompanies(MOCK_COMPANIES);
    setApplications(INITIAL_APPLICATIONS);
    setStats(INITIAL_SCAN_STATS);
    setSelectedJobId(MOCK_JOBS[0].id);
  }, []);

  return {
    refreshJobs,
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
  };
}
