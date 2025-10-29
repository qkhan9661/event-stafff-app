'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/client/auth';
import { signOut } from '@/lib/client/auth';
import { hasRole } from '@/lib/server/auth-utils';
import {
  DashboardIcon,
  UsersIcon,
  UserIcon,
  LogoutIcon,
  CloseIcon,
} from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAdmin?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: DashboardIcon,
    requiresAdmin: false,
  },
  {
    label: 'Users',
    href: '/users',
    icon: UsersIcon,
    requiresAdmin: true, // Only ADMIN and SUPER_ADMIN
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserIcon,
    requiresAdmin: false,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ isOpen = true, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter((item) => {
    if (!item.requiresAdmin) return true;
    if (!user?.role) return false;

    // Check if user has admin access (ADMIN or SUPER_ADMIN)
    const adminRoles = ['ADMIN', 'SUPER_ADMIN'];
    return adminRoles.includes(user.role);
  });

  // Check if current path matches nav item
  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'purple';
      case 'ADMIN':
        return 'primary';
      case 'MANAGER':
        return 'info';
      case 'STAFF':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-rose-500">
            <span className="text-sm font-bold">ES</span>
          </div>
          <span className="text-lg font-semibold">Event Staff</span>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {user && (
        <div className="border-t border-gray-800 p-4">
          <div className="mb-3 rounded-lg bg-gray-800 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </span>
              <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                {user.role?.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogoutIcon className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );

  // Desktop sidebar (fixed)
  if (!isMobile) {
    return (
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform">
        {sidebarContent}
      </aside>
    );
  }

  // Mobile sidebar (drawer)
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
