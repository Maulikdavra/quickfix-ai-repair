import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target!.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl.split(",")[1]);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export const REPAIR_CATEGORIES = [
  { id: "plumbing", name: "Plumbing", icon: "🚰", description: "Leaks, clogs, faucets, and pipes" },
  { id: "electrical", name: "Electrical", icon: "⚡", description: "Outlets, switches, lighting" },
  { id: "furniture", name: "Furniture", icon: "🪑", description: "Assembly, repairs, and maintenance" },
  { id: "appliances", name: "Appliances", icon: "🔧", description: "Kitchen and laundry appliances" },
  { id: "walls", name: "Walls & Painting", icon: "🎨", description: "Patching, painting, and decoration" },
  { id: "flooring", name: "Flooring", icon: "🏠", description: "Tile, wood, and carpet repairs" },
  { id: "doors", name: "Doors & Windows", icon: "🚪", description: "Hinges, locks, and weatherstripping" },
  { id: "outdoor", name: "Outdoor", icon: "🌳", description: "Deck, fence, and garden repairs" }
];