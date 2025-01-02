'use client';

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  icon,
  iconColor,
  children,
  className = ''
}: ChartCardProps) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <div className={`mr-2 ${iconColor}`}>
          {icon}
        </div>
        {title}
      </h3>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
} 