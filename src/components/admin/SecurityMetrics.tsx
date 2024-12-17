import React from 'react';
import { Shield } from 'lucide-react';

interface SecurityMetricsProps {
  score?: number;
  alerts?: number;
}

export function SecurityMetrics({ score = 0, alerts = 0 }: SecurityMetricsProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-md border border-gray-200">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-green-500" />
        <span className="text-sm font-medium">Security Score: {score}%</span>
      </div>
      {alerts > 0 && (
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-sm font-medium text-red-600">
            {alerts} Active Alert{alerts !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}