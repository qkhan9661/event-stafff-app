'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertIcon } from '@/components/ui/icons';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  isDeleting: boolean;
}

export function DeleteUserDialog({
  user,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteUserDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertIcon className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <div>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>This action cannot be undone</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogContent>
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {user.firstName} {user.lastName}
          </span>
          ?
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Email: {user.email}
        </p>
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">
            This will permanently delete the user and all associated data.
          </p>
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => onConfirm(user.id)}
          isLoading={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete User'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
