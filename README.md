# Diabetes Meal Assistant

## Project Purpose

The **Diabetes Meal Assistant** is an AI-powered web application designed to help individuals managing Type 2 Diabetes make safer, balanced, and practical food choices. It provides instant, personalized feedback on meals, guiding users towards healthier eating habits without replacing professional medical advice.

## Key Features

-   **AI-Powered Meal Feedback**: Leveraging the Google Gemini AI, the assistant analyzes user-submitted meal descriptions and provides constructive feedback.
-   **Portion Guidance & Food Swaps**: Offers practical advice on portion control and suggests healthier alternatives or swaps for various food items.
-   **Nutrition Education**: Explains the impact of food choices on blood sugar levels, carbohydrate impact, and meal timing in simple, non-medical language.
-   **Conversation-like Interface**: Users can interact with the assistant through a chat-like interface, making the experience intuitive and engaging.
-   **Cultural Awareness**: Where possible, suggestions and feedback are adapted to common Filipino and international food preferences.
-   **Feedback Caching**: To prevent redundant AI calls and improve performance, feedback for previously analyzed meals is cached in a Supabase database.

## Technology Stack

-   **Frontend**: Next.js (TypeScript)
-   **Styling**: Tailwind CSS, shadcn/ui
-   **AI Integration**: Google Gemini JavaScript SDK
-   **Form Validation**: Zod
-   **Database/Caching**: Supabase (for storing and retrieving AI feedback)
-   **UI Notifications**: Sonner (toast notifications)

## Disclaimer

**This tool provides general guidance only and is not a substitute for professional medical advice. Please consult your doctor or a registered dietitian for personalized care and medical advice.**