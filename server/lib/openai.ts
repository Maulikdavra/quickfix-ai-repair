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
    console.log("Starting image analysis...");

    if (!base64Image) {
      throw new Error("No image data provided");
    }

    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert home repair assistant specializing in detailed repair instructions.
For the repair issue shown in the image, provide comprehensive information in this format:

1. Title: A clear, descriptive title for the repair issue
2. Category: Must be one of [plumbing, electrical, furniture, appliances, walls, flooring, doors, outdoor]
3. Description: A thorough assessment including:
   - Detailed problem description
   - Potential causes
   - Required skill level (beginner/intermediate/advanced)
   - Required tools and materials with specific details
   - Safety warnings and precautions
   - Estimated time to complete
   - When to call a professional instead
4. Steps: Detailed steps including:
   - Preparation steps (safety gear, tool setup)
   - Clear, actionable instructions
   - Specific measurements or specifications when needed
   - Tips for success
   - Common mistakes to avoid
   - Verification steps to ensure proper repair

Return response in this JSON structure:
{
  "title": "string",
  "category": "string",
  "description": "string",
  "steps": [
    {
      "step": number,
      "description": "string (including all relevant details for this step)"
    }
  ]
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this home repair issue. Focus on providing detailed, step-by-step instructions that are easy to follow. Include all necessary safety precautions and required tools."
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

    console.log("Received response from OpenAI");

    if (!visionResponse.choices[0]?.message?.content) {
      throw new Error("Empty response from AI");
    }

    const parsedResponse = JSON.parse(visionResponse.choices[0].message.content);
    console.log("Parsed response:", JSON.stringify(parsedResponse, null, 2));

    // Validate response structure
    if (!parsedResponse.title || !parsedResponse.category || !parsedResponse.description || !Array.isArray(parsedResponse.steps)) {
      throw new Error("Invalid response format from AI");
    }

    // Validate category
    const validCategories = ["plumbing", "electrical", "furniture", "appliances", "walls", "flooring", "doors", "outdoor"];
    if (!validCategories.includes(parsedResponse.category.toLowerCase())) {
      console.warn(`Invalid category '${parsedResponse.category}', defaulting to 'general'`);
      parsedResponse.category = "general";
    }

    // Ensure steps are properly formatted and numbered
    const formattedSteps = parsedResponse.steps.map((step: any, index: number) => ({
      step: index + 1,
      description: step.description || step.text || step.instruction || '',
    }));

    // Validate each step has content
    formattedSteps.forEach((step, index) => {
      if (!step.description || step.description.trim().length === 0) {
        throw new Error(`Empty step description at step ${index + 1}`);
      }
    });

    const result = {
      ...parsedResponse,
      steps: formattedSteps,
    };

    console.log("Analysis completed successfully");
    return result;

  } catch (error: any) {
    console.error("Error in analyzeRepairImage:", error);

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