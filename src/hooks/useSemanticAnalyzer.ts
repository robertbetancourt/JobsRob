import { useEffect, useState, useRef } from 'react';
import { JobRepository } from '../db/JobRepository';
import { analyzeJobWithOllama } from '../services/semanticAnalyzer';

const CHUNK_SIZE = 3;
const retryMap = new Map<string, number>();
const MAX_RETRIES = 3;

export function useSemanticAnalyzer(triggerRefresh: () => void) {
  const [analyzingCount, setAnalyzingCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    
    async function processQueue() {
      if (isProcessingRef.current) return;
      
      try {
        const allJobs = await JobRepository.getAll();
        const pendingJobs = allJobs.filter(j => {
          if (j.semantic_status === 'pending') return true;
          if (j.semantic_status === 'failed') {
            const retries = retryMap.get(j.id) || 0;
            return retries < MAX_RETRIES;
          }
          return false;
        });
        
        if (mounted) {
          setAnalyzingCount(pendingJobs.length);
        }

        if (pendingJobs.length === 0) {
           return;
        }

        isProcessingRef.current = true;
        if (mounted) setIsProcessing(true);

        const chunk = pendingJobs.slice(0, CHUNK_SIZE);
        
        await Promise.all(chunk.map(async (job) => {
          if (job.semantic_status === 'failed') {
            retryMap.set(job.id, (retryMap.get(job.id) || 0) + 1);
          }
          await analyzeJobWithOllama(job);
        }));

        if (mounted) {
           triggerRefresh();
        }
      } catch (e) {
        console.error("Background analyzer error", e);
      } finally {
        isProcessingRef.current = false;
        if (mounted) setIsProcessing(false);
      }
    }

    const interval = setInterval(processQueue, 5000);
    processQueue();

    return () => {
      mounted = false;
      clearInterval(interval);
    }
  }, [triggerRefresh]);

  return { analyzingCount, isProcessing };
}
