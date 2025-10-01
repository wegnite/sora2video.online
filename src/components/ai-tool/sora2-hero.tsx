import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  BarChart3,
  Film,
  Layers,
  PlayCircle,
  Sparkles,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';

const HERO_FEATURES = [
  {
    icon: Sparkles,
    title: 'Sora2 cinematic intelligence',
    description:
      'sora2 renders physically-accurate sequences from every sora prompt, aligning lighting, motion, and story beats inside one secure canvas.',
  },
  {
    icon: Layers,
    title: 'Adaptive sora 2 layers',
    description:
      'Stack wardrobe, FX, and dialogue markers on sora 2 timelines so revisions stay organised across creative and marketing squads.',
  },
  {
    icon: Workflow,
    title: 'Prompt-to-premiere workflow',
    description:
      'Move from ideation to delivery by pairing sora prompt frameworks with automated QC, approvals, and channel-specific masters.',
  },
  {
    icon: Film,
    title: 'Studio-grade output',
    description:
      'Deliver Dolby-ready masters, social shorts, and interactive story loops through the sora2 render network without leaving the browser.',
  },
];

const HIGHLIGHT_STATS = [
  { value: '18K+', label: 'Campaigns launched with sora2' },
  { value: '71%', label: 'Fewer reshoots across sora 2 crews' },
  { value: '9.8', label: 'Creator rating for sora2video' },
];

const RIGHT_PANEL_NOTES = [
  '• Story maps sync live inside sora2 so directors and strategists co-edit every sora prompt in context.',
  '• Compliance filters monitor shots in real time, guarding each sora 2 release against policy surprises.',
  '• Delivery macros publish captions, metadata, and localised cuts straight from sora2video.online.',
];

export function Sora2Hero() {
  return (
    <section className="relative overflow-hidden bg-[#020414] text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#020414] via-transparent" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto grid gap-16 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="border-blue-500/40 bg-blue-500/10 text-blue-200"
              >
                sora2video.online — cinematic automation
              </Badge>
              <h1 className="text-4xl font-serif font-bold leading-tight sm:text-5xl md:text-6xl">
                Direct every frame with sora2 video intelligence
              </h1>
              <p className="text-lg text-slate-200">
                sora2 keeps ideation, previs, and launch cadence aligned. Feed a
                single sora prompt or an entire storyboard, and the sora 2
                engine renders motion, lighting, and audio cues side by side.
                Teams deliver faster because sora2 automates review loops while
                protecting brand precision.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600"
              >
                Launch with sora2 today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Build your next sora prompt
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {HERO_FEATURES.map((feature) => (
                <HeroFeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-16 right-12 hidden h-32 w-32 rounded-full bg-purple-500/20 blur-3xl md:block" />
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(56,103,255,0.65)] backdrop-blur">
              <div className="space-y-6">
                <Card className="border-none bg-[#080c24]/80 text-white shadow-lg">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold">
                        S2
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-wide text-slate-300">
                          sora2 conductor suite
                        </p>
                        <p className="text-xs text-slate-400">
                          Realtime authoring v3.0
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-slate-300">
                      {RIGHT_PANEL_NOTES.map((note) => (
                        <p key={note}>{note}</p>
                      ))}
                    </div>
                    <div className="grid gap-3 rounded-2xl bg-black/30 p-4">
                      {HIGHLIGHT_STATS.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs uppercase tracking-wide text-slate-400">
                            {stat.label}
                          </span>
                          <span className="text-xl font-semibold text-white">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="#sora2-overview"
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:from-cyan-300 hover:to-blue-400"
                    >
                      Explore the sora2 pipeline
                    </Link>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="flex flex-col gap-3 p-6 text-sm text-slate-200">
                    <div className="flex items-center gap-2 text-slate-100">
                      <BarChart3 className="h-4 w-4" />
                      <span>Predictive sora2 scoring</span>
                    </div>
                    <p>
                      Benchmark every launch against the sora2 insight graph to
                      surface winning edits before the premiere window.
                    </p>
                    <div className="flex items-center gap-2 text-slate-100">
                      <PlayCircle className="h-4 w-4" />
                      <span>Live storyboard sync</span>
                    </div>
                    <p>
                      Invite stakeholders to comment directly on each sora
                      prompt, then export clean masters without leaving
                      sora2video.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface HeroFeatureCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

function HeroFeatureCard({
  icon: Icon,
  title,
  description,
}: HeroFeatureCardProps) {
  return (
    <Card className="border-white/10 bg-white/5 text-left text-slate-200">
      <CardContent className="space-y-4 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Sora2Hero;
