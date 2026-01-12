"use server";

import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "./lib/supabase/server";
import { formatMealResponseToHTML } from "./lib/utils";

const schema = z.object({
  diabetes_type: z.union([z.literal("type-1"), z.literal("type-2"), z.literal("gestational")]),
  meal: z.string().min(1, "We need your meal details to give accurate feedback!"),
});

type ActionState = {
  errors?: string;
  success: boolean;
  feedback?: string;
  meal?: string;
  diabetesType?: string;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function getFeedback(initialState: ActionState, formData: FormData): Promise<ActionState> {
  const rawFormData = {
    diabetes_type: formData.get("diabetes_type"),
    meal: formData.get("meal"),
  };

  const validatedFields = schema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors.meal?.join(""),
      success: false,
    };
  }

  const { diabetes_type: diabetesType, meal } = validatedFields.data;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    const prompt = `
You are Diabetes Meal Assistant, an AI agent designed to help users with Diabetes make safer, balanced, and practical food choices.
Your persona is friendly, calm, encouraging, and you should use simple, non-medical language. Avoid judgment. Use short paragraphs and bullet points for readability.

**User Information:**
- Diabetes Type: ${diabetesType}
- Meal Description: "${meal}"

**Your Task:**
1.  Analyze the meal based on the user's diabetes type.
2.  Provide feedback on the meal's components (carbs, protein, vegetables).
3.  If the meal is good, explain why in simple terms.
4.  If the meal could be improved, offer specific, practical, and healthier alternatives or swaps (e.g., "Instead of white rice, consider a smaller portion of brown rice," or "Adding a side of steamed vegetables would be great.").
5.  Include guidance on portion control if relevant.
6.  Keep the tone supportive and positive.

**Important Safety Rules:**
- DO NOT give medical diagnoses or suggest changing medication.
- End your response with the following disclaimer, separated by a clear line using line break and bolded text: 
This is general information only and not a substitute for medical advice. Please consult your doctor or dietitian for personal guidance.
`;

    const { data: response } = await supabase
      .from("meal-assistant-response")
      .select("*")
      .eq("diabetes_type", diabetesType)
      .textSearch("meal", `'${meal}'`, { config: "english", type: "phrase" });

    if (response && response.length > 0) {
      return {
        success: true,
        feedback: response[0].feedback,
        meal: response[0].meal,
        diabetesType: response[0]["diabetes_type"],
      };
    }

    console.log(response);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const aiText = result.text ?? "No response generated.";

    const formatted = formatMealResponseToHTML({
      content: aiText,
      meal,
      type: diabetesType,
    });

    const { error } = await supabase
      .from("meal-assistant-response")
      .insert({ meal, diabetes_type: diabetesType, feedback: formatted });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      feedback: formatted,
      meal: meal,
      diabetesType: diabetesType,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      errors: "Sorry, I couldn't get feedback at the moment. Please try again later.",
      success: false,
    };
  }
}
