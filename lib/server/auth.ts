import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Using Better Auth's default scrypt hashing (more secure than bcrypt)
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  user: {
    // Additional user fields beyond better-auth defaults
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "STAFF",
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      profilePhoto: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
      emergencyContact: {
        type: "string",
        required: false,
      },
      lastLoginAt: {
        type: "date",
        required: false,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "event-auth",
  },
});

export type Session = typeof auth.$Infer.Session;
// Extract User type from Session
export type User = Session extends { user: infer U } ? U : never;
