import { router } from "../trpc";
import { userRouter } from "./user.router";
import { profileRouter } from "./profile.router";
import { sessionRouter } from "./session.router";

/**
 * Main application router
 * All sub-routers are combined here
 */
export const appRouter = router({
  user: userRouter,
  profile: profileRouter,
  session: sessionRouter,
  // event: eventRouter, // Will be added in Phase 6
});

export type AppRouter = typeof appRouter;
