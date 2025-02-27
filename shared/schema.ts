import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  estimatedTime: text("estimated_time").notNull(),
  difficulty: text("difficulty").notNull(),
  steps: jsonb("steps").$type<Array<{
    step: number;
    description: string;
    imageUrl?: string;
  }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating"),
  location: text("location").notNull(),
});

export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true,
  createdAt: true,
});

export const insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
});

export type Guide = typeof guides.$inferSelect;
export type Professional = typeof professionals.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;
export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;