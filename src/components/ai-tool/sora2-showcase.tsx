import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Clock,
  Play,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

interface Sora2CaseStudy {
  id: string;
  title: string;
  industry: string;
  image: string;
  prompt: string;
  duration: string;
  outcome: string;
  tags: string[];
}

const CASE_STUDIES: Sora2CaseStudy[] = [
  {
    id: 'stellar-mission',
    title: 'Stellar Relay Premiere',
    industry: 'Aerospace',
    image:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    prompt:
      'Craft a sora prompt that follows satellites orbiting a luminous earth while the sora2 engine layers telemetry beats with sweeping brass cues.',
    duration: '29s cinematic arc',
    outcome: '93% completion, 8 language subtitle packs from sora2',
    tags: ['sora2 timeline', 'Investor grade', 'Volumetric fog'],
  },
  {
    id: 'culture-drop',
    title: 'Culture Capsule Drop',
    industry: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    prompt:
      'Write a sora prompt for holographic runways, choreographed camera sweeps, and beat-locked typography that the sora2 render brain can remix across channels.',
    duration: '21s hero sequence',
    outcome: '7.1x add-to-cart uplift with sora2 signals',
    tags: ['sora prompt suite', 'Realtime cloth', 'Audio reactive'],
  },
  {
    id: 'fleet-preview',
    title: 'Autonomous Fleet Reveal',
    industry: 'Mobility',
    image:
      'https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=1200&q=80',
    prompt:
      'Outline a sora prompt that tracks electric shuttles through neon rain with lidar overlays and sora2-guided dialogue bubbles for investors.',
    duration: '34s narrative arc',
    outcome: '48-region rollout orchestrated via sora 2',
    tags: ['Data layers', 'Dynamic weather', 'Compliance ready'],
  },
  {
    id: 'genomics-brief',
    title: 'Genomics Discovery Briefing',
    industry: 'Healthcare',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    prompt:
      'Design a sora prompt that transitions from lab macros to molecular vistas, using sora2 callouts to sync compliance captions and patient outcomes.',
    duration: '24s explainer',
    outcome: '3.4x retention in leadership reports',
    tags: ['sora2 compliance', 'Caption ready', 'Data proofed'],
  },
];

const TESTIMONIALS = [
  {
    name: 'Amara Holt',
    role: 'VP Creative, Nebula Systems',
    quote:
      '“sora2 let us stage three launch chapters in twelve hours. Every sora prompt stayed intact as we refined copy and brand cues.”',
  },
  {
    name: 'Diego Fernández',
    role: 'Global Campaign Lead, Shift Mobility',
    quote:
      '“Stakeholders reviewed shots inside the sora2 conductor. We shipped six regions without exporting timelines or breaking approvals.”',
  },
  {
    name: 'Lina Park',
    role: 'Head of Studio, Prism Collective',
    quote:
      '“We draft sora prompt beats like scripts. The sora 2 interpreter nails performance notes so we obsess over story, not rendering.”',
  },
];

const METRICS = [
  { value: '1.9M+', label: 'Frames rendered daily by sora2 crews' },
  { value: '65%', label: 'Average edit hours saved with sora2' },
  { value: '13', label: 'Industries scaling via sora 2 playbooks' },
];

export function Sora2Showcase() {
  return (
    <div className="space-y-16">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            sora2 motion showcase
          </Badge>
          <h2 className="text-3xl font-serif font-bold text-white md:text-4xl">
            Witness how teams scale with sora2
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Every spotlight combines a strategic sora prompt, layered assets,
            and the sora2 automation stack. Study production notes, pull
            reusable cues, and adapt the playbooks for your next campaign at
            sora2video.online.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <Card
              key={study.id}
              className="overflow-hidden border-white/10 bg-white/5 text-white"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium">
                  <div className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                    {study.industry}
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-blue-500/80 px-3 py-1 text-slate-900">
                    <Play className="h-3.5 w-3.5" />
                    {study.duration}
                  </div>
                </div>
              </div>
              <CardContent className="space-y-5 p-6">
                <div>
                  <h3 className="text-xl font-semibold">{study.title}</h3>
                  <p className="mt-2 text-sm text-slate-200">{study.prompt}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {study.outcome}
                  </div>
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-500/20 px-3 py-1 text-xs uppercase tracking-wide text-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white"
            >
              <div className="text-2xl font-semibold">{metric.value}</div>
              <div className="mt-2 text-sm text-slate-200">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600"
          >
            Request a sora2 case breakdown
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              sora2 creator feedback
            </Badge>
            <h3 className="text-3xl font-serif font-bold text-white md:text-4xl">
              What crews report after deploying sora2
            </h3>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Production leads love that sora2 keeps story, render, and delivery
              data inside one canvas. No more version anxiety or midnight
              exports when sora prompts stay synced across departments.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="border-white/10 bg-[#080c24]/80 text-white"
              >
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-slate-300">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-200">{testimonial.quote}</p>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    Delivered with sora2 stack
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 p-10 text-center text-white">
          <h3 className="text-2xl font-serif font-bold">
            Publish your next saga with sora2
          </h3>
          <p className="mt-4 text-lg text-slate-200">
            Combine narrative strategy, data insights, and real-time feedback in
            the sora2 pipeline. Every sora prompt stays auditable, so growth,
            creative, and legal stay aligned on delivery.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-200"
            >
              Secure a sora2 workshop
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              Download the sora prompt playbook
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sora2Showcase;
