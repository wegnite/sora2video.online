import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  Brain,
  Compass,
  FileText,
  Globe,
  Layers,
  Megaphone,
  PenLine,
  Rocket,
  Sparkles,
  Target,
  Timer,
} from 'lucide-react';

const STRATEGY_COLUMNS = [
  {
    icon: Brain,
    title: 'Sora2 narrative intelligence',
    description:
      'sora2 analyses arcs, characters, and tone so every sora prompt stays loyal to the creative bible and campaign KPIs.',
  },
  {
    icon: Layers,
    title: 'Layered sora 2 control',
    description:
      'Blend camera rigs, FX passes, and motion cues while the sora 2 engine maintains realism across revisions and late notes.',
  },
  {
    icon: Globe,
    title: 'Global-ready compliance',
    description:
      'Every master routes through sora2 governance, logging territory versions, usage rights, and accessibility notes automatically.',
  },
  {
    icon: Target,
    title: 'Performance telemetry',
    description:
      'KPI tags flow through sora2 dashboards so growth teams know which sequences deserve media spend or variant testing.',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Frame the world',
    description:
      'Upload references, mood boards, and product specs; sora2 maps the environment graph and blocks cinematic movement instantly.',
  },
  {
    step: '02',
    title: 'Author sora prompts',
    description:
      'Compose each sora prompt beside storyboards so the system harmonises dialogue beats, physics cues, and brand guardrails.',
  },
  {
    step: '03',
    title: 'Review in context',
    description:
      'Legal, strategy, and localisation teams annotate frames inside sora2 and lock hero shots without leaving the secure workspace.',
  },
  {
    step: '04',
    title: 'Publish everywhere',
    description:
      'Render social, OOH, and broadcast masters from the sora 2 pipeline with metadata flowing straight to asset libraries.',
  },
];

const PROMPT_PILLARS = [
  {
    icon: PenLine,
    title: 'Context-first sora prompt',
    description:
      'Lead with objective, audience, and emotional tone so sora2 can stage cameras, blocking, and pacing intelligently.',
  },
  {
    icon: Sparkles,
    title: 'Physics and texture cues',
    description:
      'Describe light, materials, and kinetic beats; the sora 2 renderer turns those prompts into grounded simulations.',
  },
  {
    icon: FileText,
    title: 'Delivery tokens',
    description:
      'Add aspect ratios, runtime, and caption rules so every sora prompt becomes a reusable sora2 template.',
  },
];

const INDUSTRY_USE_CASES = [
  {
    icon: Megaphone,
    title: 'Streaming premieres',
    description:
      'Entertainment teams preload arcs inside sora2 so episodes launch with coordinated trailers, teasers, and post-credit stingers.',
  },
  {
    icon: Rocket,
    title: 'Game reveals',
    description:
      'Studios remix gameplay feeds into lore-driven trailers using sora prompt recipes tuned for fandom hype.',
  },
  {
    icon: Compass,
    title: 'Retail journeys',
    description:
      'Commerce crews pair product hero shots with UGC to craft sora2 shopping films that convert across devices.',
  },
  {
    icon: Timer,
    title: 'Learning moments',
    description:
      'Education partners transform dense scripts into visual explainers while sora2 keeps terminology and accessibility precise.',
  },
];

const DATA_METRICS = [
  { value: '44%', label: 'Lower production spend via sora2 automation' },
  { value: '3.8x', label: 'Faster iteration loops with sora 2' },
  {
    value: '21 regions',
    label: 'Campaigns localised through sora2 governance',
  },
];

export function Sora2Insights() {
  return (
    <div id="sora2-overview" className="space-y-16">
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            sora2 strategy blueprint
          </Badge>
          <h2 className="text-3xl font-serif font-bold md:text-4xl">
            Why modern launch teams standardise on sora2
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Experiential drops, fandom premieres, and executive comms rely on
            sora2 to balance speed with depth. With the sora 2 control tier you
            orchestrate approvals, security, and reuse inside one stack while
            every asset stays audit-ready.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Each sora prompt is analysed by the sora2 engine to align camera
            language, character beats, and compliance notes. Strategy, creative,
            and localisation teams stay synced long after opening night.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {STRATEGY_COLUMNS.map((item) => (
            <Card key={item.title} className="border-white/10 bg-white/5">
              <CardHeader className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-white">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-200">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/10 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-serif font-bold">
              The sora2 production workflow
            </h3>
            <p className="mt-4 text-muted-foreground">
              Map every stakeholder touchpoint into a single timeline. sora2
              keeps creative velocity high without losing governance or clarity.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {WORKFLOW_STEPS.map((step) => (
              <Card
                key={step.step}
                className="border-white/10 bg-[#080c24]/70 text-white"
              >
                <CardHeader className="flex items-center gap-4">
                  <div className="text-2xl font-semibold text-blue-300">
                    {step.step}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-200">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h3 className="text-2xl font-serif font-bold">
              Crafting a winning sora prompt
            </h3>
            <p className="mt-4 text-muted-foreground">
              Treat prompts as miniature creative briefs. sora2 reads context,
              tone, and physics cues simultaneously, letting your studio
              automate previs while staying on-brand.
            </p>

            <div className="mt-8 space-y-6">
              {PROMPT_PILLARS.map((pillar) => (
                <div key={pillar.title} className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
                    <pillar.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-slate-200">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-white/10 bg-white/5">
            <CardContent className="space-y-6 p-8 text-slate-200">
              <h4 className="text-xl font-semibold text-white">
                Sample pitch-ready sora prompt
              </h4>
              <p className="rounded-2xl border border-blue-500/30 bg-black/40 p-6 text-sm leading-relaxed">
                “Compose a 16-second reveal of our adaptive EV interior. Track
                the camera along a floating spline, bathe the cabin in aurora
                lighting, pepper in kinetic UI overlays, and export 1:1 and 9:16
                masters through sora2 with captions for LATAM markets.”
              </p>
              <p className="text-sm text-slate-300">
                Note how objective, emotional tone, physics cues, and delivery
                frames live inside one sora prompt. sora2 interprets those
                details and aligns lighting, animation, and outputs instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-[#050926] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="text-2xl font-serif font-bold text-white">
                Industries moving faster with sora2
              </h3>
              <p className="mt-4 text-slate-300">
                Repeatable playbooks let every team customise sora2 without
                compromising brand safety. Combine narrative templates, music
                cues, and delivery macros to launch weekly instead of quarterly.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {DATA_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white"
                >
                  <div className="text-2xl font-semibold">{metric.value}</div>
                  <div className="mt-2 text-sm text-slate-200">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {INDUSTRY_USE_CASES.map((useCase) => (
              <Card key={useCase.title} className="border-white/10 bg-white/5">
                <CardHeader className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-200">
                    <useCase.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg text-white">
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-200">
                    {useCase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 p-10 text-center text-white">
          <h3 className="text-2xl font-serif font-bold">
            Ready to orchestrate your next release on sora2?
          </h3>
          <p className="mt-4 text-lg text-slate-200">
            Combine strategy decks, brand systems, and creative vision in one
            orchestrated timeline. When sora2 handles the render stack, your
            team spends more time on storytelling and less time on logistics.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-200"
            >
              Book a sora 2 pilot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              Download the sora2 workflow kit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sora2Insights;
