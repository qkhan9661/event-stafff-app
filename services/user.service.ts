import { PrismaClient, UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcryptjs";

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  emergencyContact?: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  emergencyContact?: string;
}

export interface QueryUsersInput {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "firstName" | "lastName" | "email" | "role";
  sortOrder?: "asc" | "desc";
  role?: UserRole;
  isActive?: boolean;
}

export interface PaginatedUsers {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    SUPER_ADMIN: number;
    ADMIN: number;
    MANAGER: number;
    STAFF: number;
  };
}

/**
 * User Service - Business logic layer for user operations
 */
export class UserService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new user
   */
  async create(data: CreateUserInput) {
    // Check if user with email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        phone: true,
        address: true,
        emergencyContact: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Get all users with pagination, search, and filters
   */
  async findAll(query: QueryUsersInput): Promise<PaginatedUsers> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100); // Max 100 items per page
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    // Build where clause
    const where: any = {};

    // Role filter
    if (query.role) {
      where.role = query.role;
    }

    // Active/Inactive filter
    if (typeof query.isActive === "boolean") {
      where.isActive = query.isActive;
    }

    // Search filter (firstName, lastName, email)
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Execute query
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          phone: true,
          address: true,
          emergencyContact: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get a single user by ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        phone: true,
        profilePhoto: true,
        address: true,
        emergencyContact: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User with ID ${id} not found`,
      });
    }

    return user;
  }

  /**
   * Find user by email (used for authentication)
   */
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update a user
   */
  async update(id: string, data: UpdateUserInput) {
    // Check if user exists
    const user = await this.findOne(id);

    // Check if email is being updated and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }
    }

    // Hash password if it's being updated
    let updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    // Update the user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        phone: true,
        address: true,
        emergencyContact: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Delete a user (hard delete)
   */
  async remove(id: string) {
    // Check if user exists
    await this.findOne(id);

    // Delete the user
    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true, message: "User deleted successfully" };
  }

  /**
   * Deactivate a user
   */
  async deactivate(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        phone: true,
        address: true,
        emergencyContact: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Activate a user
   */
  async activate(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        phone: true,
        address: true,
        emergencyContact: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Get user statistics for dashboard
   */
  async getStats(): Promise<UserStats> {
    const [total, active, byRole] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      Promise.all([
        this.prisma.user.count({ where: { role: UserRole.SUPER_ADMIN } }),
        this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
        this.prisma.user.count({ where: { role: UserRole.MANAGER } }),
        this.prisma.user.count({ where: { role: UserRole.STAFF } }),
      ]),
    ]);

    const inactive = total - active;

    return {
      total,
      active,
      inactive,
      byRole: {
        SUPER_ADMIN: byRole[0],
        ADMIN: byRole[1],
        MANAGER: byRole[2],
        STAFF: byRole[3],
      },
    };
  }
}
