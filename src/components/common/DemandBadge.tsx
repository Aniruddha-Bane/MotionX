import React from 'react';
import { DemandLevel } from '../../types';

interface DemandBadgeProps {
  level: DemandLevel;
  occupancy?: number;
  className?: string;
  showIcon?: boolean;
}

export const DemandBadge: React.FC<DemandBadgeProps> = ({ level, occupancy, className = '', showIcon = true }) => {
  const config = {
    LOW: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      label: 'Low (<60%)'
    },
    MODERATE: {
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      dot: 'bg-sky-400',
      label: 'Moderate (60-80%)'
    },
    HIGH: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
      label: 'High (80-100%)'
    },
    CRITICAL: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
      dot: 'bg-rose-400',
      label: 'Over Capacity (>100%)'
    }
  }[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide whitespace-nowrap ${config.bg} ${className}`}
    >
      {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      <span>{occupancy !== undefined ? `${occupancy}% · ${level}` : level}</span>
    </span>
  );
};
