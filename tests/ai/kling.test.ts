import { generateKlingVideo } from '@/lib/ai/kling';
import { describe, expect, it, vi } from 'vitest';

describe('generateKlingVideo', () => {
  const configureEnv = (overrides: Partial<NodeJS.ProcessEnv> = {}) => {
    if (overrides.KLING_ACCESS_KEY === undefined) {
      process.env.KLING_ACCESS_KEY = undefined;
    } else {
      process.env.KLING_ACCESS_KEY = overrides.KLING_ACCESS_KEY;
    }

    if (overrides.KLING_SECRET_KEY === undefined) {
      process.env.KLING_SECRET_KEY = undefined;
    } else {
      process.env.KLING_SECRET_KEY = overrides.KLING_SECRET_KEY;
    }

    if (!('KLING_ACCESS_KEY' in overrides)) {
      process.env.KLING_ACCESS_KEY = 'access';
    }
    if (!('KLING_SECRET_KEY' in overrides)) {
      process.env.KLING_SECRET_KEY = 'secret';
    }
  };

  it('throws when credentials are missing', async () => {
    configureEnv({ KLING_ACCESS_KEY: undefined, KLING_SECRET_KEY: undefined });
    await expect(
      generateKlingVideo({ prompt: 'missing creds' })
    ).rejects.toThrow('KLING_ACCESS_KEY / KLING_SECRET_KEY are not configured');
  });

  it('submits a task and resolves when polling succeeds', async () => {
    configureEnv();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ code: 0, data: { task_id: 'task-1' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 0,
          data: {
            task_status: 'succeed',
            task_result: { videos: [{ url: 'https://kling.ai/task-1.mp4' }] },
          },
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const result = await generateKlingVideo({
      prompt: 'kinetic typography sora2 cinematic card',
      aspectRatio: '16:9',
      duration: 5,
      pollIntervalMs: 1,
      pollAttempts: 2,
    });

    expect(result).toEqual({
      status: 'completed',
      videoUrl: 'https://kling.ai/task-1.mp4',
      requestId: 'task-1',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [, pollOptions] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(pollOptions?.method).toBe('POST');
  });

  it('bubbles up Kling API errors', async () => {
    configureEnv();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: 42, message: 'task rejected' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      generateKlingVideo({ prompt: 'bad task', pollIntervalMs: 1 })
    ).rejects.toThrow('task rejected');
  });
});
