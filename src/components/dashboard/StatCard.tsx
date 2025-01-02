'use client';

import { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  progressValue: number;
  progressColor: string;
  iconColor: string;
}

export function StatCard({
  title,
  value,
  icon,
  progressValue,
  progressColor,
  iconColor
}: StatCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400">{title}</p>
          <h4 className={`text-2xl font-bold ${iconColor}`}>
            {value}
          </h4>
        </div>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-700 rounded-full">
          <div 
            className={`h-full ${progressColor} rounded-full transition-all duration-500`}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 