'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiBurstProps {
  show: boolean;
  radius?: number;
}

const COLORS = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e'];

const PIECES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  angle: (360 / 14) * i,
}));

export default function ConfettiBurst({ show, radius = 100 }: ConfettiBurstProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden" aria-hidden="true">
          {PIECES.map(piece => {
            const rad = (piece.angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            return (
              <motion.div
                key={piece.id}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: piece.color }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x, y, opacity: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
