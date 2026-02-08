import PricingSection from '@/components/blocks/pricing/pricing';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Compass,
  Globe,
  Layers,
  PenTool,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';
import type { Locale } from 'next-intl';

interface HeroCopy {
  badge: string;
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
}

interface ClusterCopy {
  title: string;
  description: string;
  bullets: string[];
}

interface ClusterSectionCopy {
  title: string;
  description: string;
  items: ClusterCopy[];
}

interface WorkflowStepCopy {
  phase: string;
  title: string;
  description: string;
  deliverable: string;
}

interface WorkflowCopy {
  title: string;
  description: string;
  steps: WorkflowStepCopy[];
}

interface ModuleCopy {
  title: string;
  tag: string;
  body: string;
  metrics: string[];
}

interface ModuleSectionCopy {
  title: string;
  description: string;
  items: ModuleCopy[];
}

interface CaseStudyCopy {
  title: string;
  industry: string;
  summary: string;
  impact: string;
}

interface CaseStudySectionCopy {
  title: string;
  description: string;
  items: CaseStudyCopy[];
}

interface FAQCopy {
  title: string;
  items: { question: string; answer: string }[];
}

interface CTASectionCopy {
  title: string;
  description: string;
  primary: string;
  secondary: string;
}

export interface ToolsPageCopy {
  title: string;
  description: string;
  hero: HeroCopy;
  clusters: ClusterSectionCopy;
  workflow: WorkflowCopy;
  modules: ModuleSectionCopy;
  caseStudies: CaseStudySectionCopy;
  faq: FAQCopy;
  ctaSection: CTASectionCopy;
}

interface ToolsLandingProps {
  copy: ToolsPageCopy;
  locale: Locale;
}

const clusterIcons = [Sparkles, Workflow, Users, BarChart3] as const;
const moduleIcons = [PenTool, Layers, Compass, Globe] as const;
const caseIcons = [Activity, Sparkles, BarChart3] as const;

export function ToolsLanding({ copy, locale }: ToolsLandingProps) {
  return (
    <div className="space-y-24 bg-[#020414] pb-20 text-white">
      <ToolsHero hero={copy.hero} />
      <ToolsClusters clusters={copy.clusters} />
      <ToolsWorkflow workflow={copy.workflow} />
      <ToolsModules modules={copy.modules} />
      <ToolsCaseStudies caseStudies={copy.caseStudies} />

      <section id="pricing" className="container mx-auto px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(56,103,255,0.65)] backdrop-blur">
          <PricingSection />
        </div>
      </section>

      <ToolsFAQ faq={copy.faq} />
      <ToolsCTA cta={copy.ctaSection} locale={locale} />
    </div>
  );
}

