import { z } from "zod";

export const createLinkSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Must be a valid URL (include https://)")
    .max(2048, "URL is too long (max 2048 characters)"),
});

// Schema for short code parameter
export const shortCodeSchema = z.object({
  shortCode: z
    .string()
    .min(1, "Short code is required")
    .max(10, "Short code is too long")
    .regex(/^[a-zA-Z0-9]+$/, "Short code must be alphanumeric"),
});

// TypeScript types inferred from schemas
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type ShortCodeInput = z.infer<typeof shortCodeSchema>;
