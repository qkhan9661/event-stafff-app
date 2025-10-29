'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EditIcon, TrashIcon } from '@/components/ui/icons';
import { UserRole } from '@prisma/client';
import { format } from 'date-fns';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  phone?: string | null;
  createdAt: Date;
  address?: string | null;
  emergencyContact?: string | null;
}

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const ROLE_COLORS: Record<UserRole, 'purple' | 'primary' | 'info' | 'default'> = {
  SUPER_ADMIN: 'purple',
  ADMIN: 'primary',
  MANAGER: 'info',
  STAFF: 'default',
};

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
};

export function UserTable({ users, isLoading, onEdit, onDelete, onToggleStatus }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No users found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Role
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Phone
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Joined
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="py-4 px-4">
                  <Badge variant={ROLE_COLORS[user.role]}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={user.isActive ? 'success' : 'danger'} pulse={user.isActive}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {user.phone || '-'}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(user)}
                      title={user.isActive ? 'Deactivate user' : 'Activate user'}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      title="Edit user"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      title="Delete user"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {user.email}
                </div>
              </div>
              <Badge variant={user.isActive ? 'success' : 'danger'} pulse={user.isActive}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={ROLE_COLORS[user.role]}>
                {ROLE_LABELS[user.role]}
              </Badge>
              {user.phone && (
                <span className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</span>
              )}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-500">
              Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(user)}
                className="flex-1"
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
                className="flex-1"
              >
                <EditIcon className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(user)}
                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
