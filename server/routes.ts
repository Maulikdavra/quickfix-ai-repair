import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeRepairImage } from "./lib/openai";
import { insertGuideSchema } from "@shared/schema";

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
      const { image } = req.body;
      if (!image) {
        res.status(400).json({ message: "Image is required" });
        return;
      }

      const analysis = await analyzeRepairImage(image);
      const guide = insertGuideSchema.parse({
        ...analysis,
        imageUrl: `data:image/jpeg;base64,${image}`
      });
      
      const savedGuide = await storage.createGuide(guide);
      res.json(savedGuide);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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
