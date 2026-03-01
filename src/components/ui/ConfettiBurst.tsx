'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f97316'];
const COUNT = 30;

interface Props {
  show: boolean;
  /** Radius of the burst in px (default 100) */
  radius?: number;
}

export default function ConfettiBurst({ show, radius = 100 }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        color: COLORS[i % COLORS.length],
        angle: (i / COUNT) * 360,
        dist: radius * 0.7 + Math.random() * radius * 0.3,
        size: 6 + Math.random() * 6,
        delay: Math.random() * 0.12,
        round: Math.random() > 0.5,
      })),
    [radius]
  );

  return (
    <AnimatePresence>
      {show && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.dist;
            const ty = Math.sin(rad) * p.dist;
            return (
              <motion.span
                key={p.id}
                style={{
                  position: 'absolute',
                  width: p.size,
                  height: p.size,
                  borderRadius: p.round ? '50%' : '2px',
                  backgroundColor: p.color,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                animate={{ x: tx, y: ty, opacity: 0, scale: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75 + Math.random() * 0.35, delay: p.delay, ease: 'easeOut' }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
