'use client';

import React from 'react';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export function DashboardCard({
  title,
  description,
  icon,
  href,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="block group"
    >
      <div className="p-6 rounded-lg bg-gray-800 border border-gray-700 transition-all duration-300 hover:bg-gray-700 hover:border-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 