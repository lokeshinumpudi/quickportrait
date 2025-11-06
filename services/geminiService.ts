import { GoogleGenAI, Modality } from "@google/genai";
import { isInvalidApiKeyError, getErrorMessage } from "../utils/errorUtils";
import { getApiKey as getStoredApiKey } from "../utils/apiKeyUtils";

const getApiKey = (): string => {
  // Get API key from localStorage (user-provided keys only)
  const storedKey = getStoredApiKey();
  if (storedKey && storedKey.trim() !== "") {
    return storedKey;
  }

  console.error("[Gemini Service] No API key found in localStorage");
  throw new Error(
    "API key not found. Please configure your Gemini API key in the settings."
  );
};

const createAIInstance = (apiKey: string) => {
  console.log(
    "[Gemini Service] Creating GoogleGenAI instance with API key:",
    apiKey
      ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
      : "MISSING"
  );
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("API key is empty or invalid");
  }
  const instance = new GoogleGenAI({ apiKey });
  console.log("[Gemini Service] GoogleGenAI instance created successfully");
  return instance;
};

export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const apiKey = getApiKey();
  console.log(
    "[Gemini Service] editImageWithGemini - API key retrieved:",
    apiKey
      ? `Length: ${apiKey.length}, Preview: ${apiKey.substring(0, 8)}...`
      : "NULL"
  );
  const ai = createAIInstance(apiKey);
  try {
    console.log("[Gemini Service] Making API call to gemini-2.5-flash-image");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Bytes = part.inlineData.data;
          const imageMimeType = part.inlineData.mimeType;
          return `data:${imageMimeType};base64,${base64Bytes}`;
        }
      }
    }

    throw new Error(
      "No images were generated. The model may have refused the prompt."
    );
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Check for invalid API key error
    if (isInvalidApiKeyError(error)) {
      throw new Error(
        "Your API key is invalid. Please check your Gemini API key in settings and update it."
      );
    }

    // Use utility to get appropriate error message
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};

export const enhancePromptWithGemini = async (
  prompt: string
): Promise<string> => {
  const apiKey = getApiKey();
  const ai = createAIInstance(apiKey);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a creative assistant and an expert prompt engineer for an AI image editing tool. Your task is to rewrite, enhance, or expand the user's prompt to be more descriptive and effective for generating high-quality, artistic images. Focus on visual details, style, composition, and lighting. Keep it concise and directly usable as a prompt. Do not add any conversational text or explanations, just return the enhanced prompt.",
      },
    });

    const enhancedPrompt = response.text.trim();
    if (!enhancedPrompt) {
      throw new Error("AI failed to enhance the prompt. Please try again.");
    }

    return enhancedPrompt;
  } catch (error) {
    console.error("Error calling Gemini API for prompt enhancement:", error);

    // Check for invalid API key error
    if (isInvalidApiKeyError(error)) {
      throw new Error(
        "Your API key is invalid. Please check your Gemini API key in settings and update it."
      );
    }

    // Use utility to get appropriate error message
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};
