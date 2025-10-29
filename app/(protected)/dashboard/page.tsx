"use client";

import { trpc } from "@/lib/client/trpc";
import { StatsCard } from "@/components/dashboard/stats-card";
import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { UsersIcon, UserIcon, SettingsIcon } from "@/components/ui/icons";

/**
 * Main dashboard page with user statistics
 * Shows welcome message, total users, active/inactive counts, and role breakdown
 */
export default function DashboardPage() {
  const { data: profile } = trpc.profile.getMyProfile.useQuery();
  const { data: stats, isLoading, error } = trpc.user.getStats.useQuery();

  // Calculate role percentages for descriptions
  const getRolePercentage = (count: number) => {
    if (!stats?.total || stats.total === 0) return "0%";
    return `${Math.round((count / stats.total) * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <WelcomeSection
          firstName={profile?.firstName}
          lastName={profile?.lastName}
          role={profile?.role}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">
              Failed to load dashboard statistics. Please try refreshing the page.
            </p>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.total || 0}
            icon={<UsersIcon className="w-6 h-6" />}
            description="All users in system"
            gradient="purple"
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Users"
            value={stats?.active || 0}
            icon={<UserIcon className="w-6 h-6" />}
            description={
              stats?.total
                ? `${getRolePercentage(stats.active)} of total`
                : "No users yet"
            }
            gradient="green"
            isLoading={isLoading}
          />
          <StatsCard
            title="Inactive Users"
            value={stats?.inactive || 0}
            icon={<UserIcon className="w-6 h-6" />}
            description={
              stats?.total
                ? `${getRolePercentage(stats.inactive)} of total`
                : "No users yet"
            }
            gradient="rose"
            isLoading={isLoading}
          />
          <StatsCard
            title="Administrators"
            value={(stats?.byRole?.SUPER_ADMIN || 0) + (stats?.byRole?.ADMIN || 0)}
            icon={<SettingsIcon className="w-6 h-6" />}
            description="Super admins and admins"
            gradient="blue"
            isLoading={isLoading}
          />
        </div>

        {/* Role Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Super Admins
              </h3>
              <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.byRole?.SUPER_ADMIN || 0}
              </p>
            )}
            {stats?.total && stats.total > 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                {getRolePercentage(stats?.byRole?.SUPER_ADMIN || 0)} of users
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Admins
              </h3>
              <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.byRole?.ADMIN || 0}
              </p>
            )}
            {stats?.total && stats.total > 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                {getRolePercentage(stats?.byRole?.ADMIN || 0)} of users
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Managers
              </h3>
              <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.byRole?.MANAGER || 0}
              </p>
            )}
            {stats?.total && stats.total > 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                {getRolePercentage(stats?.byRole?.MANAGER || 0)} of users
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Staff
              </h3>
              <div className="w-3 h-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full" />
            </div>
            {isLoading ? (
              <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.byRole?.STAFF || 0}
              </p>
            )}
            {stats?.total && stats.total > 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                {getRolePercentage(stats?.byRole?.STAFF || 0)} of users
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions (Optional - can be expanded later) */}
        {stats?.total === 0 && !isLoading && (
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Get Started
            </h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
              No users found. Create your first user to get started with the platform.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
