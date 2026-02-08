import { generateSiliconflowVideo } from '@/lib/ai/siliconflow-video';
import { describe, expect, it, vi } from 'vitest';

describe('generateSiliconflowVideo', () => {
  const baseUrl = 'https://api.silicon.test/v1';

  const ensureEnv = () => {
    process.env.SILICONFLOW_API_KEY = 'sf-key';
    process.env.SILICONFLOW_API_URL = baseUrl;
  };

  it('returns immediate result when submit response has video url', async () => {
    ensureEnv();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          video_url: 'https://video.example.com/out.mp4',
          cover_image_url: 'https://video.example.com/thumb.jpg',
          status: 'completed',
          request_id: 'req-1',
        }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await generateSiliconflowVideo({
      prompt: 'retro sora2 cinematic montage',
      model: 'Wan-AI/Wan2.2-T2V-A14B',
    });

    expect(result).toEqual({
      status: 'completed',
      videoUrl: 'https://video.example.com/out.mp4',
      coverImageUrl: 'https://video.example.com/thumb.jpg',
      requestId: 'req-1',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('polls the status endpoint until a successful response is received', async () => {
    ensureEnv();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ request_id: 'req-2' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'processing' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'succeeded',
          video_url: 'https://video.example.com/req-2.mp4',
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const result = await generateSiliconflowVideo({
      prompt: 'sunset sora2 cinematic timelapse',
      model: 'Wan-AI/Wan2.2-T2V-A14B',
      pollIntervalMs: 1,
      pollAttempts: 3,
    });

    expect(result).toEqual({
      status: 'completed',
      videoUrl: 'https://video.example.com/req-2.mp4',
      coverImageUrl: undefined,
      requestId: 'req-2',
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('throws when submit request fails', async () => {
    ensureEnv();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => JSON.stringify({ error: 'permission denied' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      generateSiliconflowVideo({ prompt: 'unauthorized', model: 'model' })
    ).rejects.toThrow('permission denied');
  });
});
