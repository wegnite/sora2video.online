import { generateNanoBananaImages } from '@/lib/ai/nano-banana';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('generateNanoBananaImages', () => {
  const baseUrl = 'https://api.nano.test/v1';

  const setEnv = (overrides: Record<string, string | undefined> = {}) => {
    process.env.NANO_BANANA_API_KEY = overrides.NANO_BANANA_API_KEY ?? 'nb-key';
    process.env.NANO_BANANA_API_URL = overrides.NANO_BANANA_API_URL ?? baseUrl;
    process.env.SILICONFLOW_IMAGE_MODEL =
      overrides.SILICONFLOW_IMAGE_MODEL ??
      'stabilityai/stable-diffusion-3-5-large';
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends the expected payload and returns image urls', async () => {
    setEnv();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { url: 'https://cdn.example.com/image-1.png' },
          { b64_json: 'data:image/png;base64,zzz=' },
        ],
        id: 'req-123',
      }),
      text: async () => '',
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await generateNanoBananaImages({
      prompt: 'A cozy coffee shop sora2 cinematic frame',
      aspectRatio: '1:1',
      quality: 'hd',
      numImages: 2,
      seed: 42,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${baseUrl}/images/generations`);
    expect(options?.method).toBe('POST');
    expect(options?.headers).toMatchObject({
      Authorization: 'Bearer nb-key',
      'Content-Type': 'application/json',
    });

    const body = JSON.parse(String(options?.body));
    expect(body).toMatchObject({
      prompt: 'A cozy coffee shop sora2 cinematic frame',
      n: 2,
      size: '1024x1024',
      quality: 'hd',
      model: 'stabilityai/stable-diffusion-3-5-large',
      seed: 42,
    });

    expect(result).toEqual({
      images: [
        'https://cdn.example.com/image-1.png',
        'data:image/png;base64,zzz=',
      ],
      requestId: 'req-123',
    });
  });

  it('throws when API key is not configured', async () => {
    setEnv({ NANO_BANANA_API_KEY: '' });
    await expect(
      generateNanoBananaImages({ prompt: 'Missing key check' })
    ).rejects.toThrow('NANO_BANANA_API_KEY');
  });

  it('throws descriptive error when request fails', async () => {
    setEnv();

    const serialized = JSON.stringify({ error: { message: 'invalid prompt' } });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => JSON.parse(serialized),
      text: async () => serialized,
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      generateNanoBananaImages({ prompt: 'Bad request' })
    ).rejects.toThrow('invalid prompt');
  });
});
