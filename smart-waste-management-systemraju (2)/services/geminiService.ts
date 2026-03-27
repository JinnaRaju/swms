
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBotResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are a friendly and helpful AI assistant for the "Smart Waste Management System" app. 
        Your role is to answer user questions about waste-related issues, how to use the app, and general inquiries. 
        Keep your answers concise, clear, and encouraging. 
        If asked about a specific complaint status, tell the user they can check the "Status Tracking" page for real-time updates.
        If asked how to file a complaint, guide them to the "Complaint" page and mention they can upload images and specify a location.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error getting response from Gemini API:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.";
  }
};
