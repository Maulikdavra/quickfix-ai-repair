import { type Guide, type Professional, type Shop, type InsertGuide, type InsertProfessional, type InsertShop } from "@shared/schema";

export interface IStorage {
  getGuide(id: number): Promise<Guide | undefined>;
  getGuides(): Promise<Guide[]>;
  getGuidesByCategory(category: string): Promise<Guide[]>;
  createGuide(guide: InsertGuide): Promise<Guide>;
  getShops(): Promise<Shop[]>;
  getShopsByCategory(category: string): Promise<Shop[]>;
  createShop(shop: InsertShop): Promise<Shop>;
  getProfessionals(): Promise<Professional[]>;
  getProfessionalsByCategory(category: string): Promise<Professional[]>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
}

export class MemStorage implements IStorage {
  private guides: Map<number, Guide>;
  private shops: Map<number, Shop>;
  private professionals: Map<number, Professional>;
  private guideId: number;
  private shopId: number;
  private professionalId: number;

  constructor() {
    this.guides = new Map();
    this.shops = new Map();
    this.professionals = new Map();
    this.guideId = 1;
    this.shopId = 1;
    this.professionalId = 1;

    // Add sample shops
    this.createShop({
      name: "Home Depot",
      category: "general",
      description: "America's largest home improvement retailer offering tools, appliances, and materials for all types of repairs.",
      website: "https://www.homedepot.com",
      logo: "🏠",
      specialties: ["Building Materials", "Tools", "Plumbing", "Electrical", "Hardware"],
      locations: [
        {
          address: "Multiple locations across the country",
          phone: "1-800-466-3337"
        }
      ]
    });

    this.createShop({
      name: "Ace Hardware",
      category: "general",
      description: "Your local hardware store with personalized service and expert advice.",
      website: "https://www.acehardware.com",
      logo: "🔧",
      specialties: ["Hardware", "Paint", "Tools", "Outdoor", "Garden"],
      locations: [
        {
          address: "Various local stores nationwide",
          phone: "1-888-827-4223"
        }
      ]
    });

    this.createShop({
      name: "Lowe's",
      category: "general",
      description: "Home improvement and appliance store offering a wide selection of repair materials.",
      website: "https://www.lowes.com",
      logo: "🏪",
      specialties: ["Appliances", "Flooring", "Tools", "Building Materials", "Lighting"],
      locations: [
        {
          address: "Nationwide locations",
          phone: "1-800-445-6937"
        }
      ]
    });

    // Add sample professionals
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

  async getShops(): Promise<Shop[]> {
    return Array.from(this.shops.values());
  }

  async getShopsByCategory(category: string): Promise<Shop[]> {
    return Array.from(this.shops.values()).filter(
      (shop) => shop.category === category || shop.specialties.includes(category)
    );
  }

  async createShop(shop: InsertShop): Promise<Shop> {
    const id = this.shopId++;
    const newShop: Shop = {
      ...shop,
      id,
    };
    this.shops.set(id, newShop);
    return newShop;
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