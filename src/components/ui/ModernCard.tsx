'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  gradient?: 'primary' | 'success' | 'gold' | 'purple' | 'none';
  glow?: boolean;
  delay?: number;
}

export default function ModernCard({
  children,
  className,
  gradient = 'none',
  glow = false,
  delay = 0,
}: ModernCardProps) {
  const gradients = {
    primary: 'from-blue-500/10 to-purple-500/10',
    success: 'from-green-500/10 to-cyan-500/10',
    gold: 'from-yellow-500/10 to-orange-500/10',
    purple: 'from-purple-500/10 to-pink-500/10',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'glass-card rounded-2xl p-6 hover-lift relative overflow-hidden',
        gradient !== 'none' && `bg-gradient-to-br ${gradients[gradient]}`,
        glow && 'neon-glow',
        className
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
      {children}
    </motion.div>
  );
}
