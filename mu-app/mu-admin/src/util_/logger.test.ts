// logger.test.ts
import { log, __private__ } from './logger';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// We assume your real logger.ts has a named export __private__ for testing internals (like queue)
// If not, I'll show you a pattern to add it cleanly.

// Mock Supabase client inside logger.ts
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: () => ({
        insert: vi.fn().mockResolvedValue({ error: null }),
        select: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
      }),
    }),
  };
});

describe('Logger', () => {
  beforeEach(() => {
    __private__.resetQueue(); // hypothetical helper that clears the queue
    vi.restoreAllMocks();
  });

  it('queues info logs correctly', async () => {
    await log.info({ message: 'Test Info', foo: 'bar' });
    const queued = __private__.getQueue();
    expect(queued.length).toBe(1);
    expect((queued[0].payload as any).message).toBe('Test Info');
  });
  
  it('queues warn logs correctly', async () => {
    await log.warn({ message: 'Test Warning', bar: 'baz' });
    const queued = __private__.getQueue();
    expect(queued.length).toBe(1);
    expect((queued[0].payload as any).message).toBe('Test Warning');
  });
  
  it('queues worldEvent logs correctly', async () => {
    await log.world({ event_type: 'world_signal_received', event: 'signal_received' });
    const queued = __private__.getQueue();
    expect(queued.length).toBe(1);
    expect((queued[0].payload as any).event).toBe('signal_received');
  });
  
  it('flushLogBuffer empties the queue', async () => {
    await log.info({ message: 'Flush Test' });
    expect(__private__.getQueue().length).toBe(1);
    await __private__.flushLogBuffer();
    expect(__private__.getQueue().length).toBe(0);
  });
  
  it('batches logs correctly when more than 50 queued', async () => {
    for (let i = 0; i < 120; i++) {
      await log.info({ message: `Batch ${i}` });
    }
    expect(__private__.getQueue().length).toBe(120);
    await __private__.flushLogBuffer();
    expect(__private__.getQueue().length).toBe(0);
  });
});
