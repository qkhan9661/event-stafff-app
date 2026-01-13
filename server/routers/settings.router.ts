import { router, publicProcedure, adminProcedure, protectedProcedure } from "../trpc";
import { SettingsService } from "@/services/settings.service";
import { updateTerminologySchema } from "@/lib/schemas/settings.schema";
import { PositionSchema } from "@/lib/schemas/position.schema";
import {
    updateGlobalLabelsSchema,
    updatePageLabelsSchema,
    resetLabelsSchema,
} from "@/lib/schemas/labels.schema";

/**
 * Settings Router - Organization settings and terminology configuration
 */
export const settingsRouter = router({
    /**
     * Get current terminology configuration
     * Public endpoint - needed for middleware and client-side rendering
     */
    getTerminology: publicProcedure.query(async ({ ctx }) => {
        const settingsService = new SettingsService(ctx.prisma);
        return await settingsService.getTerminology();
    }),

    /**
     * Update terminology configuration
     * Admin-only endpoint - only SUPER_ADMIN and ADMIN can modify terminology
     */
    updateTerminology: adminProcedure
        .input(updateTerminologySchema)
        .mutation(async ({ ctx, input }) => {
            const settingsService = new SettingsService(ctx.prisma);
            return await settingsService.updateTerminology(input);
        }),

    /**
     * Reset terminology to default values (from environment variables)
     * Admin-only endpoint
     */
    resetTerminology: adminProcedure.mutation(async ({ ctx }) => {
        const settingsService = new SettingsService(ctx.prisma);
        return await settingsService.resetTerminology();
    }),

    /**
     * Get all organization settings
     * Admin-only endpoint
     */
    getSettings: adminProcedure.query(async ({ ctx }) => {
        const settingsService = new SettingsService(ctx.prisma);
        return await settingsService.getSettings();
    }),

    // ========== Position Management ==========

    /**
     * Get all positions
     * Protected endpoint - any authenticated user can view positions
     */
    getPositions: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.staffPosition.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        staff: true,
                    },
                },
            },
            orderBy: { name: "asc" },
        });
    }),

    /**
     * Create a new position
     * Admin-only endpoint
     */
    createPosition: adminProcedure
        .input(PositionSchema.create)
        .mutation(async ({ ctx, input }) => {
            // Check for duplicate name
            const existing = await ctx.prisma.staffPosition.findUnique({
                where: { name: input.name },
            });

            if (existing) {
                throw new Error("A position with this name already exists");
            }

            return await ctx.prisma.staffPosition.create({
                data: {
                    name: input.name,
                    description: input.description,
                },
            });
        }),

    /**
     * Update a position
     * Admin-only endpoint
     */
    updatePosition: adminProcedure
        .input(PositionSchema.update)
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            // Check if position exists
            const existing = await ctx.prisma.staffPosition.findUnique({
                where: { id },
            });

            if (!existing) {
                throw new Error("Position not found");
            }

            // Check for duplicate name if name is being changed
            if (data.name && data.name !== existing.name) {
                const duplicate = await ctx.prisma.staffPosition.findUnique({
                    where: { name: data.name },
                });

                if (duplicate) {
                    throw new Error("A position with this name already exists");
                }
            }

            return await ctx.prisma.staffPosition.update({
                where: { id },
                data,
            });
        }),

    /**
     * Toggle position active status
     * Admin-only endpoint
     */
    togglePositionActive: adminProcedure
        .input(PositionSchema.toggleActive)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.staffPosition.update({
                where: { id: input.id },
                data: { isActive: input.isActive },
            });
        }),

    /**
     * Delete a position
     * Admin-only endpoint - only positions with no assigned staff can be deleted
     */
    deletePosition: adminProcedure
        .input(PositionSchema.id)
        .mutation(async ({ ctx, input }) => {
            // Check if position has assigned staff
            const position = await ctx.prisma.staffPosition.findUnique({
                where: { id: input.id },
                include: {
                    _count: {
                        select: { staff: true },
                    },
                },
            });

            if (!position) {
                throw new Error("Position not found");
            }

            if (position._count.staff > 0) {
                throw new Error(
                    `Cannot delete position with ${position._count.staff} assigned staff member(s). Remove assignments first or deactivate the position.`
                );
            }

            await ctx.prisma.staffPosition.delete({
                where: { id: input.id },
            });

            return { success: true, message: "Position deleted successfully" };
        }),

    // ========== Labels Management ==========

    /**
     * Get all labels (global + page-specific)
     * Public endpoint - needed for client-side rendering
     */
    getLabels: publicProcedure.query(async ({ ctx }) => {
        const settingsService = new SettingsService(ctx.prisma);
        return await settingsService.getLabels();
    }),

    /**
     * Update global labels
     * Admin-only endpoint
     */
    updateGlobalLabels: adminProcedure
        .input(updateGlobalLabelsSchema)
        .mutation(async ({ ctx, input }) => {
            const settingsService = new SettingsService(ctx.prisma);
            return await settingsService.updateGlobalLabels(input);
        }),

    /**
     * Update page-specific labels
     * Admin-only endpoint
     */
    updatePageLabels: adminProcedure
        .input(updatePageLabelsSchema)
        .mutation(async ({ ctx, input }) => {
            const settingsService = new SettingsService(ctx.prisma);
            return await settingsService.updatePageLabels(input.page, input.labels);
        }),

    /**
     * Reset labels to defaults
     * Admin-only endpoint
     */
    resetLabels: adminProcedure
        .input(resetLabelsSchema)
        .mutation(async ({ ctx, input }) => {
            const settingsService = new SettingsService(ctx.prisma);
            return await settingsService.resetLabels(input);
        }),
});
