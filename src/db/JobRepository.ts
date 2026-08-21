import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Job, JobStatus } from '../types/job';

interface JobsRobDB extends DBSchema {
  jobs: {
    key: string;
    value: Job;
    indexes: {
      'by-status': JobStatus;
    };
  };
}

const DB_NAME = 'JobsRobDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<JobsRobDB>> | null = null;

export const JobRepository = {
  async init(): Promise<IDBPDatabase<JobsRobDB>> {
    if (!dbPromise) {
      dbPromise = openDB<JobsRobDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          const store = db.createObjectStore('jobs', { keyPath: 'id' });
          store.createIndex('by-status', 'status');
        },
      });
    }
    return dbPromise;
  },

  async save(job: Job): Promise<void> {
    const db = await this.init();
    
    const existing = await db.get('jobs', job.id);
    
    if (existing) {
      const updatedJob: Job = {
        ...job,
        status: existing.status,
        discovered_at: existing.discovered_at,
        last_seen_at: job.last_seen_at || new Date().toISOString(),
        semantic_status: existing.semantic_status !== undefined ? existing.semantic_status : job.semantic_status
      };
      await db.put('jobs', updatedJob);
    } else {
      await db.add('jobs', job);
    }
  },

  async saveMany(jobs: Job[]): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('jobs', 'readwrite');
    
    for (const job of jobs) {
      const existing = await tx.store.get(job.id);
      if (existing) {
        const updatedJob: Job = {
          ...job,
          status: existing.status,
          discovered_at: existing.discovered_at,
          last_seen_at: job.last_seen_at || new Date().toISOString()
        };
        await tx.store.put(updatedJob);
      } else {
        await tx.store.add(job);
      }
    }
    await tx.done;
  },

  async getById(id: string): Promise<Job | undefined> {
    const db = await this.init();
    return db.get('jobs', id);
  },

  async getAll(): Promise<Job[]> {
    const db = await this.init();
    return db.getAll('jobs');
  },

  async updateStatus(id: string, status: JobStatus): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('jobs', 'readwrite');
    const job = await tx.store.get(id);
    if (job) {
      job.status = status;
      await tx.store.put(job);
    }
    await tx.done;
  },

  async delete(id: string): Promise<void> {
    const db = await this.init();
    await db.delete('jobs', id);
  },

  async clear(): Promise<void> {
    const db = await this.init();
    await db.clear('jobs');
  },

  async findBySource(sourceName: string, externalId: string): Promise<Job | undefined> {
    const db = await this.init();
    const all = await db.getAll('jobs');
    return all.find(j => j.sources.some(s => s.source_name === sourceName && s.id === externalId));
  },

  async findByCanonicalId(canonicalId: string): Promise<Job | undefined> {
    return this.getById(canonicalId);
  }
};
