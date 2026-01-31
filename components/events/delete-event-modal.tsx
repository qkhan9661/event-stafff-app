'use client';

import { ConfirmModal } from '@/components/common/confirm-modal';
import { useTerminology } from '@/lib/hooks/use-terminology';

interface Event {
  id: string;
  title: string;
  eventId: string;
}

interface DeleteEventModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteEventModal({
  event,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteEventModalProps) {
  const { terminology } = useTerminology();

  if (!event) return null;

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isDeleting}
      title={`Permanently delete ${terminology.event.singular}`}
      description={`This permanently deletes the archived ${terminology.event.lower} and cannot be undone.`}
      confirmText={isDeleting ? 'Deleting...' : `Delete permanently`}
      variant="danger"
      warningMessage={`This is a permanent delete. Archive is reversible; delete is not.`}
    >
      <p className="text-sm text-muted-foreground">
        Are you sure you want to permanently delete this archived {terminology.event.lower}?
      </p>
      <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border">
        <p className="text-sm font-medium text-foreground">{event.title}</p>
        <p className="text-xs text-muted-foreground mt-1">ID: {event.eventId}</p>
      </div>
    </ConfirmModal>
  );
}
