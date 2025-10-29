'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/client/auth';
import { UserIcon, LogoutIcon, ChevronDownIcon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const user = session?.user;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
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

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-rose-500 text-xs font-bold text-white">
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user.role?.replace('_', ' ')}
          </div>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* User Info */}
          <div className="border-b border-gray-200 p-3 dark:border-gray-700">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </span>
              <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                {user.role?.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="p-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <UserIcon className="h-4 w-4" />
              <span>My Profile</span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogoutIcon className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
