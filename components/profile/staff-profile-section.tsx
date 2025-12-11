'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { trpc } from '@/lib/client/trpc';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { AvailabilityStatus } from '@prisma/client';
import { useTerminology } from '@/lib/hooks/use-terminology';
import { CalendarIcon, ClockIcon, UserXIcon } from 'lucide-react';
import { signOut } from '@/lib/client/auth';

const AVAILABILITY_OPTIONS = [
    { value: AvailabilityStatus.OPEN_TO_OFFERS, label: 'Open to Offers', description: 'Available for event assignments' },
    { value: AvailabilityStatus.BUSY, label: 'Busy', description: 'Currently occupied but may be available' },
    { value: AvailabilityStatus.TIME_OFF, label: 'Time Off', description: 'Not available for assignments' },
];

export function StaffProfileSection() {
    const { terminology } = useTerminology();
    const { toast } = useToast();
    const router = useRouter();
    const utils = trpc.useUtils();

    // Fetch staff profile
    const { data: staffProfile, isLoading } = trpc.staff.getMyProfile.useQuery();

    // Local state for form
    const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus | null>(null);
    const [timeOffStart, setTimeOffStart] = useState<string>('');
    const [timeOffEnd, setTimeOffEnd] = useState<string>('');
    const [deactivateReason, setDeactivateReason] = useState('');
    const [isDeactivateConfirmOpen, setIsDeactivateConfirmOpen] = useState(false);

    // Initialize form when data loads
    useState(() => {
        if (staffProfile) {
            setAvailabilityStatus(staffProfile.availabilityStatus);
            setTimeOffStart(staffProfile.timeOffStart ? new Date(staffProfile.timeOffStart).toISOString().split('T')[0] : '');
            setTimeOffEnd(staffProfile.timeOffEnd ? new Date(staffProfile.timeOffEnd).toISOString().split('T')[0] : '');
        }
    });

    // Update mutation
    const updateMutation = trpc.staff.updateMyProfile.useMutation({
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Profile updated successfully',
            });
            utils.staff.getMyProfile.invalidate();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update profile',
                variant: 'error',
            });
        },
    });

    // Deactivate mutation
    const deactivateMutation = trpc.staff.deactivateMyProfile.useMutation({
        onSuccess: async () => {
            toast({
                title: 'Profile Deactivated',
                description: 'Your profile has been deactivated. You will be logged out.',
            });
            setIsDeactivateConfirmOpen(false);
            // Sign out the user
            await signOut();
            router.push('/login');
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to deactivate profile',
                variant: 'error',
            });
        },
    });

    const handleSaveAvailability = () => {
        updateMutation.mutate({
            availabilityStatus: availabilityStatus || undefined,
            timeOffStart: timeOffStart ? new Date(timeOffStart) : null,
            timeOffEnd: timeOffEnd ? new Date(timeOffEnd) : null,
        });
    };

    const handleDeactivateConfirm = () => {
        deactivateMutation.mutate({ reason: deactivateReason || undefined });
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-muted rounded w-1/4" />
                        <div className="h-10 bg-muted rounded w-full" />
                        <div className="h-10 bg-muted rounded w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!staffProfile) {
        return null;
    }

    // Initialize local state from profile data on first render
    const currentAvailability = availabilityStatus ?? staffProfile.availabilityStatus;
    const currentTimeOffStart = timeOffStart || (staffProfile.timeOffStart ? new Date(staffProfile.timeOffStart).toISOString().split('T')[0] : '');
    const currentTimeOffEnd = timeOffEnd || (staffProfile.timeOffEnd ? new Date(staffProfile.timeOffEnd).toISOString().split('T')[0] : '');

    return (
        <div className="space-y-6">
            {/* Availability Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClockIcon className="h-5 w-5" />
                        {terminology.staff.singular} Availability
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="availabilityStatus">Availability Status</Label>
                        <Select
                            id="availabilityStatus"
                            value={currentAvailability}
                            onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                            disabled={updateMutation.isPending}
                        >
                            {AVAILABILITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                            {AVAILABILITY_OPTIONS.find((o) => o.value === currentAvailability)?.description}
                        </p>
                    </div>

                    {currentAvailability === AvailabilityStatus.TIME_OFF && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                            <div>
                                <Label htmlFor="timeOffStart" className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    Time Off Start
                                </Label>
                                <Input
                                    id="timeOffStart"
                                    type="date"
                                    value={currentTimeOffStart}
                                    onChange={(e) => setTimeOffStart(e.target.value)}
                                    disabled={updateMutation.isPending}
                                />
                            </div>
                            <div>
                                <Label htmlFor="timeOffEnd" className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    Time Off End
                                </Label>
                                <Input
                                    id="timeOffEnd"
                                    type="date"
                                    value={currentTimeOffEnd}
                                    onChange={(e) => setTimeOffEnd(e.target.value)}
                                    disabled={updateMutation.isPending}
                                    min={currentTimeOffStart}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            onClick={handleSaveAvailability}
                            disabled={updateMutation.isPending}
                            isLoading={updateMutation.isPending}
                        >
                            Save Availability
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Deactivate Account */}
            <Card className="border-destructive/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <UserXIcon className="h-5 w-5" />
                        Deactivate Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Deactivating your profile will prevent you from being assigned to events and log you out.
                        Contact an administrator if you need to reactivate your account.
                    </p>
                    <Button
                        variant="danger"
                        onClick={() => setIsDeactivateConfirmOpen(true)}
                    >
                        Deactivate My Profile
                    </Button>
                </CardContent>
            </Card>

            {/* Deactivate Confirmation Dialog */}
            <ConfirmDialog
                open={isDeactivateConfirmOpen}
                onClose={() => {
                    setIsDeactivateConfirmOpen(false);
                    setDeactivateReason('');
                }}
                onConfirm={handleDeactivateConfirm}
                isLoading={deactivateMutation.isPending}
                title="Deactivate Your Profile"
                description="Are you sure you want to deactivate your profile? You will be logged out and will not be able to access your account until an administrator reactivates it."
                confirmText="Deactivate"
                variant="danger"
            >
                <div className="space-y-3">
                    <Label htmlFor="deactivateReason">Reason (Optional)</Label>
                    <Textarea
                        id="deactivateReason"
                        value={deactivateReason}
                        onChange={(e) => setDeactivateReason(e.target.value)}
                        placeholder="Let us know why you're deactivating your profile..."
                        rows={3}
                    />
                </div>
            </ConfirmDialog>
        </div>
    );
}
