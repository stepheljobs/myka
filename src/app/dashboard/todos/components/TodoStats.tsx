'use client';

import { TodoStats as TodoStatsType } from '@/types';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';

interface TodoStatsProps {
  stats: TodoStatsType;
  className?: string;
}

export default function TodoStats({ stats, className = '' }: TodoStatsProps) {
  const completionPercentage = Math.round(stats.completionRate);

  return (
    <Card className={`p-6 ${className}`}>
      <Typography variant="h5" weight="bold" className="mb-4">
        📊 Today&apos;s Progress
      </Typography>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Completion Rate */}
        <div className="text-center p-3 bg-brutal-light-gray border-brutal border-brutal-black">
          <Typography variant="h3" weight="bold" className="text-brutal-blue">
            {completionPercentage}%
          </Typography>
          <Typography variant="caption" className="text-brutal-gray">
            Complete
          </Typography>
        </div>

        {/* Total Todos */}
        <div className="text-center p-3 bg-brutal-light-gray border-brutal border-brutal-black">
          <Typography variant="h3" weight="bold">
            {stats.totalTodos}
          </Typography>
          <Typography variant="caption" className="text-brutal-gray">
            Total Todos
          </Typography>
        </div>
      </div>

      {/* Progress Bar */}
      {stats.totalTodos > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="caption" className="text-brutal-gray">
              Progress
            </Typography>
            <Typography variant="caption" className="text-brutal-gray">
              {stats.completedTodos}/{stats.totalTodos}
            </Typography>
          </div>
          <div className="w-full bg-brutal-light-gray border-brutal border-brutal-black h-4">
            <div 
              className="h-full bg-brutal-green transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      
    </Card>
  );
} 