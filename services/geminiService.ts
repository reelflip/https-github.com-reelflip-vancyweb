
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFashionAdvice = async (userPrompt: string, history: any[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: `You are 'Vancy AI Assistant', a premium fashion stylist expert in Men's essential and luxury apparel. 
        Help customers choose the right outfits from our catalog: Polo T-Shirts, Round Neck T-Shirts, Joggers, Chino Shorts, Hoodies, and Sweatshirts.
        Advise on occasions like office casuals, weekend outings, gym wear, and layering.
        Be polite, sophisticated, and helpful. Recommend Vancy's signature styles like our Supima Cotton Tees and Tech-Fleece Joggers.`
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my fashion database. Please try again later!";
  }
};

export const getInstantLookbook = async (occasion: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a 2-item outfit recommendation for: ${occasion}. Use Vancy categories like Polos, Joggers, or Chinos.`,
      config: {
        systemInstruction: "You are a master tailor. Give a 1-sentence vibe check and name 2 specific item types from our catalog.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibe: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
            reason: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { vibe: "Modern Essential", items: ["Polo T-Shirt", "Chino Shorts"], reason: "Classic summer comfort." };
  }
};

export const getPersonalizedRecommendations = async (userInterests: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 men's fashion categories for a user who likes: ${userInterests}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ['category', 'reason']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Recommendation Error:", error);
    return [];
  }
};
