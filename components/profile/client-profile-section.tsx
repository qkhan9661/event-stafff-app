'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/client/trpc';
import {
    BuildingIcon,
    MapPinIcon,
    PhoneIcon,
    MailIcon,
} from 'lucide-react';

/**
 * Client Profile Section - Shows client business information (read-only)
 * Displayed on the /profile page for CLIENT role users
 */
export function ClientProfileSection() {
    // Fetch client profile linked to this user
    const { data: clientProfile, isLoading } = trpc.profile.getMyClientProfile.useQuery();

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

    if (!clientProfile) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                        No client profile found. Please contact support.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Business Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BuildingIcon className="h-5 w-5" />
                        Business Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label className="text-muted-foreground text-sm">Client ID</Label>
                            <p className="font-medium font-mono">{clientProfile.clientId}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-muted-foreground text-sm">Business Name</Label>
                            <p className="font-medium">{clientProfile.businessName}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm flex items-center gap-1">
                                <MailIcon className="h-3 w-3" />
                                Email
                            </Label>
                            <p className="font-medium">{clientProfile.email}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm flex items-center gap-1">
                                <PhoneIcon className="h-3 w-3" />
                                Cell Phone
                            </Label>
                            <p className="font-medium">{clientProfile.cellPhone}</p>
                        </div>
                        {clientProfile.businessPhone && (
                            <div>
                                <Label className="text-muted-foreground text-sm flex items-center gap-1">
                                    <PhoneIcon className="h-3 w-3" />
                                    Business Phone
                                </Label>
                                <p className="font-medium">{clientProfile.businessPhone}</p>
                            </div>
                        )}
                    </div>
                    {clientProfile.details && (
                        <div className="mt-4">
                            <Label className="text-muted-foreground text-sm">Details</Label>
                            <p className="text-foreground">{clientProfile.details}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPinIcon className="h-5 w-5" />
                        Address
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <Label className="text-muted-foreground text-sm">Street Address</Label>
                            <p className="font-medium">{clientProfile.streetAddress}</p>
                        </div>
                        {clientProfile.aptSuiteUnit && (
                            <div>
                                <Label className="text-muted-foreground text-sm">Apt / Suite / Unit</Label>
                                <p className="font-medium">{clientProfile.aptSuiteUnit}</p>
                            </div>
                        )}
                        <div>
                            <Label className="text-muted-foreground text-sm">City</Label>
                            <p className="font-medium">{clientProfile.city}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">State</Label>
                            <p className="font-medium">{clientProfile.state}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">ZIP Code</Label>
                            <p className="font-medium">{clientProfile.zipCode}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">Country</Label>
                            <p className="font-medium">{clientProfile.country}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Venue Information (if set) */}
            {clientProfile.venueName && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BuildingIcon className="h-5 w-5" />
                            Default Venue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground text-sm">Venue Name</Label>
                                <p className="font-medium">{clientProfile.venueName}</p>
                            </div>
                            {clientProfile.room && (
                                <div>
                                    <Label className="text-muted-foreground text-sm">Room</Label>
                                    <p className="font-medium">{clientProfile.room}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Note about editing */}
            <p className="text-sm text-muted-foreground text-center">
                To update your business information, please contact your account administrator.
            </p>
        </div>
    );
}
