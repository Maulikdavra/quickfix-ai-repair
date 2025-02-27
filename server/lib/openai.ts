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
  try {
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert home repair assistant. Analyze the image and provide detailed repair instructions. Focus on:
1. Safety considerations
2. Required tools and materials
3. Step-by-step instructions that are clear and actionable
4. Common mistakes to avoid
5. When to call a professional

Return the response in JSON format with:
- title: A clear, concise title of the repair
- category: One of: plumbing, electrical, furniture, appliances, walls, flooring
- description: A detailed overview of the problem and solution
- steps: Array of numbered steps with clear instructions`
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

    const parsedResponse = JSON.parse(visionResponse.choices[0].message.content);

    // Validate the response structure
    if (!parsedResponse.title || !parsedResponse.category || !parsedResponse.description || !Array.isArray(parsedResponse.steps)) {
      throw new Error("Invalid response format from AI");
    }

    return parsedResponse;
  } catch (error: any) {
    if (error.code === 'insufficient_quota') {
      throw new Error("OpenAI API quota exceeded. Please try again later.");
    } else if (error.code === 'invalid_api_key') {
      throw new Error("Invalid OpenAI API key. Please check your configuration.");
    } else if (error.code === 'rate_limit_exceeded') {
      throw new Error("Too many requests. Please try again in a few moments.");
    }

    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}