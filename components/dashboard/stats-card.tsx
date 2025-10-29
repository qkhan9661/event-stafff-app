"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "./animated-counter";

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description?: string;
  gradient?: "purple" | "rose" | "blue" | "green";
  isLoading?: boolean;
}

/**
 * Stats card component with animated counter and gradient effects
 */
export function StatsCard({
  title,
  value,
  icon,
  description,
  gradient = "purple",
  isLoading = false,
}: StatsCardProps) {
  const gradients = {
    purple: "from-purple-500/10 to-purple-600/10 border-purple-500/20",
    rose: "from-rose-500/10 to-rose-600/10 border-rose-500/20",
    blue: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
    green: "from-green-500/10 to-green-600/10 border-green-500/20",
  };

  const iconGradients = {
    purple: "from-purple-500 to-purple-600",
    rose: "from-rose-500 to-rose-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-neutral-200 dark:border-neutral-800">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br ${gradients[gradient]}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
              <AnimatedCounter value={value} duration={1200} />
            </h3>
            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {description}
              </p>
            )}
          </div>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${iconGradients[gradient]} shadow-lg`}
          >
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
