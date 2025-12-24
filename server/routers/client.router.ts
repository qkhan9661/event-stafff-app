import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { ClientSchema } from "@/lib/schemas/client.schema";
import { emailService } from "@/services/email.service";

/**
 * Client Router - All client-related tRPC procedures
 * Includes protected procedures (admin), public procedures (invitation acceptance)
 * ClientService is injected via context for efficient resource management
 */
export const clientRouter = router({
  /**
   * Get all clients with pagination, search, and filters
   * Users can only see their own clients
   */
  getAll: protectedProcedure
    .input(ClientSchema.query)
    .query(async ({ ctx, input }) => {
      return await ctx.clientService.findAll(input, ctx.userId!);
    }),

  /**
   * Get a single client by ID
   */
  getById: protectedProcedure
    .input(ClientSchema.id)
    .query(async ({ ctx, input }) => {
      return await ctx.clientService.findOne(input.id);
    }),

  /**
   * Create a new client
   * Sends invitation email if hasLoginAccess is enabled
   */
  create: protectedProcedure
    .input(ClientSchema.create)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.clientService.create(input, ctx.userId!);

      // If hasLoginAccess is enabled, grant login access and send invitation
      if (input.hasLoginAccess) {
        const accessResult = await ctx.clientService.grantLoginAccess(result.client.id);

        // Send invitation email
        await emailService.sendClientInvitation(
          accessResult.client.email,
          accessResult.client.firstName,
          accessResult.invitationToken
        );

        return { client: accessResult.client, invitationToken: accessResult.invitationToken };
      }

      return result;
    }),

  /**
   * Update a client
   * Handles login access changes - sends invitation on first time access enabled
   */
  update: protectedProcedure
    .input(ClientSchema.update)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await ctx.clientService.update(id, data);

      // Send invitation email if a new invitation was generated
      if (result.invitationToken) {
        await emailService.sendClientInvitation(
          result.client.email,
          result.client.firstName,
          result.invitationToken
        );
      }

      return result;
    }),

  /**
   * Delete a client
   */
  delete: protectedProcedure
    .input(ClientSchema.id)
    .mutation(async ({ ctx, input }) => {
      return await ctx.clientService.remove(input.id);
    }),

  /**
   * Grant login access to a client
   * Generates invitation token and sends email
   */
  grantLoginAccess: protectedProcedure
    .input(ClientSchema.id)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.clientService.grantLoginAccess(input.id);

      // Send invitation email
      await emailService.sendClientInvitation(
        result.client.email,
        result.client.firstName,
        result.invitationToken
      );

      return result;
    }),

  /**
   * Revoke login access from a client
   * Deactivates associated User account
   */
  revokeLoginAccess: protectedProcedure
    .input(ClientSchema.id)
    .mutation(async ({ ctx, input }) => {
      return await ctx.clientService.revokeLoginAccess(input.id);
    }),

  /**
   * Resend client invitation email
   */
  resendInvitation: protectedProcedure
    .input(ClientSchema.resendInvitation)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.clientService.resendInvitation(input.id);

      // Send invitation email
      await emailService.sendClientInvitation(
        result.client.email,
        result.client.firstName,
        result.invitationToken
      );

      return result.client;
    }),

  /**
   * Get invitation info by token (public - for invitation acceptance page)
   */
  getInvitationInfo: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.clientService.getInvitationInfo(input.token);
    }),

  /**
   * Accept client invitation (public - client sets their password)
   */
  acceptInvitation: publicProcedure
    .input(ClientSchema.acceptInvitation)
    .mutation(async ({ ctx, input }) => {
      return await ctx.clientService.acceptInvitation(input);
    }),

  /**
   * Get client statistics for dashboard
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.clientService.getStats();
  }),
});

