import { generateKlingVideo } from '@/lib/ai/kling';
import { generateSiliconflowVideo } from '@/lib/ai/siliconflow-video';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const maxDuration = 120;

const DEFAULT_SILICONFLOW_MODEL = 'Wan-AI/Wan2.2-T2V-A14B';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const {
      prompt,
      provider = 'siliconflow',
      model = DEFAULT_SILICONFLOW_MODEL,
      aspectRatio,
      duration,
      negativePrompt,
      cfgScale,
      numInferenceSteps,
      seed,
    } = body as {
      prompt?: string;
      provider?: 'siliconflow' | 'kling';
      model?: string;
      aspectRatio?: string;
      duration?: number;
      negativePrompt?: string;
      cfgScale?: number;
      numInferenceSteps?: number;
      seed?: number;
    };

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required to generate videos.' },
        { status: 400 }
      );
    }

    if (provider === 'siliconflow') {
      const result = await generateSiliconflowVideo({
        prompt,
        model,
        aspectRatio,
        numInferenceSteps,
        seed,
      });

      return NextResponse.json({
        provider,
        ...result,
      });
    }

    if (provider === 'kling') {
      const result = await generateKlingVideo({
        prompt,
        negativePrompt,
        aspectRatio: aspectRatio as '16:9' | '9:16' | '1:1' | undefined,
        duration: (duration === 10 ? 10 : 5) as 5 | 10,
        cfgScale,
      });

      return NextResponse.json({
        provider,
        ...result,
      });
    }

    return NextResponse.json(
      { error: `Unsupported provider: ${provider}` },
      { status: 400 }
    );
  } catch (error) {
    console.error('[sora2-video] Failed to generate video', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to generate video. Please try again later.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
