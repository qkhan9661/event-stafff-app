'use client';

import { trpc } from '@/lib/client/trpc';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileForm } from '@/components/profile/profile-form';
import { PasswordForm } from '@/components/profile/password-form';
import { Spinner } from '@/components/ui/spinner';
import { SessionUser } from '@/lib/types/auth.types';

export default function ProfilePage() {
    const { data: user, isLoading, error } = trpc.profile.getMyProfile.useQuery();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Spinner className="h-8 w-8 text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-destructive">
                Error loading profile: {error.message}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                User not found
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl py-8">
            <ProfileHeader user={user as SessionUser} />

            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <ProfileForm user={user as SessionUser} />
                </div>
                <div>
                    <PasswordForm />
                </div>
            </div>
        </div>
    );
}
