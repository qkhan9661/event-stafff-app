import { z } from "zod";
import { UserRole } from "@prisma/client";

/**
 * User Zod Schemas for validation
 */
export class UserSchema {
  /**
   * Create User Schema
   */
  static create = z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.nativeEnum(UserRole),
    phone: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
  });

  /**
   * Update User Schema (all fields optional except ID)
   */
  static update = z.object({
    id: z.string().uuid("Invalid user ID"),
    email: z.string().email("Invalid email address").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .optional(),
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    role: z.nativeEnum(UserRole).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
  });

  /**
   * Query Users Schema (for pagination, search, filters)
   */
  static query = z.object({
    page: z.number().int().min(1).default(1).optional(),
    limit: z.number().int().min(1).max(100).default(10).optional(),
    search: z.string().optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "firstName", "lastName", "email", "role"])
      .default("createdAt")
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
    role: z.nativeEnum(UserRole).optional(),
    isActive: z.boolean().optional(),
  });

  /**
   * User ID Schema (for get, delete, activate, deactivate)
   */
  static id = z.object({
    id: z.string().uuid("Invalid user ID"),
  });
}

/**
 * TypeScript types inferred from Zod schemas
 */
export type CreateUserInput = z.infer<typeof UserSchema.create>;
export type UpdateUserInput = z.infer<typeof UserSchema.update>;
export type QueryUsersInput = z.infer<typeof UserSchema.query>;
export type UserIdInput = z.infer<typeof UserSchema.id>;
