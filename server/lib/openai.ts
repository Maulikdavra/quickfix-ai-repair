import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface RepairAnalysis {
  title: string;
  category: string;
  description: string;
  steps: Array<{
    step: number;
    description: string;
  }>;
}

export async function analyzeRepairImage(base64Image: string): Promise<RepairAnalysis> {
  const visionResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert home repair assistant. Analyze the image and provide detailed repair instructions. Return the response in JSON format with title, category, description, and steps array."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this home repair issue and provide step-by-step instructions to fix it."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ],
      },
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(visionResponse.choices[0].message.content);
}
