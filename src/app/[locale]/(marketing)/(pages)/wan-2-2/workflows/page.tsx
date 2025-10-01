import Container from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { routing } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

const KEYWORDS = [
  'wan 2.2 workflow',
  'wan 2.2',
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
    metadataTitle: 'wan 2.2 工作流与部署手册',
    metadataDescription:
      '指导在 ComfyUI、AnimateDiff 及云端渲染管线中部署 wan 2.2，整合 animate free 流量任务与 wan animate 2.2 替换流程。',
    badge: 'wan 2.2 工作流',
    heading: 'wan 2.2 全链路实施指南',
    summary:
      '覆盖环境准备、节点配置、监控闭环与团队协作，让 wan 2.2 成为稳定的商业化动画生产线。',
    paragraphs: [
      '第一步是建立统一的运行环境。推荐在专用 GPU 节点上部署 ComfyUI 并安装 WanVideoWrapper，加载 wan 2.2 推理权重后通过 YAML 定义采样器、调度器与 MoE 路由器。对于 animate free 的营销任务，可提前把提示词、风格模板写入工作流节点，保障团队拉起流程时保持一致。',
      '在工作流图中，将文本、图像和控制信号分别接入 Wan 2.2 的输入端，使用 AnimateDiff 或 ControlNet 节点辅助骨骼与镜头。对需要角色替换的镜头，添加 wan animate 2.2 的角色绑定节点，把关键帧网格映射到目标演员，确保在最终镜头中实现表情与光感同步。',
      '渲染调度建议采用批次化策略：根据 animate free 的活动节奏，把 wan 2.2 任务分成冷启动、热启动、补偿三类队列。冷启动用于全新项目，热启动用于复刻旧镜头，补偿队列处理失败片段。每个队列写入 redis 或数据库以便追踪剩余额度。',
      '为了保证一致性，可使用 prompt 版本化系统。将核心提示词、风格描述、摄影参数放入 Git 仓库，同步到 wan 2.2 的工作流节点，并在 PR 流程中进行审阅。我们在实践中结合了 lint 脚本，检验是否包含关键品牌语或版权材料。',
      '监控方面，可在推理完成后将耗时、GPU 使用率、失败原因写入日志，接入 Prometheus 或 ClickHouse。针对 animate free 的投放任务，额外记录每支 wan 2.2 视频的点击率与留资表现，帮助营销团队判断下一轮迭代。',
      '跨部门协作时，可以在 Notion 或自建 CMS 中保存 wan 2.2 产出的镜头元数据，包括 prompt、专家路径、审片意见与授权范围。设计团队可以直接引用这些数据进行二次调整，避免重复渲染。',
      '上线前需通过异常恢复演练：模拟 MoE 子模型加载失败、提示词缺失、素材路径无效等场景，验证报警与回滚。建议在 animate free 管理后台配置任务重跑按钮，并限制最大重试次数。',
      '最终交付阶段，把 wan 2.2 输出的序列接入后期合成或音频处理流程。若使用 animate free 推送到社媒，可调用其日程与分发 API，同步发布状态，确保内容上线、投放、监测均在同一面板完成。',
    ],
  },
  en: {
    metadataTitle: 'wan 2.2 Workflow Implementation Guide',
    metadataDescription:
      'Deploy wan 2.2 inside ComfyUI, AnimateDiff, and cloud render farms while orchestrating animate free briefs and the wan animate 2.2 replacement pipeline.',
    badge: 'wan 2.2 Workflows',
    heading: 'End-to-End wan 2.2 Workflow Playbook',
    summary:
      'From environment setup to monitoring, learn how to turn wan 2.2 into a dependable production line for commercial animation and campaign content.',
    paragraphs: [
      'Start by standardising the runtime. Spin up dedicated GPU nodes, install ComfyUI plus WanVideoWrapper, and register wan 2.2 weights alongside your schedulers and MoE router. Feed animate free prompt libraries and style presets directly into node parameters so collaborators launch with consistent defaults.',
      'Route text, imagery, and control signals into the Wan 2.2 entry points, leaning on AnimateDiff or ControlNet nodes for motion supervision. When a shot needs character replacement, append wan animate 2.2 retargeting blocks to map mesh data onto performers and preserve lighting continuity.',
      'Batch scheduling keeps renders predictable. Segment wan 2.2 jobs into cold-start, warm-start, and recovery queues aligned with animate free campaign cadences. Persist each queue in Redis or your database so product teams can track quotas and reruns.',
      'Version prompts the same way you version code. Store headline prompts, cinematic descriptors, and camera metadata in Git, load them into wan 2.2 workflows, and review changes via pull request. We pair this with lint scripts that flag missing brand lines or restricted assets.',
      'Instrument the pipeline by logging duration, GPU load, and failure reasons as soon as inference concludes, then ship the metrics into Prometheus or ClickHouse. For animate free activation, append downstream KPIs such as click-through rate and lead capture so marketers can iterate intelligently.',
      'For collaboration, keep a CMS of wan 2.2 outputs with prompts, expert routing, reviewer comments, and licence notes. Designers can reference this catalogue instead of regenerating footage from scratch.',
      'Run disaster drills before go-live: emulate MoE expert load failures, missing prompts, or invalid asset paths to validate alerts and rollback logic. In the animate free console, expose a controlled rerun button and cap retries to protect GPU budgets.',
      'During delivery, merge wan 2.2 sequences with post-production audio or compositing, then publish via animate free’s scheduling API. This keeps publishing, paid amplification, and monitoring aligned in one dashboard.',
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
      getUrlWithLocale('/wan-2-2/workflows', availableLocale as Locale),
    ])
  );

  return constructMetadata({
    title: content.metadataTitle,
    description: content.metadataDescription,
    canonicalUrl: getUrlWithLocale('/wan-2-2/workflows', locale),
    keywords: KEYWORDS,
    languageAlternates,
  });
}

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Wan22WorkflowsPage({ params }: PageProps) {
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
