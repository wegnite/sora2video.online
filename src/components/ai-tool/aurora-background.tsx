'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import type { HTMLAttributes } from 'react';

type AuroraBackgroundProps = HTMLAttributes<HTMLDivElement>;

const ORBS = [
  {
    id: 'orb-1',
    top: '-15%',
    left: '-8%',
    size: 420,
    blur: 160,
    duration: 20,
    delay: 0,
    background:
      'radial-gradient(circle at 30% 30%, rgba(64, 102, 255, 0.7), transparent 65%)',
  },
  {
    id: 'orb-2',
    top: '6%',
    left: '58%',
    size: 360,
    blur: 150,
    duration: 22,
    delay: 1.8,
    background:
      'radial-gradient(circle at 70% 40%, rgba(244, 178, 64, 0.65), transparent 65%)',
  },
  {
    id: 'orb-3',
    top: '50%',
    left: '12%',
    size: 340,
    blur: 130,
    duration: 24,
    delay: 0.9,
    background:
      'radial-gradient(circle at 50% 50%, rgba(103, 232, 249, 0.7), transparent 65%)',
  },
  {
    id: 'orb-4',
    top: '65%',
    left: '68%',
    size: 420,
    blur: 200,
    duration: 26,
    delay: 2.8,
    background:
      'radial-gradient(circle at 50% 50%, rgba(209, 213, 255, 0.55), transparent 70%)',
  },
] as const;

export function AuroraBackground({
  className,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden
      {...props}
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(circle_at_top,white,transparent_78%)]',
        className
      )}
    >
      <div className="absolute inset-0">
        {ORBS.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full"
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: [0.28, 0.7, 0.32], scale: [1, 1.12, 1] }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              filter: `blur(${orb.blur}px)`,
              background: orb.background,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(109,91,255,0.28),transparent_60%)] mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),transparent_55%)] mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,4,20,0.88),rgba(6,7,26,0.92)_45%,rgba(8,9,32,0.94))]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#ffffff12_1.4px,transparent_1.4px)] [background-size:34px_34px]" />
    </div>
  );
}
