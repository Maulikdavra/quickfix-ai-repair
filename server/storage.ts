import { type Guide, type Professional, type InsertGuide, type InsertProfessional } from "@shared/schema";

export interface IStorage {
  getGuide(id: number): Promise<Guide | undefined>;
  getGuides(): Promise<Guide[]>;
  getGuidesByCategory(category: string): Promise<Guide[]>;
  createGuide(guide: InsertGuide): Promise<Guide>;
  getProfessionals(): Promise<Professional[]>;
  getProfessionalsByCategory(category: string): Promise<Professional[]>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
}

export class MemStorage implements IStorage {
  private guides: Map<number, Guide>;
  private professionals: Map<number, Professional>;
  private guideId: number;
  private professionalId: number;

  constructor() {
    this.guides = new Map();
    this.professionals = new Map();
    this.guideId = 1;
    this.professionalId = 1;

    // Add some sample professionals
    this.createProfessional({
      name: "John Smith",
      category: "plumbing",
      imageUrl: "https://ui-avatars.com/api/?name=John+Smith",
      rating: 5,
      location: "New York, NY"
    });
    this.createProfessional({
      name: "Jane Doe",
      category: "electrical",
      imageUrl: "https://ui-avatars.com/api/?name=Jane+Doe",
      rating: 4,
      location: "Los Angeles, CA"
    });
  }

  async getGuide(id: number): Promise<Guide | undefined> {
    return this.guides.get(id);
  }

  async getGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values());
  }

  async getGuidesByCategory(category: string): Promise<Guide[]> {
    return Array.from(this.guides.values()).filter(
      (guide) => guide.category === category
    );
  }

  async createGuide(guide: InsertGuide): Promise<Guide> {
    const id = this.guideId++;
    const newGuide: Guide = {
      ...guide,
      id,
      createdAt: new Date(),
    };
    this.guides.set(id, newGuide);
    return newGuide;
  }

  async getProfessionals(): Promise<Professional[]> {
    return Array.from(this.professionals.values());
  }

  async getProfessionalsByCategory(category: string): Promise<Professional[]> {
    return Array.from(this.professionals.values()).filter(
      (professional) => professional.category === category
    );
  }

  async createProfessional(professional: InsertProfessional): Promise<Professional> {
    const id = this.professionalId++;
    const newProfessional: Professional = {
      ...professional,
      id,
    };
    this.professionals.set(id, newProfessional);
    return newProfessional;
  }
}

export const storage = new MemStorage();
