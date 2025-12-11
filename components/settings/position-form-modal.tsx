'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CloseIcon } from '@/components/ui/icons';
import { PositionSchema } from '@/lib/schemas/position.schema';

type Position = {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        staff: number;
    };
};

const formSchema = PositionSchema.create;
type PositionFormData = z.infer<typeof formSchema>;

interface PositionFormModalProps {
    position: Position | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description?: string | null }) => void;
    isSubmitting: boolean;
}

export function PositionFormModal({
    position,
    open,
    onClose,
    onSubmit,
    isSubmitting,
}: PositionFormModalProps) {
    const isEdit = !!position;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PositionFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    useEffect(() => {
        if (position && open) {
            reset({
                name: position.name,
                description: position.description || '',
            });
        } else if (!position && open) {
            reset({
                name: '',
                description: '',
            });
        }
    }, [position, open, reset]);

    const handleFormSubmit = (data: PositionFormData) => {
        onSubmit({
            name: data.name,
            description: data.description || null,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} className="max-w-md">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>
                            {isEdit ? 'Edit Position' : 'Add New Position'}
                        </DialogTitle>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <CloseIcon className="h-5 w-5" />
                        </button>
                    </div>
                </DialogHeader>

                <DialogContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" required>
                                Position Name
                            </Label>
                            <Input
                                id="name"
                                {...register('name')}
                                error={!!errors.name}
                                disabled={isSubmitting}
                                placeholder="e.g., Server, Bartender, Event Manager"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                disabled={isSubmitting}
                                rows={3}
                                placeholder="Optional description of this position"
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>
                </DialogContent>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? 'Saving...'
                            : isEdit
                              ? 'Update Position'
                              : 'Create Position'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
