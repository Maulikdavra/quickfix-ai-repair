import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeRepairImage } from "./lib/openai";
import { insertGuideSchema } from "@shared/schema";
import { z } from "zod";
import { log } from "./vite";

const imageSchema = z.object({
  image: z.string().min(1, "Image data is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/guides", async (_req, res) => {
    const guides = await storage.getGuides();
    res.json(guides);
  });

  app.get("/api/guides/category/:category", async (req, res) => {
    const guides = await storage.getGuidesByCategory(req.params.category);
    res.json(guides);
  });

  app.get("/api/guides/:id", async (req, res) => {
    const guide = await storage.getGuide(parseInt(req.params.id));
    if (!guide) {
      res.status(404).json({ message: "Guide not found" });
      return;
    }
    res.json(guide);
  });

  app.post("/api/guides/analyze", async (req, res) => {
    try {
      log("Received image analysis request");

      // Validate request body
      const validatedData = imageSchema.parse(req.body);

      // Check image size (assuming base64)
      const imageSizeInMB = (validatedData.image.length * 3) / 4 / 1024 / 1024;
      if (imageSizeInMB > 10) {
        throw new Error("Image size exceeds 10MB limit");
      }

      // Analyze image
      const analysis = await analyzeRepairImage(validatedData.image);
      log("Image analysis completed successfully");

      // Create guide
      const guide = insertGuideSchema.parse({
        ...analysis,
        imageUrl: `data:image/jpeg;base64,${validatedData.image}`
      });

      const savedGuide = await storage.createGuide(guide);
      log(`Created new guide with ID: ${savedGuide.id}`);

      res.json(savedGuide);
    } catch (error: any) {
      log(`Error in /api/guides/analyze: ${error.message}`);

      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
        return;
      }

      if (error.message.includes("10MB limit")) {
        res.status(400).json({ 
          message: "Image size exceeds 10MB limit. Please compress the image and try again." 
        });
        return;
      }

      res.status(500).json({ 
        message: error.message || "Failed to analyze image" 
      });
    }
  });

  app.get("/api/shops", async (_req, res) => {
    const shops = await storage.getShops();
    res.json(shops);
  });

  app.get("/api/shops/category/:category", async (req, res) => {
    const shops = await storage.getShopsByCategory(req.params.category);
    res.json(shops);
  });

  app.get("/api/professionals", async (_req, res) => {
    const professionals = await storage.getProfessionals();
    res.json(professionals);
  });

  app.get("/api/professionals/category/:category", async (req, res) => {
    const professionals = await storage.getProfessionalsByCategory(req.params.category);
    res.json(professionals);
  });

  const httpServer = createServer(app);
  return httpServer;
}