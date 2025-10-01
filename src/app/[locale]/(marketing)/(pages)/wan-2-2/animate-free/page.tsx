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
  'animate free',
  'wan animate 2.2',
  'wan2.2',
  'wan 2.2 营销',
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
    metadataTitle: 'animate free x wan 2.2 获取策略',
    metadataDescription:
      '结合 animate free 渠道和 wan animate 2.2 能力，打造 wan 2.2 关键词矩阵、营收模型与社群增长方案。',
    badge: 'wan 2.2 营销打法',
    heading: 'animate free 与 wan 2.2 的增长闭环',
    summary:
      '规划关键词集群、内容资产、转化漏斗与社群运营，让 wan 2.2 内容页持续获得高质量流量。',
    paragraphs: [
      '围绕 wan 2.2 的搜索需求，我们将关键词体系划分为核心词（wan 2.2、wan animate 2.2）、功能词（wan 2.2 模型、wan 2.2 workflow）和转化词（wan 2.2 教程、wan 2.2 下载）。每组词都对应一个内容模块与 CTA，保证用户在任意入口都能进入联系表单或体验流程。',
      '在 animate free 渠道中，可首发 wan 2.2 教程合集，结合 30 秒短视频展示模型优势，再引导观众进入我们制作的深度文章，如《wan 2.2 模型矩阵》与《wan 2.2 工作流》。短链统一使用 UTM 参数，便于追踪转化来源。',
      '为了提升社群活跃度，可以利用 animate free 的积分体系，设置“首个 wan 2.2 成片”与“最佳 animate free 模板”两档任务。参赛者需提交作品链接与提示词，我们根据评分给出改进建议，并邀请优秀案例进入闭门分享，形成学习型社区。',
      '销售漏斗以三层结构展开：顶部通过 SEO 与社群内容吸引 wan 2.2 关键词流量，中部提供 7 天工作流试用包与 animate free 模板下载，底部安排演示会或付费项目咨询。每层都设有 wan 2.2 相关素材库和 FAQ，确保客户成功团队快速响应。',
      '在营收侧，可以设计三类方案：试运营套餐（含 10 支 wan 2.2 视频 + animate free 年度权限）、品牌大片套餐（新增剧情策划、演员替换）以及平台集成套餐（提供 API 与监控接入）。通过 CRM 标记预算区间与所需模型资源，实现精细化报价。',
      '内容资产方面，建议每月更新一次 wan 2.2 行业案例洞察，分析不同垂类的播放量、互动率和 ROI，将 animate free 的数据看板截图加入报告，形成可信背书。',
      '为了扩展国际市场，可将英文版内容分发到 Product Hunt、Reddit 的 AI 视频社区，同时同步到 GitHub README，展示我们围绕 wan 2.2 的开源工具与模板。',
      '监测层面，构建仪表盘追踪搜索排名、点击率、转化率与付费转化周期。结合 animate free 的用户行为数据，识别活跃节点，持续优化 wan 2.2 关键词集群的投放与内容节奏。',
    ],
  },
  en: {
    metadataTitle: 'animate free + wan 2.2 Growth Strategy',
    metadataDescription:
      'Blend animate free distribution with wan animate 2.2 to build keyword clusters, revenue playbooks, and community loops for wan 2.2.',
    badge: 'wan 2.2 Growth',
    heading: 'Closing the animate free & wan 2.2 Growth Loop',
    summary:
      'Design keyword maps, content assets, conversion funnels, and community programs so wan 2.2 pages attract and convert qualified demand.',
    paragraphs: [
      'Segment the keyword universe into core phrases (wan 2.2, wan animate 2.2), capability terms (wan 2.2 models, wan 2.2 workflow), and intent phrases (wan 2.2 tutorial, wan 2.2 download). Each cluster receives a dedicated content asset and CTA so visitors can always reach a demo or trial signup.',
      'Launch snackable animate free tutorials showcasing wan 2.2 advantages in 30-second reels, then drive viewers to in-depth resources like the “wan 2.2 Model Matrix” and “wan 2.2 Workflows” pages. Track every share with UTM-tagged short links to measure conversion origin.',
      'Boost community retention with animate free missions such as “First wan 2.2 Clip” and “Top animate free Template.” Participants submit renders and prompt notes, we provide editorial feedback, and the best entries join a private teardown session that reinforces the learning loop.',
      'Structure the funnel into three layers: top-of-funnel SEO and social discovery, mid-funnel seven-day workflow kits plus animate free template bundles, and bottom-of-funnel demo calls or paid project scoping. Maintain wan 2.2 asset libraries and FAQs at every step so customer success can respond instantly.',
      'Commercially, craft three offerings: a pilot bundle (10 wan 2.2 videos + animate free annual seat), a flagship storytelling package (adds narrative planning and talent replacement), and a platform integration plan (API access and monitoring). Tag budget bands and required model resources in the CRM for precise scoping.',
      'Refresh monthly industry insight posts analysing wan 2.2 performance across verticals, including watch-time, engagement, and ROI benchmarks. Embed animate free dashboard screenshots to reinforce credibility.',
      'To reach global audiences, syndicate the English content on Product Hunt, Reddit’s AI video communities, and your GitHub README, highlighting open-source tools and templates built around wan 2.2.',
      'Build a dashboard tracking rankings, CTR, conversion rate, and payback period. Combine animate free behavioural data to spot stickiness moments and keep tuning the wan 2.2 keyword cluster cadence.',
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
      getUrlWithLocale('/wan-2-2/animate-free', availableLocale as Locale),
    ])
  );

  return constructMetadata({
    title: content.metadataTitle,
    description: content.metadataDescription,
    canonicalUrl: getUrlWithLocale('/wan-2-2/animate-free', locale),
    keywords: KEYWORDS,
    languageAlternates,
  });
}

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Wan22AnimateFreePage({ params }: PageProps) {
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
