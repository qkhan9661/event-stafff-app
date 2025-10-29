import { initTRPC, TRPCError } from "@trpc/server";
import { prisma } from "@/lib/server/prisma";
import { getOptionalAuth } from "@/lib/server/auth-utils";
import { UserRole, hasRole } from "@/lib/server/auth-utils";
import superjson from "superjson";
import type { Session } from "@/lib/server/auth";

/**
 * Create context for each request
 */
export async function createContext() {
  const session = await getOptionalAuth();

  return {
    prisma,
    session,
    userId: session?.user?.id || null,
    userRole: (session?.user as any)?.role || null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure;

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session as Session,
      userId: ctx.userId as string,
    },
  });
});

/**
 * Middleware to check if user is active
 */
const isActive = middleware(async ({ ctx, next }) => {
  const user = ctx.session?.user as any;

  if (!user?.isActive) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User account is inactive",
    });
  }

  return next({ ctx });
});

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure
  .use(isAuthenticated)
  .use(isActive);

/**
 * Create role-based procedure
 */
export function createRoleProcedure(allowedRoles: UserRole[]) {
  const checkRole = middleware(async ({ ctx, next }) => {
    if (!ctx.userRole || !hasRole(ctx.userRole, allowedRoles)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Insufficient permissions",
      });
    }

    return next({ ctx });
  });

  return t.procedure.use(isAuthenticated).use(isActive).use(checkRole);
}

/**
 * Admin-only procedure (SUPER_ADMIN and ADMIN)
 */
export const adminProcedure = createRoleProcedure([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
]);

/**
 * Manager+ procedure (SUPER_ADMIN, ADMIN, MANAGER)
 */
export const managerProcedure = createRoleProcedure([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
]);