function ToolsHero({ hero }: { hero: HeroCopy }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#020414] via-transparent" />
      </div>
      <div className="relative z-10">
        <div className="container mx-auto grid gap-12 px-4 pt-16 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <Badge className="w-fit border border-blue-500/40 bg-blue-500/10 text-blue-200">
              {hero.badge}
            </Badge>
            <h1 className="text-3xl font-serif font-bold leading-tight sm:text-5xl md:text-6xl">
              {hero.title}
            </h1>
            <p className="max-w-2xl text-lg text-slate-200">{hero.subtitle}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LocaleLink
                href={Routes.Register}
                className={cn(
                  'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600'
                )}
              >
                {hero.primary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </LocaleLink>
              <LocaleLink
                href={Routes.Contact}
                className={cn(
                  'inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10'
                )}
              >
                {hero.secondary}
              </LocaleLink>
            </div>
          </div>

          <div className="relative hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_50px_140px_-60px_rgba(56,103,255,0.45)] backdrop-blur lg:block">
            <div className="space-y-6 text-sm text-slate-200">
              <div className="flex items-center gap-3 rounded-2xl bg-black/30 p-4">
                <Sparkles className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-blue-100">
                    Sora2 tool station
                  </p>
                  <p className="text-base text-white">
                    Unified dashboard for prompts, governance, and delivery
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    label: 'Launch velocity boost',
                    value: '3.4x',
                  },
                  {
                    label: 'Prompt reuse rate',
                    value: '78%',
                  },
                  {
                    label: 'Approval cycle reduction',
                    value: '62%',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                  >
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {item.label}
                    </span>
                    <span className="text-xl font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs leading-relaxed text-blue-100">
                sora2video.online keeps every launch governed with traceable
                sora prompts, collaborative notes, and automated distribution
                macros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsClusters({ clusters }: { clusters: ClusterSectionCopy }) {
  return (
    <section className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-serif font-bold md:text-4xl">
          {clusters.title}
        </h2>
        <p className="mt-4 text-lg text-slate-300">{clusters.description}</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-4">
        {clusters.items.map((item, index) => {
          const Icon = clusterIcons[index] ?? Sparkles;
          return (
            <Card
              key={item.title}
              className="h-full border-white/10 bg-white/5 shadow-[0_30px_120px_-70px_rgba(56,103,255,0.55)] transition hover:-translate-y-1 hover:border-blue-400/40"
            >
              <CardContent className="space-y-4 p-6 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ToolsWorkflow({ workflow }: { workflow: WorkflowCopy }) {
  return (
    <section className="bg-[#050926]/80 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-serif font-bold md:text-4xl">
            {workflow.title}
          </h2>
          <p className="mt-4 text-lg text-slate-300">{workflow.description}</p>
        </div>
        <div className="mt-16 space-y-8">
          {workflow.steps.map((step) => (
            <div
              key={step.phase}
              className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur md:grid-cols-[0.2fr_1fr_1fr]"
            >
              <div className="text-2xl font-semibold text-blue-300">
                {step.phase}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-300">{step.description}</p>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
                {step.deliverable}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolsModules({ modules }: { modules: ModuleSectionCopy }) {
  return (
    <section className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-serif font-bold md:text-4xl">
          {modules.title}
        </h2>
        <p className="mt-4 text-lg text-slate-300">{modules.description}</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {modules.items.map((module, index) => {
          const Icon = moduleIcons[index] ?? Sparkles;
          return (
            <Card
              key={module.title}
              className="h-full border-white/10 bg-[#080c24]/80 shadow-[0_40px_120px_-70px_rgba(56,103,255,0.45)]"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-slate-400">
                    <span>{module.tag}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-500" />
                    <span>Sora2</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    {module.title}
                  </h3>
                  <p className="text-sm text-slate-300">{module.body}</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {module.metrics.map((metric) => (
                    <li key={metric} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ToolsCaseStudies({
  caseStudies,
}: {
  caseStudies: CaseStudySectionCopy;
}) {
  return (
    <section className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-serif font-bold md:text-4xl">
          {caseStudies.title}
        </h2>
        <p className="mt-4 text-lg text-slate-300">{caseStudies.description}</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {caseStudies.items.map((item, index) => {
          const Icon = caseIcons[index] ?? Activity;
          return (
            <Card
              key={item.title}
              className="h-full border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-blue-400/40"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-xs uppercase tracking-wide text-slate-300">
                    {item.industry}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300">{item.summary}</p>
                </div>
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
                  {item.impact}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ToolsFAQ({ faq }: { faq: FAQCopy }) {
  return (
    <section className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-serif font-bold md:text-4xl">
          {faq.title}
        </h2>
      </div>
      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-4">
          {faq.items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-4"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-white">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm text-slate-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function ToolsCTA({ cta, locale }: { cta: CTASectionCopy; locale: Locale }) {
  return (
    <section className="container mx-auto px-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 p-10 text-center shadow-[0_60px_160px_-70px_rgba(56,103,255,0.45)]">
        <h2 className="text-3xl font-serif font-bold text-white md:text-4xl">
          {cta.title}
        </h2>
        <p className="mt-4 text-lg text-slate-200">{cta.description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LocaleLink
            href={Routes.Register}
            locale={locale}
            className={cn(
              'inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-200'
            )}
          >
            {cta.primary}
            <ArrowRight className="ml-2 h-4 w-4" />
          </LocaleLink>
          <LocaleLink
            href={Routes.Contact}
            locale={locale}
            className={cn(
              'inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20'
            )}
          >
            {cta.secondary}
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}

export default ToolsLanding;
