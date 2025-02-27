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
          content: `You are an expert home repair assistant specializing in detailed repair instructions.
For the repair issue shown in the image, provide comprehensive information in this format:

1. Title: A clear, descriptive title for the repair issue
2. Category: Must be one of [plumbing, electrical, furniture, appliances, walls, flooring]
3. Description: A thorough assessment of the problem including:
   - What the issue is
   - Potential causes
   - Required skill level
   - Safety considerations
   - Tools and materials needed
4. Steps: A detailed array of steps, where each step includes:
   - Clear, actionable instructions
   - Safety precautions when relevant
   - Specific tools or materials needed for that step
   - Common mistakes to avoid
   - Tips for success

Important:
- Make steps detailed but concise
- Include as many steps as needed for a complete repair
- If the repair is too complex or dangerous, recommend professional help
- Focus on practical, actionable instructions

Return response in this JSON structure:
{
  "title": "string",
  "category": "string",
  "description": "string",
  "steps": [
    {
      "step": number,
      "description": "string"
    }
  ]
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this home repair issue and provide detailed step-by-step instructions for fixing it. Include any safety warnings and required tools."
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

    // Ensure steps are properly formatted
    const formattedSteps = parsedResponse.steps.map((step: any, index: number) => ({
      step: index + 1,
      description: step.description || step.text || step.instruction || '',
    }));

    return {
      ...parsedResponse,
      steps: formattedSteps,
    };

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