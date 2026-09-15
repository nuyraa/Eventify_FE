import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  badgeText?: string;
  color?: 'yellow' | 'mint' | 'pink' | 'toska';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badgeText,
  color = 'yellow',
}) => {
  const bgClasses = {
    yellow: 'bg-neo-yellow/30 border-neo-dark',
    mint: 'bg-neo-mint/30 border-neo-dark',
    pink: 'bg-neo-pink/30 border-neo-dark',
    toska: 'bg-neo-toska/30 border-neo-dark',
  };

  return (
    <Card className={`${bgClasses[color]} border-3 transition-transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-white rounded-xl border-2.5 border-neo-dark shadow-neo-sm text-neo-dark">
          {icon}
        </div>
        {badgeText && <Badge variant={color}>{badgeText}</Badge>}
      </div>

      <p className="font-space font-extrabold text-xs text-gray-700 uppercase tracking-wider">
        {title}
      </p>
      <p className="font-space font-black text-2xl text-neo-dark my-1 truncate">
        {value}
      </p>
      {subtitle && (
        <p className="font-jakarta font-semibold text-[11px] text-gray-600 truncate">
          {subtitle}
        </p>
      )}
    </Card>
  );
};
