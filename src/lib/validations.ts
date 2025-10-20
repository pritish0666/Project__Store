import { z } from "zod";

// User validation schemas
export const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1),
        url: z.string().url(),
      })
    )
    .optional(),
});

// Project validation schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  tagline: z.string().min(1, "Tagline is required").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  categoryId: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()).optional(),
  techStack: z.array(z.string().max(50)).optional(),
  repoUrl: z
    .string()
    .url("Invalid repository URL")
    .optional()
    .or(z.literal("")),
  demoUrl: z.string().url("Invalid demo URL").optional().or(z.literal("")),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "Version must be in format x.y.z")
    .default("1.0.0"),
  status: z.enum(["live", "demo", "code"]).default("live"),
  heroImage: z.string().url("Invalid hero image URL"),
  screenshots: z.array(z.string().url("Invalid screenshot URL")).optional(),
  features: z.array(z.string().max(200)).optional(),
  changelog: z
    .array(
      z.object({
        version: z.string(),
        date: z.string().datetime(),
        changes: z.array(z.string()),
      })
    )
    .optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// Review validation schemas
export const createReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  body: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be at most 1000 characters"),
});

export const updateReviewSchema = createReviewSchema.partial();

// Search and filter schemas
export const projectFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  sort: z.enum(["rating", "recent", "trending"]).default("recent"),
  status: z.enum(["live", "demo", "code"]).optional(),
  minRating: z.number().min(0).max(5).optional(),
});

// Analytics event schema
export const analyticsEventSchema = z.object({
  type: z.string().min(1),
  projectId: z.string().optional(),
  payload: z.record(z.any()).optional(),
});

// Category and tag schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(200).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex code")
    .default("#ef4444"),
});

export const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(30),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex code")
    .default("#6b7280"),
});

// Collection schema
export const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  projectIds: z.array(z.string()).optional(),
  featuredImage: z.string().url().optional(),
  isPublic: z.boolean().default(true),
});

// Type exports
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ProjectFiltersInput = z.infer<typeof projectFiltersSchema>;
export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
