'use client';

import { ConfirmDialog } from '@/components/common/confirm-dialog';

interface Event {
  id: string;
  title: string;
  eventId: string;
}

interface DeleteEventDialogProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteEventDialog({
  event,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteEventDialogProps) {
  if (!event) return null;

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isDeleting}
      title="Delete Event"
      description="This action cannot be undone"
      confirmText={isDeleting ? 'Deleting...' : 'Delete Event'}
      variant="danger"
      warningMessage="All event data will be permanently deleted."
    >
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete this event?
      </p>
      <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border">
        <p className="text-sm font-medium text-foreground">{event.title}</p>
        <p className="text-xs text-muted-foreground mt-1">ID: {event.eventId}</p>
      </div>
    </ConfirmDialog>
  );
}
