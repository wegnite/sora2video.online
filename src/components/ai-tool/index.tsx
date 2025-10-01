import PricingSection from '@/components/blocks/pricing/pricing';
import { Sora2Hero } from './sora2-hero';
import { Sora2Insights } from './sora2-insights';
import { Sora2Showcase } from './sora2-showcase';

export function AiToolHomepage() {
  return (
    <div className="min-h-screen bg-[#020414] text-white">
      {/* Main AI Tool Section */}
      <Sora2Hero />

      {/* SEO Content Sections */}
      <Sora2Insights />

      {/* Featured Gallery & Social Proof */}
      <Sora2Showcase />

      {/* Pricing Plans */}
      <PricingSection />
    </div>
  );
}

export { Sora2Hero, Sora2Insights, Sora2Showcase };
