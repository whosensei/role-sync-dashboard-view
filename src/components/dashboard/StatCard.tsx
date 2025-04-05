
import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  className?: string;
  iconClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  className,
  iconClassName,
}) => {
  return (
    <div className={cn("bg-white p-4 rounded-lg shadow flex", className)}>
      <div className={cn("w-16 h-16 flex items-center justify-center rounded-md", iconClassName)}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-gray-500 text-sm uppercase">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
