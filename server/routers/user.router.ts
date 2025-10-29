import { router, publicProcedure, managerProcedure, adminProcedure } from "../trpc";
import { UserService } from "@/services/user.service";
import { UserSchema } from "@/lib/schemas";

/**
 * User Router - All user-related tRPC procedures
 */
export const userRouter = router({
  /**
   * Get all users with pagination, search, and filters
   * Requires: Manager or higher
   */
  getAll: managerProcedure
    .input(UserSchema.query)
    .query(async ({ ctx, input }) => {
      const userService = new UserService(ctx.prisma);
      return await userService.findAll(input);
    }),

  /**
   * Get a single user by ID
   * Requires: Manager or higher
   */
  getById: managerProcedure
    .input(UserSchema.id)
    .query(async ({ ctx, input }) => {
      const userService = new UserService(ctx.prisma);
      return await userService.findOne(input.id);
    }),

  /**
   * Create a new user
   * Requires: Admin or higher
   */
  create: adminProcedure
    .input(UserSchema.create)
    .mutation(async ({ ctx, input }) => {
      const userService = new UserService(ctx.prisma);
      return await userService.create(input);
    }),

  /**
   * Update a user
   * Requires: Admin or higher
   */
  update: adminProcedure
    .input(UserSchema.update)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const userService = new UserService(ctx.prisma);
      return await userService.update(id, data);
    }),

  /**
   * Delete a user
   * Requires: Admin or higher
   */
  delete: adminProcedure
    .input(UserSchema.id)
    .mutation(async ({ ctx, input }) => {
      const userService = new UserService(ctx.prisma);
      return await userService.remove(input.id);
    }),

  /**
   * Deactivate a user
   * Requires: Admin or higher
   */
  deactivate: adminProcedure
    .input(UserSchema.id)
    .mutation(async ({ ctx, input }) => {
      const userService = new UserService(ctx.prisma);
      return await userService.deactivate(input.id);
    }),

  /**
   * Activate a user
   * Requires: Admin or higher
   */
  activate: adminProcedure
    .input(UserSchema.id)
    .mutation(async ({ ctx, input }) => {
      const userService = new UserService(ctx.prisma);
      return await userService.activate(input.id);
    }),

  /**
   * Get user statistics for dashboard
   * Requires: Manager or higher
   */
  getStats: managerProcedure.query(async ({ ctx }) => {
    const userService = new UserService(ctx.prisma);
    return await userService.getStats();
  }),
});
