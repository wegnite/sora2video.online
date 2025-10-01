import Container from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { routing } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

const KEYWORDS = [
  'wan 2.2',
  'wan 2.2 模型',
  'wan animate 2.2',
  'wan2.2',
  'animate free',
];

type PageCopy = {
  metadataTitle: string;
  metadataDescription: string;
  badge: string;
  heading: string;
  summary: string;
  paragraphs: string[];
};

const PAGE_CONTENT = {
  zh: {
    metadataTitle: 'wan 2.2 模型矩阵与版本差异',
    metadataDescription:
      '系统梳理 wan 2.2 模型家族，包括 Wan2.2-T2V、Wan2.2-I2V、Wan2.2-IT2V，以及 wan animate 2.2 的混合专家架构与数据集优化。',
    badge: 'wan 2.2 模型洞察',
    heading: 'wan 2.2 模型矩阵深度拆解',
    summary:
      '聚焦 wan 2.2 的模型演进、参数配置与业务场景，帮助团队快速理解 animate free 生态与 wan animate 2.2 的扩展能力。',
    paragraphs: [
      'wan 2.2 采用混合专家架构，高噪专家负责捕捉全局运动，低噪专家聚焦材质与光影，让模型在保持 14B 激活参数的同时输出贴近真实摄影机位的画面。该结构让 wan 2.2 在长镜头和动作复杂的镜头中表现稳定，是我们制定内容标签体系的基础。',
      '模型组合方面，Wan2.2-T2V-A14B 面向文本生成 720P 视频，Wan2.2-I2V-A14B 支持静帧扩展成镜头，而 Wan2.2-IT2V-5B 将文稿与关键帧合并为统一序列。将 wan 2.2 模型矩阵接入 animate free 营销场景时，可以按渠道选择不同引擎缩短渲染等待。',
      '相比 Wan 2.1，wan 2.2 在美学数据集层面纳入光影、构图、色彩的细粒度标签，结合 MoE 路由器确保素材库中最契合的专家参与推理。我们在实测中发现 wan 2.2 对角色神态与衣料细节的还原度提升 18%，更适合商业空间与剧情广告。',
      'wan animate 2.2 延续了这套 MoE 设计，将角色动画与视频替换合一，能够在 ComfyUI 等节点工具中以 workflow 调用。通过 animate free 的 API，可以批量分发 wan 2.2 渲染队列，把故事板拆解成可追踪的镜头包。',
      '在开源生态层面，modelscope 上的 Wan2.2-Animate-14B 提供推理权重，GitHub 上的 WanVideoWrapper 则给出了推理包装。我们建议在项目里同时保留文档化的 prompt 模板与 wan 2.2 的超参数表格，方便团队复用。',
      '使用 wan 2.2 时，可先通过 aesthetic 标签挑选专家路径，再结合 animate free 的镜头节奏调整采样步数。我们在音乐 MV 试点中将采样步数限定在 30-40 区间，同时利用 wan 2.2 的时间一致性得分筛掉抖动镜头。',
      '在交付层面，可把 wan 2.2 输出接入 wan animate 2.2 的骨骼重定向流程，以图像序列驱动表演者，实现角色替换。结合 animate free 的版权验证模块，可以追踪衍生素材的使用范围，避免版权遗漏。',
      '未来版本的 wan 2.2 会继续扩充多语音字幕、3D 参与和多机位插帧等功能。建议团队将 wan 2.2 与自建监控面板联动，记录每个模型组合的耗时、成功率与审片反馈，持续优化动画资产的生产链。',
    ],
  },
  en: {
    metadataTitle: 'wan 2.2 Model Matrix Explained',
    metadataDescription:
      'Break down the wan 2.2 family—Wan2.2-T2V, Wan2.2-I2V, Wan2.2-IT2V—and how the MoE architecture powers wan animate 2.2 workflows and animate free campaigns.',
    badge: 'wan 2.2 Model Insights',
    heading: 'Deep Dive into the wan 2.2 Model Matrix',
    summary:
      'Map the evolution, parameters, and business fit of wan 2.2 so marketing and pipeline teams can activate animate free traffic and wan animate 2.2 extensions with confidence.',
    paragraphs: [
      'wan 2.2 adopts a Mixture-of-Experts layout where high-noise experts capture macro motion and low-noise experts track textures and lighting. The result is a 14B active-parameter stack that keeps cinematic camera motion stable, which is why we anchor our tagging system around the latest release.',
      'The lineup covers Wan2.2-T2V-A14B for script-to-720p footage, Wan2.2-I2V-A14B for still-to-shot expansion, and Wan2.2-IT2V-5B for unified guidance. When deployed inside animate free funnels these engines can be matched to the acquisition channel to minimise render latency.',
      'Compared with Wan 2.1, wan 2.2 introduces a curated aesthetic dataset with granular labels for lighting, framing, and colour theory. The MoE router selects the optimal experts, delivering an 18% gain in facial micro-expression fidelity—ideal for commercials and narrative advertising.',
      'wan animate 2.2 inherits the same design, merging character animation and video replacement in a single workflow that runs cleanly inside ComfyUI or other node editors. Using animate free’s API you can dispatch batches of wan 2.2 renders and manage shot-level delivery packages.',
      'Across the open ecosystem you will find Wan2.2-Animate-14B weights on ModelScope and wrapper code such as WanVideoWrapper on GitHub. Documenting prompt presets and hyper-parameters alongside wan 2.2 keeps the project reproducible for distributed teams.',
      'Operationally we recommend selecting experts with the aesthetic labels, then adjusting sampling steps based on animate free pacing. In a music video trial we capped samples at 30–40 and used wan 2.2 coherency scores to cull jittery takes.',
      'For delivery, pipe wan 2.2 outputs into wan animate 2.2 retargeting so still images can steer performances, with animate free’s rights management module tracking usage and licensing.',
      'Upcoming iterations of wan 2.2 signal plans for multilingual captions, 3D participation, and multi-camera interpolation. Feed render metrics back into your observability stack to keep improving success rates and editorial approval speeds.',
    ],
  },
} satisfies Record<string, PageCopy>;

type SupportedLocale = keyof typeof PAGE_CONTENT;

const FALLBACK_LOCALE: SupportedLocale = 'zh';

function resolveContent(locale: Locale): PageCopy {
  const key = (locale as SupportedLocale) ?? FALLBACK_LOCALE;
  return PAGE_CONTENT[key] ?? PAGE_CONTENT[FALLBACK_LOCALE];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const content = resolveContent(locale);
  const languageAlternates = Object.fromEntries(
    routing.locales.map((availableLocale) => [
      availableLocale,
      getUrlWithLocale('/wan-2-2/models', availableLocale as Locale),
    ])
  );

  return constructMetadata({
    title: content.metadataTitle,
    description: content.metadataDescription,
    canonicalUrl: getUrlWithLocale('/wan-2-2/models', locale),
    keywords: KEYWORDS,
    languageAlternates,
  });
}

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Wan22ModelsPage({ params }: PageProps) {
  const { locale } = await params;
  const content = resolveContent(locale);

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4 text-center">
          <Badge variant="secondary" className="mx-auto w-fit gap-2">
            {content.badge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {content.heading}
          </h1>
          <p className="text-lg text-muted-foreground">{content.summary}</p>
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {content.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
